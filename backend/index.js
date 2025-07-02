require('dotenv').config();              // Pour charger les variables d'environnement
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes'); // Routes d'authentification
const recurringRoutes = require('./routes/recurringRoutes');
const savingGoalRoutes = require('./routes/savingGoalRoutes');
const necessaryBudgetRoutes = require('./routes/necessaryBudgetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();

// Middlewares 
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);  // /register /login
app.use('/api/recurring-expenses', recurringRoutes);
app.use('/api/saving-goals', savingGoalRoutes);
app.use('/api/necessary-budgets', necessaryBudgetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);


// Route de test
app.get('/', (req, res) => {
  res.send('API Budget en ligne ');
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT} `);
});
