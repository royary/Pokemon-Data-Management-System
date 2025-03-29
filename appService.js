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
        const result = await connection.execute(`SELECT * FROM POKEMON`);
        return result.rows;
    }).catch(()=>{
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
          
            const statements = createTableScript.split("END;\n/").map(statement => statement.trim()).filter(statement => statement.length > 0);
            
            // Execute each statement in the script
            for (let statement of statements) {
                if (statement.startsWith("--")) continue;
                if (statement.startsWith("BEGIN")) {
                    
                    statement += "END;"
                    console.log("stat:", statement)
                    await connection.execute(statement);
                } else {
                    substatements = statement.split(';').map(sub => sub.trim() + ";").filter(sub => sub.length > 0);
                    for (let sub of substatements) {
                        console.log("sub:", sub)
                        // await connection.execute(sub);
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

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO POKEMON (id, name) VALUES (:id, :name)`,
            [id, name],
            {autoCommit: true}
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateTable(oldname, newname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE POKEMON SET name=:newname where name=:oldname`,
            [newname, oldname],
            { autoCommit: true }
        );
        console.log(result, oldname, newname)
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}




module.exports = {initiateDemotable, 
    updateTable,
    fetchDemotableFromDb,
    insertDemotable}