// rutas para crear usuario
const express = require('express');
const { check } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// crea un usuario
// api/usuarios
router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
],
    usuarioController.crearUsuario
);

module.exports = router;