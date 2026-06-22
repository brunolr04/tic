const conexion = require("../db");

const obtenerConfiguracion = (req, res) => {
    const id_guante = req.params.id_guante || req.query.id_guante || 1;

    conexion.query(
        "SELECT * FROM configuracion_guante WHERE id_guante = $1 LIMIT 1",
        [id_guante],
        (error, resultados) => {
            if (error) {
                return res.status(500).json(error);
            }
            res.json(resultados.rows[0] || null);
        }
    );
};

const actualizarConfiguracion = (req, res) => {
    const id_guante = req.params.id_guante || req.body.id_guante || 1;

    conexion.query(
        `UPDATE configuracion_guante
         SET intensidad_vibracion = $1,
             sensibilidad_sensor = $2,
             modo_funcionamiento = COALESCE($3, modo_funcionamiento),
             fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id_guante = $4`,
        [
            req.body.intensidad_vibracion,
            req.body.sensibilidad_sensor,
            req.body.modo_funcionamiento || null,
            id_guante
        ],
        (error) => {
            if (error) {
                return res.status(500).json(error);
            }
            res.json({ mensaje: "Configuración actualizada" });
        }
    );
};

module.exports = {
    obtenerConfiguracion,
    actualizarConfiguracion
};