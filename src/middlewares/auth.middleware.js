const jwt = require('jsonwebtoken');
const config = require('../config/env');

const handleAuthError = (message, status = 401) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(handleAuthError('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        req.account = decoded;
        console.log('Token decoded: ', req.account);
        next();
    } catch {
        return next(handleAuthError('Invalid or expired token'));
    }
}

const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.account || !allowedRoles.includes(req.account.role)) {
        return next(handleAuthError('Forbidden', 403));
    }

    console.log('Role being checked: ', req.account?.role);

    next();
}

module.exports = {
    protect,
    authorize,
}