const { body } = require('express-validator');

const userValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('User name is required!')
        .isString().withMessage('User name must be a string!'),
    body('age')
        .notEmpty().withMessage('Age is required!')
        .isInt({ gt: 0 }).withMessage('Age must be a positive integer'),    
];

module.exports = { userValidationRules };
