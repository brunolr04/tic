const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    
    ssl: {
        ca: process.env.DB_CA,
        rejectUnauthorized: true
    }
});

conexion.connect((error) => {
    if (error) {
        console.log("Error al conectar a TiDB Cloud:", error);
        return;
    }
    console.log("¡Conexión exitosa a TiDB Cloud (MySQL) establecida!");
});

module.exports = conexion;