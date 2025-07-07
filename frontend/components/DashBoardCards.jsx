'use client';
import { Wallet, ShoppingCart, Euro, PiggyBank } from 'lucide-react';

const icons = {
  Solde: { icon: <Wallet className="text-green-600" />, bg: 'bg-green-100' },
  Dépenses: { icon: <ShoppingCart className="text-red-600" />, bg: 'bg-red-100' },
  Revenus: { icon: <Euro className="text-blue-600" />, bg: 'bg-blue-100' },
  Reste: { icon: <PiggyBank className="text-yellow-600" />, bg: 'bg-yellow-100' }
};

export default function DashboardCards({ revenu, depenses, reste, solde, variations = {} }) {
  const cards = [
    { title: 'Revenus', value: (revenu ?? 0).toFixed(2) + '€' },
    { title: 'Dépenses', value: (depenses ?? 0).toFixed(2) + '€' },
    { title: 'Solde', value: (solde ?? 0).toFixed(2) + '€' },
    { title: 'Reste à vivre', value: (reste ?? 0).toFixed(2) + '€' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map(({ title, value }) => {
        let key = title.includes('Solde') ? 'Solde'
                 : title.includes('Dépenses') ? 'Dépenses'
                 : title.includes('Revenus') ? 'Revenus'
                 : 'Reste';

        const variation = variations[key.toLowerCase()];

        return (
          <div key={title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-[#2C3E50]">{value}</h3>
              </div>
              <div className={`${icons[key].bg} p-3 rounded-full`}>
                {icons[key].icon}
              </div>
            </div>

            {variation && (
              <p className={`mt-3 text-sm flex items-center ${key === 'Dépenses' ? 'text-red-600' : 'text-green-600'}`}>
                <span className="inline-block mr-1">{variation}</span> vs mois dernier
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
