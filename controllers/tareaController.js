const { validationResult } = require('express-validator');
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");

exports.crearTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        let proyecto = await Proyecto.findById(req.body.proyectoId);
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        let tarea = new Tarea(req.body);
        tarea.save();

        res.status(200).json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

exports.obtenerTareas = async (req, res) => {
    try {
        let proyecto = await Proyecto.findById(req.params.proyectoId);
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        const tareas = await Tarea.find({ proyectoId: req.params.proyectoId }).sort({ created_at: -1 });

        res.status(200).json({ tareas })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

exports.editarTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, estado } = req.body;
    const nuevaTarea = {};

    // if (nombre) {
        nuevaTarea.nombre = nombre;
    // }

    // if (estado) {
        nuevaTarea.estado = estado;
    // }

    try {
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        let proyecto = await Proyecto.findById(tarea.proyectoId);
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevaTarea }, { new: true });

        res.status(200).json({ tarea })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }

}

exports.eliminarTarea = async (req, res) => {
    try {
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        let proyecto = await Proyecto.findById(tarea.proyectoId);
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //actualizar proyecto
        tarea = await Tarea.findOneAndRemove({ _id: req.params.id });

        res.status(200).json({ msg: 'Tarea eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}