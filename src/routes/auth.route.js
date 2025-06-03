const express = require('express');
const authController = require('../controllers/auth.controller');
const getMeController = require("../controllers/getMe.controller");
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, getMeController.getMe);
router.post('/refresh-token', authController.refreshAccessToken);

module.exports = router;