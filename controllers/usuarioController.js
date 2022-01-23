const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const Usuario = require("../models/Usuario");

exports.crearUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar que el usuario registardo sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //crear usuario
        usuario = new Usuario(req.body);

        //hashear password
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar usuario
        await usuario.save();

        //crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        },  (error, token) => {
            if (error) throw error;

            //mensaje de confirmacion
            res.status(200).json({ token });
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error' });
    }
}