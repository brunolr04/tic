const express = require("express");

const router = express.Router();

const {
    obtenerTemblores,
    agregarTemblor
} = require("../controlador/temblores.controlador");

router.get("/", obtenerTemblores);

router.post("/", agregarTemblor);

module.exports = router;