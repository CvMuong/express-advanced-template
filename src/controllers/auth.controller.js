const Account = require('../models/account.model');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, roles } = req.body;
        const account = await Account.create({ name, email, password, roles });
        const token = jwt.sign({ id: account._id, role: account.role }, config.jwt_secret, { expiresIn: '1d' });
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
        const token = jwt.sign({ id: account._id, role: account.roles }, config.jwt_secret, { expiresIn: '1d' });
        res.status(200).json({
            success: true,
            token,
            expiresIn: '1d'
        });
    } catch (error) {
        next(error);
    }
};