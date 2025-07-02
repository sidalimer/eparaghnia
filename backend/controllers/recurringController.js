const prisma = require('../config/prisma');

// Créer une dépense récurrente
const createRecurringExpense = async (req, res) => {
  const { name, amount } = req.body;
  const userId = req.user.userId; // récupéré via le token JWT (middleware)

  if (!name || !amount) {
    return res.status(400).json({ message: 'Nom et montant requis.' });
  }

  try {
    const expense = await prisma.recurringExpense.create({
      data: {
        name,
        amount: parseFloat(amount),
        userId,
      },
    });

    res.status(201).json({ message: 'Dépense enregistrée ✅', expense });
  } catch (error) {
    console.error('Erreur création dépense récurrente :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
// Récupérer toutes les dépenses récurrentes de l'utilisateur connecté
const getRecurringExpenses = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const expenses = await prisma.recurringExpense.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
  
      res.status(200).json(expenses);
    } catch (error) {
      console.error('Erreur récupération dépenses récurrentes :', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
  
const updateRecurringExpense = async (req,res) => {
  const userId = req.user.userId;
  const expenseId = parseInt(req.params.id);
  const { name, amount } = req.body;

  try {
    const expense = await prisma.recurringExpense.findUnique({
      where: { id: expenseId }
    });

    if (!expense || expense.userId !== userId) {
      return res.status(403).json({ message: "Non autorisé ou dépense introuvable." });
    }

    const updated = await prisma.recurringExpense.update({
      where: { id: expenseId },
      data: {
        name,
        amount: parseFloat(amount)
      }
    });

    res.status(200).json({ message: "Dépense récurrente modifiée ✅", updated });
  } catch (error) {
    console.error("Erreur modification dépense récurrente :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteRecurringExpense = async (req, res) => {
  const userId = req.user.userId;
  const expenseId = parseInt(req.params.id);

  try {
    const expense = await prisma.recurringExpense.findUnique({
      where: { id: expenseId }
    });

    if (!expense || expense.userId !== userId) {
      return res.status(403).json({ message: "Non autorisé ou dépense introuvable." });
    }

    await prisma.recurringExpense.delete({ where: { id: expenseId } });

    res.status(200).json({ message: "Dépense récurrente supprimée ✅" });
  } catch (error) {
    console.error("Erreur suppression dépense récurrente :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {createRecurringExpense, getRecurringExpenses, updateRecurringExpense, deleteRecurringExpense};
