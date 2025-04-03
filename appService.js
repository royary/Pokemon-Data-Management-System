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

async function fetchStatFromDb() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`SELECT p.PokemonID, p.PokemonName, s.HP, s.Attack, s.Defense, s.SpecialAttack, s.SpecialDefense, s.Speed
                FROM PokemonTrains p
                JOIN Shows sh ON p.PokemonID = sh.PokemonID
                JOIN Stats s ON sh.StatsID = s.StatsID`);
            return result.rows;
        } catch (err) {
            console.error("fetchStatFromDb error:", err);
            throw err;
        }
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            const createTableScript = fs.readFileSync(
                path.join(__dirname, 'Milestone4_Group26', 'initial.sql'),
                'utf8'
            );

            // Split by "END;\n/" for PL/SQL blocks, if any
            const statements = createTableScript.split("END;\n/").map(statement => statement.trim()).filter(statement => statement.length > 0);

            for (let statement of statements) {
                if (statement.startsWith("BEGIN")) {
                    if (!statement.endsWith("END;")) {
                        statement += "END;";
                    }
                    console.log("stat:", statement);
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

// Query 1 : Insert (1)
// Insert a tuple into PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID)
// Handles the foreign key TypeName: rejects insertion if TypeName doesn't exist.
async function insertPokemonTrainstable(id, name, type, gender, ability, trainer) {
    // Sanitization
    if (typeof id !== "string" || !/^\d+$/.test(id) || id.length < 0) {
        console.error("Invalid Pokemon ID");
        return false;
    }
    if (typeof name !== "string" || name.trim() === "" || name.length > 10) {
        console.error("Invalid Pokemon Name");
        return false;
    }
    if (typeof type !== "string" || type.trim() === "" || type.length > 10) {
        console.error("Invalid TypeName");
        return false;
    }
    if (!["M", "F", "F/M"].includes(gender)) {
        console.error("Invalid Gender");
        return false;
    }
    if (typeof ability !== "string" ) {
        console.error("Invalid Ability");
        return false;
    }
    if (typeof trainer !== "string" || !/^\d+$/.test(trainer) || trainer.length < 0) {
        console.error("Invalid Trainer ID");
        return false;
    }

    return await withOracleDB(async (connection) => {
        const typeCheck = await connection.execute(
            `SELECT TypeName FROM PokemonType WHERE TypeName = :type`,
            [type]
        );

        if (typeCheck.rows.length === 0) {
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

// Insert (2)
// Insert a tuple to Shows(PokemonID,StatsID)
// Handles the foreign key PokemonID and StatsID: rejects insertion if PokemonID and StatsID doesn't exist.
async function insertShowsTable(PokemonID,StatsID) {
    //Sanitization
    if (!Number.isInteger(PokemonID) || PokemonID <= 0) {
        console.error("Invalid PokemonID");
        return false;
    }
    if (!Number.isInteger(StatsID) || StatsID <= 0) {
        console.error("Invalid StatsID");
        return false;
    }

    return await withOracleDB(async (connection) => {
        const pokemonCheck = await connection.execute(
           `SELECT PokemonID FROM PokemonTrains WHERE PokemonID = :PokemonID`,
            [PokemonID] 
        );
        
        if (pokemonCheck.rows.length === 0) {
            console.error("Error: PokemonID does not exist");
            throw new Error("PokemonID does not exist");
        }

        const statsCheck = await connection.execute(
            `SELECT StatsID FROM Stats WHERE StatsID = :StatsID`,
            [StatsID] 
        );
        if (statsCheck.rows.length === 0) {
            console.error("Error: StatsID does not exist");
            throw new Error("StatsID does not exist");
        }

        const showsTable = await connection.execute (
            'INSERT INTO Shows(PokemonID,StatsID) VALUES (:PokemonID,:StatsID)',
            [PokemonID, StatsID],
            { autoCommit: true }
        );
        return showsTable.rowsAffected && showsTable.rowsAffected > 0;

    }).catch(() => {
        return false;
    });
}


// Query 2 : Update
// Update a tuple in PokemonTrains by PokemonID (PK).
// Updates any combination of non-PK fields: PokemonName, TypeName, PokemonGender, Ability, TrainerID.
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
// Delete a tuple from PokemonTrains by PokemonID (PK)
async function deleteID(id) {
    if (typeof id !== "string" || !/^\d+$/.test(id)) {
        console.error("Invalid Pokemon ID");
        return false;
    }
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
        console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// Query 5 : projection
// Project any number of attributes from the PokemonTrains table
async function projection(attribute) {
    const attributes = (!attribute || attribute.length === 0) ? '*' : attribute.join(',');

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${attributes} FROM PokemonTrains p 
            JOIN PokemonType t ON p.TypeName = t.TypeName`)
        console.log("Projection result:", result.rows);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// Query 6 : join
// Join Trainer and PokemonTrains to find all Pokemon trained by a specific trainer
async function trainerSearch(trainerID) {
    if (!Number.isInteger(trainerID) || trainerID <= 0) {
        console.error("Invalid Trainer ID");
        return false;
    }
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.TrainerID, t.TrainerName, p.PokemonID, p.PokemonName
            FROM Trainer t
            JOIN PokemonTrains p ON t.TrainerID = p.TrainerID
            WHERE t.TrainerID=:trainerID`,
            [trainerID],
        );
        console.log(`Searching for TrainerID: ${trainerID}`);
        console.log("Trainer-Pokemon join result:", result.rows);
        return result.rows;
    }).catch(() => {
        return false;
    });
}


// Query 7: Aggregation with GROUP BY
// Get average attack value grouped by TypeName
async function getAverageAttackByType() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT p.TypeName, AVG(s.Attack) AS AvgAttack
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

// Query 8: Aggregation with HAVING
// Get TypeNames with average defense > 10
async function getHighDefenseTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT p.TypeName, AVG(s.Defense) AS AvgDefense
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

// Query 9: Nested Aggregation with GROUP BY
// Get trainer names whose Pokemon have above-average total stats
async function strongTrainersTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.TrainerName, AVG(s.HP + s.Attack + s.Defense + s.SpecialAttack + s.SpecialDefense + s.Speed) AS AvgTotalStats
            FROM Trainer t
            JOIN PokemonTrains pt ON t.TrainerID = pt.TrainerID
            JOIN Shows sh ON pt.PokemonID = sh.PokemonID
            JOIN Stats s ON sh.StatsID = s.StatsID
            GROUP BY t.TrainerName
            HAVING AVG(s.HP + s.Attack + s.Defense + s.SpecialAttack + s.SpecialDefense + s.Speed) > (
            SELECT AVG(HP + Attack + Defense + SpecialAttack + SpecialDefense + Speed)
            FROM Stats)
`);
        return result.rows;
    }).catch((err) => {
        console.log("Error getting average attack by type in DB connection", err);
        return [];
    });
}

// Query 10: Division
// Get trainers who own at least one Pokemon from every category
async function allCategoriesTrainersTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.TrainerName
            FROM Trainer t
            WHERE NOT EXISTS (
            SELECT c.CategoryName FROM Category c
            MINUS 
            SELECT b.CategoryName
            FROM BelongsTo b
            JOIN PokemonTrains pt ON b.PokemonID = pt.PokemonID
            WHERE pt.TrainerID = t.TrainerID)
`);
        return result.rows;
    }).catch((err) => {
        console.log("Error getting average attack by type in DB connection", err);
        return [];
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

module.exports = {
    initiateDemotable,
    fetchDemotableFromDb,
    insertPokemonTrainstable,
    insertShowsTable,
    updateTable,
    projection,
    getAverageAttackByType,
    getHighDefenseTable,
    strongTrainersTable,
    allCategoriesTrainersTable,
    trainerSearch,
    filterTable,
    buildSelectClause,
    deleteID,
    fetchStatFromDb,
    insertDemotable
}