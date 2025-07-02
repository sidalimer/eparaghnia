const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createTransaction, getTransactions, updateTransaction, deleteTransaction} = require('../controllers/transactionController');

router.post('/', auth, createTransaction);
router.get('/', auth, getTransactions);
router.patch('/:id', auth, updateTransaction);     
router.delete('/:id', auth, deleteTransaction);    
module.exports = router;
