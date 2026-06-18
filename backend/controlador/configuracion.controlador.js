const conexion = require("../db");

const obtenerConfiguracion = (req, res) => {

    conexion.query(
        "SELECT * FROM configuracion_guante WHERE id_guante = 1",
        (error, resultados) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json(resultados.rows[0]);
        }
    );
};

const actualizarConfiguracion = (req, res) => {

    conexion.query(
        `UPDATE configuracion_guante
         SET intensidad_vibracion = $1,
             sensibilidad_sensor = $2
         WHERE id_guante = 1`,
        [
            req.body.intensidad_vibracion,
            req.body.sensibilidad_sensor
        ],
        (error) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({
                mensaje: "Configuración actualizada"
            });
        }
    );
};

module.exports = {
    obtenerConfiguracion,
    actualizarConfiguracion
};