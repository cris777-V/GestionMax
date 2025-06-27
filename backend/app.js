const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

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
        secure: true,
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

// 💡 Middleware para proteger rutas
function requireLogin(req, res, next) {
    if (req.session && req.session.usuarioId) {
        return next();
    } else {
        return res.redirect('/login.html');
    }
}

// Rutas protegidas
app.get('/crear', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crear.html'));
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'private/dashboard.html'));
});

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Menu_principal.html'));
});

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use(authRoutes);

// Obtener usuario actual
const User = require('./models/user');
app.get('/api/usuario-actual', requireLogin, async (req, res) => {
    try {
        const usuario = await User.findById(req.session.usuarioId).select('-contraseña');
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
