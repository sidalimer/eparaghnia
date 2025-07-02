const prisma = require('../config/prisma');

// Créer ou mettre à jour un objectif d'épargne
const setSavingGoal = async (req, res) => {
  const userId = req.user.userId;
  const { targetAmount } = req.body;

  if (!targetAmount || isNaN(targetAmount)) {
    return res.status(400).json({ message: "Montant d'épargne requis." });
  }

  try {
    // On met à jour si un objectif existe déjà, sinon on en crée un
    const goal = await prisma.savingGoal.upsert({
      where: { userId },
      update: { targetAmount: parseFloat(targetAmount) },
      create: {
        userId,
        targetAmount: parseFloat(targetAmount)
      }
    });

    res.status(200).json({ message: "Objectif d'épargne enregistré ✅", goal });
  } catch (error) {
    console.error("Erreur saving goal:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { setSavingGoal };
