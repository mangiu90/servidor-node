// rutas para proyectos
const express = require('express');
const { check } = require('express-validator');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth');

const router = express.Router();

//crea proyectos
//api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],
    proyectoController.crearProyecto
);

//obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

//actualizar proyecto via id
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],
    proyectoController.editarProyecto
);

//eliminar proyecto 
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;