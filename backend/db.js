const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "la_contra_de_tu_BDD",//yo ocupe mysql, pone la contraseña q te pide al instalar mysql
    database: "zenit_glove_db" //el name q le puso el renato a la bdd
});

conexion.connect((error) => {

    if (error) {
        console.log("Error BD:", error);
        return;
    }

    console.log("MySQL conectado");
});

module.exports = conexion;