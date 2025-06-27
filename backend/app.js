const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Permitir CORS desde el frontend
app.use(cors({
    origin: 'https://gestionmax.netlify.app/',
    credentials: true
}));

// Configurar sesiones
app.use(session({
    secret: 'gestionmax_supersecreto',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,         // En producción con HTTPS
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch((err) => console.error('🔴 Error en MongoDB:', err));

// Rutas protegidas (validación manual en cada ruta)
app.get('/crear', (req, res) => {
    if (!req.session || !req.session.usuarioId) {
        return res.status(401).send('Debes iniciar sesión');
    }
    res.sendFile(path.join(__dirname, 'public', 'crear.html'));
});

app.get('/dashboard', (req, res) => {
    if (!req.session || !req.session.usuarioId) {
        return res.status(401).send('Debes iniciar sesión');
    }
    res.sendFile(path.join(__dirname, 'private', 'dashboard.html'));
});

// Ruta para obtener el usuario actual
const User = require('./models/user');
app.get('/api/usuario-actual', async (req, res) => {
    if (!req.session || !req.session.usuarioId) {
        return res.status(401).json({ mensaje: 'No autorizado' });
    }

    try {
        const usuario = await User.findById(req.session.usuarioId).select('-contraseña');
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }
});

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Menu_principal.html'));
});

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use(authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
