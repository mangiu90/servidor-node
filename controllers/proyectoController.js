const { validationResult } = require('express-validator');
const Proyecto = require("../models/Proyecto");

exports.crearProyecto = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //creo proyecto
        let proyecto = new Proyecto(req.body);

        //agrgo creador desde jwt
        proyecto.creador = req.usuario.id

        //guardo proyecto
        proyecto.save();

        //mensaje de confirmacion
        res.status(200).json({ proyecto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ created_at: -1 });

        res.status(200).json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//editar un proyecto
exports.editarProyecto = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyeto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //actualizar proyecto
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        res.status(200).json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

//editar un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyeto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //actualizar proyecto
        proyecto = await Proyecto.findOneAndRemove({ _id: req.params.id });

        res.status(200).json({ msg: 'Proyecto eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}