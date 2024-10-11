const express = require('express');
const adminController = require('../controllers/adminControllers');
const { verifyAdmin } = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/assignments', verifyAdmin, adminController.getAssignments);
router.post('/assignments/:id/accept', verifyAdmin, adminController.acceptAssignment);
router.post('/assignments/:id/reject', verifyAdmin, adminController.rejectAssignment);

module.exports = router;
