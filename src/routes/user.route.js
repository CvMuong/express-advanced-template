const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { userValidationRules } = require('../middlewares/user.validator');
const validate = require('../middlewares/validate');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.post('/', userValidationRules, validate, userController.createUser);
router.delete('/:id', protect, authorize('admin'), userController.deleteUserById);
router.patch('/:id/role', protect, authorize('admin'), userController.updateUserRole);

module.exports = router;