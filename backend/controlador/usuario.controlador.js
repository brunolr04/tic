const conexion = require("../db");

const registrarUsuario = (req, res) => {

    conexion.query(
        `INSERT INTO usuario (nombre, correo, contrasena, edad, diagnostico)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_usuario`,
        [
            req.body.nombre,
            req.body.correo,
            req.body.contrasena,
            req.body.edad,
            req.body.diagnostico
        ],
        (error, resultado) => {

            if (error) {
                // Unique correo constraint violation
                if (error.code === '23505') {
                    return res.status(409).json({ mensaje: "El correo ya está registrado" });
                }
                return res.status(500).json(error);
            }

            const id_usuario = resultado.rows[0].id_usuario;

            // Auto-create a default glove for the new user
            conexion.query(
                `INSERT INTO guante (id_usuario, nombre_guante, codigo_serie, estado_conexion, nivel_bateria)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_guante`,
                [
                    id_usuario,
                    'ESP32-GLOVE-01',
                    `GLOVE-${id_usuario}-${Date.now()}`,
                    'desconectado',
                    100
                ],
                (errGuante, resGuante) => {
                    if (errGuante) {
                        return res.status(500).json(errGuante);
                    }

                    const id_guante = resGuante.rows[0].id_guante;

                    // Auto-create default glove configuration
                    conexion.query(
                        `INSERT INTO configuracion_guante (id_guante, modo_funcionamiento, intensidad_vibracion, sensibilidad_sensor)
                        VALUES ($1, $2, $3, $4)`,
                        [id_guante, 'normal', 5, 5],
                        (errConfig) => {
                            if (errConfig) {
                                return res.status(500).json(errConfig);
                            }

                            res.json({
                                mensaje: "Usuario registrado",
                                id: id_usuario,
                                id_guante: id_guante
                            });
                        }
                    );
                }
            );
        }
    );
};

const loginUsuario = (req, res) => {

    conexion.query(
        `SELECT u.*, g.id_guante
        FROM usuario u
        LEFT JOIN guante g ON g.id_usuario = u.id_usuario
        WHERE u.correo = $1 AND u.contrasena = $2
        LIMIT 1`,
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