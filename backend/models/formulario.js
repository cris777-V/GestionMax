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
