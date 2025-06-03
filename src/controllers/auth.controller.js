const Account = require('../models/account.model');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { createError } = require('../utils/error');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.roles },
        config.jwt_secret,
        { expiresIn: '15m' }
    );
};

const generateRefreshToek = (user) => {
    return jwt.sign(
        { id: user._id },
        config.jwtrefreshsecret,
        { expiresIn: '7d' }
    );
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, roles } = req.body;
        const account = await Account.create({ name, email, password, roles });
        const token = jwt.sign({ id: account._id, role: account.roles }, config.jwt_secret, { expiresIn: '1d' });
        res.status(201).json({
            success: true,
            token,
            expiresIn: '1d'
        })
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email });
        if (account.length === 0 || !(await account.comparePassword(password))) {
            const error = new Error('Invalid email or password');
            error.status = 400;
            return next(error);
        }

        const accessToken = generateAccessToken(account);
        const refreshToken = generateRefreshToek(account);

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshAccessToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return next(createError('Refresh token is required'));
    }
    try {
        const decoded = jwt.verify(refreshToken, config.jwtrefreshsecret);
        const accessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            config.jwt_secret,
            { expiresIn: '15m' }
        )
        return res.status(200).json({
            success: true,
            accessToken
        })
    } catch (error) {
        return next(createError('Refresh token is invalid', 403));  
    }
}