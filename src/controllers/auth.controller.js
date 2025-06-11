const Account = require('../models/account.model');
const Token = require('../models/token.model');
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

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.roles },
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
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email });
        if (!account || !(await account.comparePassword(password))) {
            const error = new Error('Invalid email or password');
            error.status = 400;
            return next(error);
        }

        const accessToken = generateAccessToken(account);
        const refreshToken = generateRefreshToken(account);

        await Token.create({ user: account._id, token: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.node_env === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            success: true,
            accessToken,
            message: 'Login successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(createError('No refresh token in cookies'));
    }
    const existingToken = await Token.findOne({ token: refreshToken });
    if (!existingToken) return next(createError('Invalid refresh token (not in DB)', 403));
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
};

exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return next(createError('Refresh token is required'));
        await Token.deleteOne({ token: refreshToken });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.node_env === 'production',
            sameSite: 'Strict'
        });
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        return next(createError('Invalid refresh token', 403));
    }
};