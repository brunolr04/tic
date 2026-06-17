const conexion = require("../db");

const registrarUsuario = (req, res) => {

    conexion.query(
        `INSERT INTO usuario
        (nombre, correo, contrasena, edad, diagnostico)
        VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario`,
        [
            req.body.nombre,
            req.body.correo,
            req.body.contrasena,
            req.body.edad,
            req.body.diagnostico
        ],
        (error, resultado) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({
                mensaje: "Usuario registrado",
                id: resultado.rows[0].id_usuario
            });
        }
    );
};

const loginUsuario = (req, res) => {

    conexion.query(
        `SELECT * FROM usuario
        WHERE correo = $1
        AND contrasena = $2`,
        [
            req.body.correo,
            req.body.contrasena
        ],
        (error, resultados) => {

            if (error) {
                return res.status(500).json(error);
            }

            if (resultados.rows.length === 0) {
                return res.status(401).json({
                    mensaje: "Correo o contraseña incorrectos"
                });
            }

            res.json({
                mensaje: "Login correcto",
                usuario: resultados.rows[0]
            });
        }
    );
};

module.exports = {
    registrarUsuario,
    loginUsuario
};