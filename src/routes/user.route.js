const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { userValidationRules } = require('../middlewares/user.validator');
const validate = require('../middlewares/validate');

router.get('/', userController.getAllUsers);
router.post('/', userValidationRules, validate, userController.createUser);

module.exports = router;