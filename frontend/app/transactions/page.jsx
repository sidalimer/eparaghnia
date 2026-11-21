'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import AppShell, { eur, catColors } from '@/components/AppShell';

export default function TransactionsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Toutes');

  useEffect(() => {
    api.get('/transactions').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  const categories = useMemo(() => ['Toutes', ...new Set(items.map((t) => t.category))], [items]);
  const shown = items
    .filter((t) => (cat === 'Toutes' || t.category === cat) && t.label.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const total = shown.reduce((s, t) => s + t.amount, 0);

  const remove = async (id) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/transactions/${id}`);
    } catch {}
  };

  return (
    <AppShell title="Transactions" subtitle="Toutes vos dépenses du mois, filtrables par catégorie.">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7b88]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher une dépense"
            className="w-full rounded-xl border border-[#e3e8eb] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/20"
          />
        </label>
        <button className="flex items-center gap-2 rounded-xl bg-[#27ae60] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1f9a52]">
          <Plus size={16} /> Ajouter une dépense
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              cat === c ? 'border-[#2c3e50] bg-[#2c3e50] text-white' : 'border-[#e3e8eb] bg-white text-[#2c3e50] hover:border-[#2c3e50]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e3e8eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#eef1f3] px-5 py-3 text-sm">
          <span className="font-semibold text-[#6b7b88]">{shown.length} dépenses</span>
          <span className="num font-bold text-[#2c3e50]">Total {eur(total)}</span>
        </div>
        <ul className="divide-y divide-[#eef1f3]">
          {shown.map((t) => (
            <li key={t.id} className="flex items-center gap-4 px-5 py-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: catColors[t.category] || '#95a5a6' }}>
                {t.category[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#2c3e50]">{t.label}</p>
                <p className="text-xs text-[#6b7b88]">
                  {new Date(t.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <span className="hidden rounded-full bg-[#f4f6f7] px-3 py-1 text-xs font-semibold text-[#2c3e50] sm:inline">{t.category}</span>
              <p className="num w-24 text-right text-sm font-bold text-[#e74c3c]">−{eur(t.amount)}</p>
              <button onClick={() => remove(t.id)} aria-label={`Supprimer ${t.label}`} className="text-[#a3afb8] hover:text-[#e74c3c]">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
          {shown.length === 0 && <li className="px-5 py-10 text-center text-sm text-[#6b7b88]">Aucune dépense ne correspond à cette recherche.</li>}
        </ul>
      </div>
    </AppShell>
  );
}
