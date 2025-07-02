const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createRecurringExpense, getRecurringExpenses, updateRecurringExpense, deleteRecurringExpense } = require('../controllers/recurringController');

// Route protégée → nécessite un token
router.post('/', auth, createRecurringExpense);
router.get('/', auth, getRecurringExpenses);
router.patch('/:id', auth, updateRecurringExpense);
router.delete('/:id', auth, deleteRecurringExpense);
module.exports = router;
