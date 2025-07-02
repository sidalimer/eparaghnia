const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getDashboard, getMonthlyTotals, getCategoryTotals } = require('../controllers/dashboardController');

router.get('/', auth, getDashboard);
router.get('/graph', auth, getMonthlyTotals); 
router.get('/categories', auth, getCategoryTotals); 

module.exports = router;
