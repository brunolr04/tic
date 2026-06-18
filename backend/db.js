const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err.stack);
    } else {
        console.log("¡Conexión exitosa a NEON!");
    }
    if (release) release();
});

module.exports = pool;