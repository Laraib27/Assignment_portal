const express = require('express');
const userController = require('../controllers/userControllers');
const { verifyUser } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/upload', verifyUser, userController.uploadAssignment);
router.get('/admins', verifyUser, userController.getAdmins);

module.exports = router;
