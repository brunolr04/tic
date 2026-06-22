const express = require("express");
const cors = require("cors");
const conexion = require("./db"); 

const usuariosRutas = require("./rutas/usuario.rutas");
const tembloresRutas = require("./rutas/temblores.rutas");
const configuracionRutas = require("./rutas/configuracion.rutas");
const guanteRutas = require("./rutas/guante.rutas");

const app = express();

const corsOptions = {
  origin: [
    'https://tic-nine-sepia.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/temblores", tembloresRutas);
app.use("/configuracion", configuracionRutas);
app.use("/usuarios", usuariosRutas);
app.use("/guantes", guanteRutas);

app.get("/status", (req, res) => {
  res.status(200).json({ message: "Servidor operativo" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;