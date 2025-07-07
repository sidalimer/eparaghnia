'use client';

export default function BudgetProgress({ budgets }) {
  // ✅ protection anti-erreur
  if (!budgets || !Array.isArray(budgets)) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-lg font-semibold text-[#2C3E50] mb-4">Progression du budget</h2>
      <div className="space-y-4">
        {budgets.map(({ category, used, max }) => {
          const percent = Math.round((used / max) * 100);
          const color = percent > 80 ? 'bg-[#E74C3C]' : percent > 50 ? 'bg-[#F59E0B]' : 'bg-[#4CAF50]';
          return (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span>{category}</span>
                <span>{used}€ / {max}€</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded">
                <div className={`${color} h-full rounded`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
