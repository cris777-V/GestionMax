const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch((err) => console.error('🔴 Error en MongoDB:', err));

// Rutas protegidas
app.get('/crear', (req, res) => {
    if (!req.session || !req.session.usuarioId) {
        return res.status(401).send('No autorizado');
    }
    res.sendFile(path.join(__dirname, 'public', 'crear.html'));
});

app.get('/dashboard', (req, res) => {
    if (!req.session || !req.session.usuarioId) {
        return res.status(401).send('No autorizado');
    }
    res.sendFile(path.join(__dirname, 'private', 'dashboard.html'));
});

// Ruta pública
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
