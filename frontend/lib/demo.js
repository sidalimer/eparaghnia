// Mode démo : répond à la place de l'API quand NEXT_PUBLIC_DEMO=1 (aucune base de données requise).
const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

const transactions = [
  { id: 1, label: 'Courses Monoprix', amount: 64.8, date: day(1), category: 'Alimentation' },
  { id: 2, label: 'Pass Navigo', amount: 86.4, date: day(2), category: 'Transport' },
  { id: 3, label: 'Cinéma', amount: 24.0, date: day(3), category: 'Loisirs' },
  { id: 4, label: 'Pharmacie', amount: 18.5, date: day(4), category: 'Santé' },
  { id: 5, label: 'Marché du samedi', amount: 38.2, date: day(5), category: 'Alimentation' },
  { id: 6, label: 'Chaussures de running', amount: 89.9, date: day(6), category: 'Shopping' },
  { id: 7, label: 'Restaurant entre amis', amount: 47.5, date: day(8), category: 'Loisirs' },
  { id: 8, label: 'Courses Carrefour', amount: 72.3, date: day(9), category: 'Alimentation' },
  { id: 9, label: 'Covoiturage', amount: 22.0, date: day(11), category: 'Transport' },
  { id: 10, label: 'Livre', amount: 19.9, date: day(12), category: 'Loisirs' },
  { id: 11, label: 'Courses Biocoop', amount: 41.6, date: day(14), category: 'Alimentation' },
  { id: 12, label: 'Dentiste', amount: 55.0, date: day(16), category: 'Santé' }
];

const recurring = [
  { id: 1, name: 'Loyer', amount: 720 },
  { id: 2, name: 'Électricité et internet', amount: 64 },
  { id: 3, name: 'Abonnement téléphone', amount: 12.99 },
  { id: 4, name: 'Streaming musique', amount: 10.99 }
];

const necessary = [
  { id: 1, category: 'Alimentation', weeklyAmount: 70 },
  { id: 2, category: 'Transport', weeklyAmount: 25 },
  { id: 3, category: 'Santé', weeklyAmount: 10 }
];

const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);

const dashboard = () => {
  const revenuMensuel = 2400;
  const saving = 300;
  const totalRecurring = sum(recurring, (r) => r.amount);
  const totalNecessary = sum(necessary, (n) => n.weeklyAmount * 4);
  const totalTransactions = sum(transactions, (t) => t.amount);
  const lastMonth = 512.4;
  const revenuLast = 2400;
  return {
    revenuMensuel,
    revenuMensuelLastMonth: revenuLast,
    saving,
    totalRecurring,
    totalNecessary,
    totalTransactions,
    totalTransactionsLastMonth: lastMonth,
    resteAVivre: revenuMensuel - (saving + totalRecurring + totalNecessary + totalTransactions),
    resteAVivreLastMonth: revenuLast - (saving + totalRecurring + totalNecessary + lastMonth),
    alerte: '✅ Vous êtes dans votre budget, continuez comme ça !',
    breakdown: { recurring, necessary, transactions }
  };
};

const months = () => {
  const totals = [431.2, 478.9, 402.5, 540.1, 512.4, sum(transactions, (t) => t.amount)];
  const out = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    out.push({ mois: d.toLocaleString('fr-FR', { month: 'long' }), total: totals[5 - i] });
  }
  return out;
};

const categories = () => {
  const grouped = {};
  transactions.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount;
  });
  return Object.keys(grouped).map((categorie) => ({ categorie, total: +grouped[categorie].toFixed(2) }));
};

const routes = {
  '/users/me': () => ({ firstName: 'Léa', lastName: 'Moreau', email: 'lea.moreau@exemple.fr', revenuMensuel: 2400 }),
  '/dashboard': dashboard,
  '/dashboard/graph': months,
  '/dashboard/categories': categories,
  '/transactions': () => transactions,
  '/recurring-expenses': () => recurring,
  '/necessary-budgets': () => necessary
};

export const demoAdapter = async (config) => {
  const url = (config.url || '').split('?')[0];
  const handler = routes[url];
  const data = handler ? handler() : { token: 'demo-token', message: 'ok' };
  return { data, status: 200, statusText: 'OK', headers: {}, config };
};
