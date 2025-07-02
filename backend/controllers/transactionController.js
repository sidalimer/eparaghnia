const prisma = require('../config/prisma');

const createTransaction = async (req, res) => {
  const userId = req.user.userId;
  const { label, amount, date, category } = req.body;

  if (!label || !amount || !date || !category) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        label,
        amount: parseFloat(amount),
        date: new Date(date),
        category,
        userId
      }
    });

    res.status(201).json({ message: "Transaction enregistrée ✅", transaction });
  } catch (error) {
    console.error("Erreur création transaction :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getTransactions = async (req, res) => {
    const userId = req.user.userId;
    const { month, year } = req.query;
  
    try {
      let where = { userId };
  
      // Si mois et année sont spécifiés → on filtre
      if (month && year) {
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  
        where.date = {
          gte: startDate,
          lt: endDate
        };
      }
  
      const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' }
      });
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Erreur récupération transactions :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  

  const deleteTransaction = async (req, res) => {
    const userId = req.user.userId;
    const transactionId = parseInt(req.params.id);
  
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
      });
  
      if (!transaction || transaction.userId !== userId) {
        return res.status(403).json({ message: "Non autorisé ou introuvable." });
      }
  
      await prisma.transaction.delete({ where: { id: transactionId } });
  
      res.status(200).json({ message: "Transaction supprimée ✅" });
    } catch (error) {
      console.error("Erreur suppression transaction :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  

  const updateTransaction = async (req, res) => {
    const userId = req.user.userId;
    const transactionId = parseInt(req.params.id);
    const { label, amount, date, category } = req.body;
  
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
      });
  
      if (!transaction || transaction.userId !== userId) {
        return res.status(403).json({ message: "Non autorisé ou introuvable." });
      }
  
      const updated = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          label,
          amount: parseFloat(amount),
          date: new Date(date),
          category
        }
      });
  
      res.status(200).json({ message: "Transaction modifiée ✅", updated });
    } catch (error) {
      console.error("Erreur modification transaction :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  module.exports = { createTransaction, getTransactions, deleteTransaction, updateTransaction };