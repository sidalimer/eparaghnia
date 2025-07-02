const prisma = require('../config/prisma');

const updateUserIncome = async (req, res) => {
  const userId = req.user.userId;
  const { revenuMensuel } = req.body;

  if (!revenuMensuel || isNaN(revenuMensuel)) {
    return res.status(400).json({ message: 'Revenu mensuel invalide ou manquant.' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        revenuMensuel: parseFloat(revenuMensuel)
      }
    });

    res.status(200).json({ message: 'Revenu mensuel mis à jour ✅', user });
  } catch (error) {
    console.error('Erreur mise à jour revenu :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true
      }
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur profil :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
module.exports = { updateUserIncome, getProfile };
