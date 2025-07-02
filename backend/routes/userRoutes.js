const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { updateUserIncome, getProfile } = require('../controllers/userController');

router.patch('/me', auth, updateUserIncome);
router.get('/me', auth, getProfile);

module.exports = router;
