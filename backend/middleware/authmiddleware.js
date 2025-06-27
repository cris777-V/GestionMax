function requireLogin(req, res, next) {
if (req.session && req.session.usuarioId) {
    return next();
} else {
    return res.redirect('/login.html'); // o responde con 401 si es API
}
}

module.exports = requireLogin;
