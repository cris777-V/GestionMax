// middlewares/authMiddleware.js
function requireLogin(req, res, next) {
    if (req.session && req.session.usuarioId) {
    next();
    } else {
        res.redirect('/login.html');
    }
}

module.exports = requireLogin;
