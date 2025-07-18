const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
nombre: {
    type: String,
    required: true,
    trim: true
},
correo: {
    type: String,
    required: true,
    unique: true
},
contraseña: {
    type: String,
    required: true
    }
});

module.exports = mongoose.model('User', userSchema);
