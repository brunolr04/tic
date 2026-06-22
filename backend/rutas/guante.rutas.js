const express = require("express");
const router = express.Router();
const { obtenerGuantes, actualizarEstadoGuante } = require("../controlador/guante.controlador");

router.get("/usuario/:id_usuario", obtenerGuantes);
router.put("/:id_guante/estado", actualizarEstadoGuante);

module.exports = router;
