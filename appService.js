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

// Query 1 : Insert
// Insert one tuple to the Pokemon(TrainsPokemoniD, PokemonName, TypeName, PokemonGender, Ability, TrainerID )
// Handling the foriegn key : Typename
async function insertDemotable(id, name, type, gender, ability, trainer) {
    return await withOracleDB(async (connection) => {
        // Handle FK, when FK does not exist, reject it.
        const trainerCheck = await connection.execute(
            `SELECT TypeName FROM PokemonType WHERE TypeName = :type`,
            [type]
        );

        if (trainerCheck.rows.length === 0) {
            console.error("Error: TypeName does not exist");
            throw new Error("TypeName does not exist");
        }

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


// Query 2 : Update
// Update the table PokemonTrains(PokemoniD, PokemonName, TypeName, PokemonGender, Ability, TrainerID )
// (PK is PokemoniD, PokemonName UNIQUE,  TypeName FK)
// can update any number of non-pk
async function updateTable(id, updates) {
    return await withOracleDB(async (connection) => {
        const update = [];
        const bindVars = { id }; // pk

        if (updates.name) {
            update.push("PokemonName = :name");
            bindVars.name = updates.name;
        }
        if (updates.type) {
            update.push("TypeName = :type");
            bindVars.type = updates.type;
        }
        if (updates.gender) {
            update.push("PokemonGender = :gender");
            bindVars.gender = updates.gender;
        }
        if (updates.ability) {
            update.push("Ability = :ability");
            bindVars.ability = updates.ability;
        }
        if (updates.trainerID) {
            update.push("TrainerID = :trainerID");
            bindVars.trainerID = updates.trainerID;
        }

        if (update.length === 0) {
            console.error("no new update");
            return false;
        }

        const sql = ` UPDATE PokemonTrains 
                      SET ${update.join(', ')} 
                      WHERE PokemonID = :id`;

        const result = await connection.execute(sql, bindVars, { autoCommit: true });

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Update failed:", err.message);
        return false;
    });
}

// Query 3 : Delete
// Delete a specific tuple in PokemonTrains(PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID )
// by specify the PK PokemonID
async function deleteID(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM PokemonTrains WHERE PokemonID = :id`,
            [id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



// Query 4 : Selection
// Allowed to search for tuples using any number of AND/OR clauses and combinations of attributes in PokemonTrains
function buildSelectClause(attributes) {
    if (!attributes || attributes.length === 0) {
        return '*';
    }
    return attributes.join(', ');
}

async function filterTable(attribute, whereClause) {
    const selectClause = buildSelectClause(attribute);
    const query = `SELECT ${selectClause} FROM PokemonTrains p JOIN PokemonType t ON p.TypeName = t.TypeName
    WHERE ${whereClause}`;
    console.log(query)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            query
        );
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// Query 5 : projection
// project any number of attributes of PokemonTrains Table
async function projection(attribute) {
    const attributes = (!attribute || attribute.length === 0) ? '*' : attribute.join(',');

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${attributes}
            FROM PokemonTrains p JOIN PokemonType t ON p.TypeName = t.TypeName`,
            { autoCommit: true }
        );
        console.log("AAAAAAAAAAAAAAAA", result, trainerID)
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// Query 6 : join
// joins the Trainer and PokemonTrains tables to find all Pokemon trained by a specific trainer, based on the trainer's ID.
async function trainerSearch(trainerID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.TrainerID, t.TrainerName, p.PokemonID, p.PokemonName
FROM Trainer t
JOIN PokemonTrains p ON t.TrainerID = p.TrainerID
WHERE t.TrainerID=:trainerID`,
            [trainerID],
            { autoCommit: true }
        );
        console.log("AAAAAAAAAAAAAAAA", result, trainerID)
        return result.rows;
    }).catch(() => {
        return false;
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




module.exports = {
    initiateDemotable,
    updateTable,
    fetchDemotableFromDb,
    insertDemotable,
    getAverageAttackByType,
    getHighDefenseTable,
    strongTrainersTable,
    allCategoriesTrainersTable,
    trainerSearch,
    filterTable,
    buildSelectClause,
    deleteID,
    projection
}