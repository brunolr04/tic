try {
    require("dotenv").config();
} catch (e) {
    // dotenv might not be installed in production
}

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("ADVERTENCIA: DATABASE_URL no está definida.");
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString && connectionString.includes("sslmode=require") ? {
        rejectUnauthorized: false
    } : false
});

// Test connection
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error al conectar a PostgreSQL/Neon:", err.message);
    } else {
        console.log("¡Conexión exitosa a PostgreSQL/Neon!");
    }
});

module.exports = pool;