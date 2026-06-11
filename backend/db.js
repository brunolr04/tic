const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: process.env.DB_HOST || "gateway01.us-east-1.prod.aws.tidbcloud.com",
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER || "4WSwdnCgLc7HNNe.root",
    password: process.env.DB_PASSWORD || "0QLelvgRWrDBE31g",
    database: process.env.DB_DATABASE || "zenit_glove_db",
    
    ssl: {
        minVersion: 'TLSv1.2',
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