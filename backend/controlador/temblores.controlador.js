const conexion = require("../db");

const obtenerTemblores = (req, res) => {

    conexion.query(
        "SELECT * FROM medicion_temblor ORDER BY fecha_hora DESC",
        (error, resultados) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json(resultados);
        }
    );
};

const agregarTemblor = (req, res) => {

    conexion.query(
        `INSERT INTO medicion_temblor
        (id_guante, frecuencia_hz, intensidad, vibracion_activada, duracion_segundos)
        VALUES (?, ?, ?, ?, ?)`,
        [
            1,
            req.body.frecuencia,
            req.body.intensidad,
            req.body.vibracion_activada,
            req.body.duracion_segundos
        ],
        (error, resultado) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({
                mensaje: "Temblor guardado en MySQL",
                id: resultado.insertId
            });
        }
    );
};

module.exports = {
    obtenerTemblores,
    agregarTemblor
};