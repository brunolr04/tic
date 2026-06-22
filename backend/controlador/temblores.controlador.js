const conexion = require("../db");

const obtenerTemblores = (req, res) => {
    // If a id_guante query param is provided, filter by it
    const id_guante = req.query.id_guante;
    const query = id_guante
        ? "SELECT * FROM medicion_temblor WHERE id_guante = $1 ORDER BY fecha_hora DESC LIMIT 100"
        : "SELECT * FROM medicion_temblor ORDER BY fecha_hora DESC LIMIT 100";
    const params = id_guante ? [id_guante] : [];

    conexion.query(query, params, (error, resultados) => {
        if (error) {
            return res.status(500).json(error);
        }
        res.json(resultados.rows);
    });
};

const agregarTemblor = (req, res) => {

    const {
        id_guante,
        frecuencia,
        intensidad,
        vibracion_activada,
        duracion_segundos,
        movimiento_detectado = null,
        magnitud = null
    } = req.body;

    if (!id_guante) {
        return res.status(400).json({ mensaje: "Se requiere id_guante" });
    }

    conexion.query(
        `INSERT INTO medicion_temblor
        (id_guante, frecuencia_hz, intensidad, vibracion_activada, duracion_segundos, movimiento_detectado, magnitud)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_medicion`,
        [id_guante, frecuencia, intensidad, vibracion_activada, duracion_segundos, movimiento_detectado, magnitud],
        (error, resultado) => {
            if (error) {
                return res.status(500).json(error);
            }
            res.json({
                mensaje: "Temblor guardado",
                id: resultado.rows[0].id_medicion
            });
        }
    );
};

module.exports = {
    obtenerTemblores,
    agregarTemblor
};