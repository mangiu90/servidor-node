const express = require('express');
const { check } = require('express-validator');
const tareaController = require('../controllers/tareaController');
const auth = require('../middlewares/auth');

const router = express.Router();

//api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').notEmpty()
    ],
    tareaController.crearTarea
);

router.get('/:proyectoId',
    auth,
    tareaController.obtenerTareas
);

router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').notEmpty()
    ],
    tareaController.editarTarea
);

router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;