const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérifie si un token est présent
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ajoute { userId } à req.user
    next(); // autorise l'accès à la route protégée
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = authMiddleware;
