try {
    require("dotenv").config();
} catch (e) {
    // dotenv might not be installed in production
}

const mysql = require("mysql2");


const caCert = process.env.DB_CA ? process.env.DB_CA.replace(/\\n/g, '\n') : undefined;

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: caCert ? {
        ca: caCert,
        rejectUnauthorized: true
    } : null
};


const pool = mysql.createPool(dbConfig);


pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error al conectar a TiDB:", err.message);
        return;
    }
    console.log("¡Conexión exitosa a TiDB Cloud!");
    connection.release();
});

module.exports = pool;