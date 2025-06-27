const mongoose = require('mongoose');

const formularioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    horarioDeContacto: { type: String, required: true },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formulario', formularioSchema);

const requireLogin = require('../middlewares/authMiddleware');

// Obtener todos los formularios del usuario logueado
router.get('/formularios', requireLogin, async (req, res) => {
    try {
    const formularios = await Formulario.find({ creadoPor: req.session.usuarioId }).sort({ creadoEn: -1 });
    res.json(formularios);
    } catch (error) {
    console.error('Error al obtener formularios:', error);
    res.status(500).json({ mensaje: 'Error al obtener los formularios' });
    }
});
