const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');
const path = require('path');
const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection();
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM PokemonTrains`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//Query 7: Aggregation with GROUP BY
//average attack per pokemon type
async function getAverageAttackByType() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT p.TypeName, AVG(s.Attack) AS AvgAttack
FROM PokemonTrains p
JOIN Shows sh ON p.PokemonID = sh.PokemonID
JOIN Stats s ON sh.StatsID = s.StatsID
GROUP BY p.TypeName
`);
        return result.rows;
    }).catch((err) => {
        console.log("Error getting average attack by type in DB connection", err);
        return [];
    });
}

//Query 8: Aggregation with HAVING
//types with average defense greater than 10
async function getHighDefenseTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT p.TypeName, AVG(s.Defense) AS AvgDefense
FROM PokemonTrains p
JOIN Shows sh ON p.PokemonID = sh.PokemonID
JOIN Stats s ON sh.StatsID = s.StatsID
GROUP BY p.TypeName
HAVING AVG(s.Defense) > 10
`);
        return result.rows;
    }).catch((err) => {
        console.log("Error getting average attack by type in DB connection", err);
        return [];
    });
}

//Query 9: Nested Aggregation with GROUP BY
//find trainerName with Pokemon stats larger than average stats
async function strongTrainersTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT t.TrainerName, AVG(s.HP + s.Attack + s.Defense + s.SpecialAttack + s.SpecialDefense + s.Speed) AS AvgTotalStats
FROM Trainer t
JOIN PokemonTrains pt ON t.TrainerID = pt.TrainerID
JOIN Shows sh ON pt.PokemonID = sh.PokemonID
JOIN Stats s ON sh.StatsID = s.StatsID
GROUP BY t.TrainerName
HAVING AVG(s.HP + s.Attack + s.Defense + s.SpecialAttack + s.SpecialDefense + s.Speed) > (
    SELECT AVG(HP + Attack + Defense + SpecialAttack + SpecialDefense + Speed)
    FROM Stats
)
`);
        return result.rows;
    }).catch((err) => {
        console.log("Error getting average attack by type in DB connection", err);
        return [];
    });
}

//Query 10: Division
//trainers who own at least one pokemon from every category
async function allCategoriesTrainersTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT t.TrainerName
FROM Trainer t
WHERE NOT EXISTS (
   SELECT c.CategoryName FROM Category c
    MINUS 
    SELECT b.CategoryName
    FROM BelongsTo b
    JOIN PokemonTrains pt ON b.PokemonID = pt.PokemonID
    WHERE pt.TrainerID = t.TrainerID
)
`);
        return result.rows;
    }).catch((err) => {
        console.log("Error getting average attack by type in DB connection", err);
        return [];
    });
}

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE POKEMON`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to creat...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE POKEMON (
//             id NUMBER PRIMARY KEY,
//             name VARCHAR2(20)
//             )
//         `);
//         console.log("Initialize table")
//         return true;
//     }).catch(()=> {
//         return false;
//     }
//     );
// }
async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            const createTableScript = fs.readFileSync(
                path.join(__dirname, '/SQL/createTableScript.sql'),
                'utf8'
            );

            // Split by "END;\n/" for PL/SQL blocks, if any
            const statements = createTableScript.split("END;\n/").map(statement => statement.trim()).filter(statement => statement.length > 0);

            for (let statement of statements) {
                if (statement.startsWith("BEGIN")) {
                    if (!statement.endsWith("END;")) {
                        statement += "END;";
                    }
                    // console.log("stat:", statement);
                    await connection.execute(statement, [], { autoCommit: true });
                } else {
                    const substatements = statement.split(';').map(sub => sub.trim()).filter(sub => sub.length > 0);
                    for (let sub of substatements) {
                        console.log("sub:", sub);
                        result = await connection.execute(sub, [], { autoCommit: true });
                        console.log("RESULT", result);
                    }
                }
            }

            console.log("Tables initialized from script");
            return true;
        } catch (err) {
            console.error("Error initializing tables:", err);
            return false;
        }
    }).catch((err) => {
        console.error("Database connection error:", err);
        return false;
    });
}
async function insertDemotable(id, name, type, gender, ability, trainer) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES (:id, :name, :type, :gender, :ability, :trainer)`,
            [id, name, type, gender, ability, trainer],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateTable(oldname, newname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PokemonTrains SET name=:newname where name=:oldname`,
            [newname, oldname],
            { autoCommit: true }
        );
        console.log(result, oldname, newname)
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}




module.exports = {
    initiateDemotable,
    updateTable,
    fetchDemotableFromDb,
    insertDemotable,
    getAverageAttackByType,
    getHighDefenseTable,
    strongTrainersTable,
    allCategoriesTrainersTable
}