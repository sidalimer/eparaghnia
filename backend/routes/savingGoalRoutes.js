const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { setSavingGoal } = require('../controllers/savingGoalController');

router.post('/', auth, setSavingGoal);

module.exports = router;
