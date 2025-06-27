const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
const { nombre, correo, contraseña } = req.body;

try {
    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
    return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new User({ nombre, correo, contraseña: hash });
    await nuevoUsuario.save();

    req.session.usuarioId = nuevoUsuario._id;
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
} catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
}
});

// Login de usuario
router.post('/login', async (req, res) => {
const { correo, contraseña } = req.body;

try {
const usuario = await User.findOne({ correo });
    if (!usuario) {
    return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const coinciden = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coinciden) {
    return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    req.session.usuarioId = usuario._id;
    res.json({ mensaje: 'Login exitoso' });
} catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
}
});

// Logout de usuario
router.post('/logout', (req, res) => {
req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada' });
});
});

module.exports = router;
