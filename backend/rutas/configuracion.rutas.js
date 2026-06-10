const express = require("express");

const router = express.Router();

const {
    obtenerConfiguracion,
    actualizarConfiguracion
} = require("../controlador/configuracion.controlador");

router.get("/", obtenerConfiguracion);

router.put("/", actualizarConfiguracion);

module.exports = router;