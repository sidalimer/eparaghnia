'use client';

export default function TransactionsList({ transactions }) {
  if (!transactions || !Array.isArray(transactions)) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Dernières transactions</h2>
      <div className="space-y-3">
        {transactions.map(({ id, label, date, amount, category }) => (
          <div key={id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-sm text-gray-500">{date} • {category}</p>
            </div>
            <p className={`font-bold ${amount < 0 ? 'text-[#E74C3C]' : 'text-[#4CAF50]'}`}>
              {amount > 0 ? '+' : ''}{amount}€
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
