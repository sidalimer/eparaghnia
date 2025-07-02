const prisma = require('../config/prisma');

const getDashboard = async (req, res) => {
  const userId = req.user.userId;
  const { month, year } = req.query;

  const mois = parseInt(month);
  const annee = parseInt(year);

  const startDate = new Date(`${annee}-${mois}-01`);
  const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

  // Calcul du mois précédent
  const lastMonthDate = new Date(startDate);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastStartDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1);
  const lastEndDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 1);

  try {
    // Mois actuel
    const [savingGoal, recurring, necessary, transactions] = await Promise.all([
      prisma.savingGoal.findUnique({ where: { userId } }),
      prisma.recurringExpense.findMany({ where: { userId } }),
      prisma.necessaryBudget.findMany({ where: { userId } }),
      prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lt: endDate
          }
        }
      })
    ]);

    // Mois précédent
    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: lastStartDate,
          lt: lastEndDate
        }
      }
    });

    const totalRecurring = recurring.reduce((sum, exp) => sum + exp.amount, 0);
    const totalNecessary = necessary.reduce((sum, bud) => sum + bud.weeklyAmount * 4, 0);
    const totalTransactions = transactions.reduce((sum, trx) => sum + trx.amount, 0);
    const totalTransactionsLastMonth = lastMonthTransactions.reduce((sum, trx) => sum + trx.amount, 0);

    const saving = savingGoal ? savingGoal.targetAmount : 0;
    const revenuMensuel = 2000;
    const revenuMensuelLastMonth = 1900; // à remplacer plus tard par user.revenu + historique si disponible

    const resteAVivre = revenuMensuel - (saving + totalRecurring + totalNecessary + totalTransactions);
    const resteAVivreLastMonth = revenuMensuelLastMonth - (saving + totalRecurring + totalNecessary + totalTransactionsLastMonth);

    const alerte = resteAVivre < 0
      ? "⚠️ Vous avez dépassé votre budget ce mois-ci."
      : "✅ Vous êtes dans votre budget, continuez comme ça !";

    res.status(200).json({
      revenuMensuel,
      revenuMensuelLastMonth,
      saving,
      totalRecurring,
      totalNecessary,
      totalTransactions,
      totalTransactionsLastMonth,
      resteAVivre,
      resteAVivreLastMonth,
      alerte,
      breakdown: {
        recurring,
        necessary,
        transactions
      }
    });
  } catch (error) {
    console.error("Erreur dashboard :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getMonthlyTotals = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const now = new Date();
      const results = [];
  
      for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  
        const transactions = await prisma.transaction.findMany({
          where: {
            userId,
            date: {
              gte: start,
              lt: end
            }
          }
        });
  
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  
        results.push({
          mois: start.toLocaleString('fr-FR', { month: 'long' }),
          annee: start.getFullYear(),
          total: parseFloat(total.toFixed(2))
        });
      }
  
      res.status(200).json(results.reverse()); // Du plus ancien au plus récent
    } catch (error) {
      console.error("Erreur récupération dépenses mensuelles :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };

  const getCategoryTotals = async (req, res) => {
    const userId = req.user.userId;
    const { month, year } = req.query;
  
    const mois = parseInt(month);
    const annee = parseInt(year);
  
    const startDate = new Date(`${annee}-${mois}-01`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lt: endDate
          }
        }
      });
  
      // Regroupement par catégorie
      const grouped = {};
  
      transactions.forEach((trx) => {
        if (!grouped[trx.category]) {
          grouped[trx.category] = 0;
        }
        grouped[trx.category] += trx.amount;
      });
  
      const result = Object.keys(grouped).map((categorie) => ({
        categorie,
        total: parseFloat(grouped[categorie].toFixed(2))
      }));
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Erreur par catégorie :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  
module.exports = { getDashboard, getMonthlyTotals, getCategoryTotals };
