const conexion = require("../db");

// Get all gloves for a user
const obtenerGuantes = (req, res) => {
    const id_usuario = req.params.id_usuario || req.query.id_usuario;

    if (!id_usuario) {
        return res.status(400).json({ mensaje: "Se requiere id_usuario" });
    }

    conexion.query(
        "SELECT * FROM guante WHERE id_usuario = $1",
        [id_usuario],
        (error, resultados) => {
            if (error) return res.status(500).json(error);
            res.json(resultados.rows);
        }
    );
};

// Update glove connection state and battery
const actualizarEstadoGuante = (req, res) => {
    const id_guante = req.params.id_guante;
    const { estado_conexion, nivel_bateria } = req.body;

    conexion.query(
        `UPDATE guante
         SET estado_conexion = COALESCE($1, estado_conexion),
             nivel_bateria = COALESCE($2, nivel_bateria)
         WHERE id_guante = $3
         RETURNING *`,
        [estado_conexion, nivel_bateria, id_guante],
        (error, resultado) => {
            if (error) return res.status(500).json(error);
            if (resultado.rows.length === 0) {
                return res.status(404).json({ mensaje: "Guante no encontrado" });
            }
            res.json(resultado.rows[0]);
        }
    );
};

module.exports = {
    obtenerGuantes,
    actualizarEstadoGuante
};
