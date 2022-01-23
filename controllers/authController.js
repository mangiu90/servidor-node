const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const Usuario = require("../models/Usuario");

exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar que sea usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //revisar password
        const passCorrecto = bcrypt.compareSync(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password incorrecto' });
        }

        //crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error;

            //mensaje de confirmacion
            res.status(200).json({ token });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        let usuario = await Usuario.findById(req.usuario.id).select('-password');
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }
        res.status(200).json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}