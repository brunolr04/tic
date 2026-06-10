const express = require("express");
const cors = require("cors");
require("./db");

const usuariosRutas = require("./rutas/usuarios.rutas");
const tembloresRutas = require("./rutas/temblores.rutas");
const configuracionRutas = require("./rutas/configuracion.rutas");
const app = express();

app.use(cors());

app.use(express.json());


app.use("/temblores", tembloresRutas);
app.use("/configuracion", configuracionRutas);
app.use("/usuarios", usuariosRutas);

app.listen(3000, () => {

    console.log("Servidor corriendo");
});