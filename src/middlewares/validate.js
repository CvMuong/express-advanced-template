const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((error) => ({
            field: error.param,
            message: error.msg
        }));

        return res.status(400).json({
            status: 'fail',
            errors: extractedErrors
        });
    }

    next();
}

module.exports = validate;