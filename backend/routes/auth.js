const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Mostrar formulario de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Mostrar formulario de registro
router.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'registro.html'));
});

// Procesar registro de usuario
router.post('/registro', express.urlencoded({ extended: true }), async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    try {
        const usuarioExistente = await User.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).send('Correo ya registrado');
        }

        const contraseñaHash = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = new User({ nombre, correo, contraseña: contraseñaHash });
        await nuevoUsuario.save();

        // Guardar sesión tras registro
        req.session.usuarioId = nuevoUsuario._id;

        // Redirige al menú principal
        res.redirect('/');
    } catch (error) {
        console.error('Error al registrar:', error);
        res.status(500).send('Error del servidor');
    }
});

// Procesar login
router.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const usuario = await User.findOne({ correo });
        if (!usuario) {
            return res.status(400).send('Usuario no encontrado');
        }

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) {
            return res.status(401).send('Contraseña incorrecta');
        }

        //  Guardar sesión tras login
        req.session.usuarioId = usuario._id;

        res.redirect('/');
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error del servidor');
    }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
