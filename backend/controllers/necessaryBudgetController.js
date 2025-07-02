const prisma = require('../config/prisma');

const createNecessaryBudget = async (req, res) => {
  const userId = req.user.userId;
  const { category, weeklyAmount } = req.body;

  if (!category || !weeklyAmount) {
    return res.status(400).json({ message: "Catégorie et montant requis." });
  }

  try {
    const budget = await prisma.necessaryBudget.create({
      data: {
        category,
        weeklyAmount: parseFloat(weeklyAmount),
        userId
      }
    });

    res.status(201).json({ message: "Budget nécessaire enregistré ✅", budget });
  } catch (error) {
    console.error("Erreur budget nécessaire :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getNecessaryBudgets = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const budgets = await prisma.necessaryBudget.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
  
      res.status(200).json(budgets);
    } catch (error) {
      console.error("Erreur récupération budgets nécessaires :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  const updateNecessaryBudget = async (req, res) => {
    const userId = req.user.userId;
    const budgetId = parseInt(req.params.id);
    const { category, weeklyAmount } = req.body;
  
    try {
      const budget = await prisma.necessaryBudget.findUnique({
        where: { id: budgetId }
      });
  
      if (!budget || budget.userId !== userId) {
        return res.status(403).json({ message: "Non autorisé ou budget introuvable." });
      }
  
      const updated = await prisma.necessaryBudget.update({
        where: { id: budgetId },
        data: {
          category,
          weeklyAmount: parseFloat(weeklyAmount)
        }
      });
  
      res.status(200).json({ message: "Budget nécessaire modifié ✅", updated });
    } catch (error) {
      console.error("Erreur modification budget nécessaire :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const deleteNecessaryBudget = async (req, res) => {
    const userId = req.user.userId;
    const budgetId = parseInt(req.params.id);
  
    try {
      const budget = await prisma.necessaryBudget.findUnique({
        where: { id: budgetId }
      });
  
      if (!budget || budget.userId !== userId) {
        return res.status(403).json({ message: "Non autorisé ou budget introuvable." });
      }
  
      await prisma.necessaryBudget.delete({ where: { id: budgetId } });
  
      res.status(200).json({ message: "Budget nécessaire supprimé ✅" });
    } catch (error) {
      console.error("Erreur suppression budget nécessaire :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  

module.exports = {
createNecessaryBudget,
getNecessaryBudgets, updateNecessaryBudget, deleteNecessaryBudget 
};