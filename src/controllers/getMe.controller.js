const Account = require('../models/account.model');

const getMe = async (req, res, next) => {
    try {
        const user = await Account.findById(req.account.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMe };