const express = require('express');
const router = express.Router();
const Formulario = require('../models/formularioroutes');

// Ruta para guardar formulario
router.post('/procesar-formulario', async (req, res) => {
try {
    const { nombre, email, telefono, horarioDeContacto } = req.body;
    const nuevoFormulario = new Formulario({
        nombre,
        email,
        telefono,
        horarioDeContacto,
        creadoPor: req.session.usuarioId || null
    });

    await nuevoFormulario.save();
    res.status(201).json({ mensaje: 'Formulario guardado exitosamente' });
} catch (error) {
    console.error('Error al guardar el formulario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
}
});

module.exports = router;
