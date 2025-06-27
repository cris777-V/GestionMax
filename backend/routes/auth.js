const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware de sesión
app.use(session({
    secret: 'gestionmax_supersecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middlewares para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch((err) => console.error('🔴 Error en MongoDB:', err));

// Importar middleware de autenticación
const requireLogin = require('./middlewares/authMiddleware');

// Rutas protegidas
app.get('/crear', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crear.html'));
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'dashboard.html'));
});

// Ruta pública
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Menu_principal.html'));
});

// Rutas de login y registro
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
