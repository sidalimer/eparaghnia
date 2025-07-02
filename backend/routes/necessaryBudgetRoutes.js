const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {createNecessaryBudget, getNecessaryBudgets, deleteNecessaryBudget, updateNecessaryBudget } = require('../controllers/necessaryBudgetController');

router.post('/', auth, createNecessaryBudget);
router.get('/', auth, getNecessaryBudgets);
router.patch('/:id', auth, updateNecessaryBudget);
router.delete('/:id', auth, deleteNecessaryBudget);

module.exports = router;
