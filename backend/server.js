const express = require("express");
const cors = require("cors");
const conexion = require("./db"); 

const usuariosRutas = require("./rutas/usuarios.rutas");
const tembloresRutas = require("./rutas/temblores.rutas");
const configuracionRutas = require("./rutas/configuracion.rutas");

const app = express();

const corsOptions = {
  origin: 'https://tic-nine-sepia.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use("/temblores", tembloresRutas);
app.use("/configuracion", configuracionRutas);
app.use("/usuarios", usuariosRutas);

app.get("/status", (req, res) => {
  res.status(200).json({ message: "Servidor operativo" });
});

module.exports = app;