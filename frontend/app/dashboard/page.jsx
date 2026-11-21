'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Wallet, ShoppingBag, Banknote, Hourglass, TrendingDown, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import AppShell, { eur, catColors } from '@/components/AppShell';

const variation = (prev, cur) => (prev ? ((cur - prev) / prev) * 100 : null);

function Stat({ icon: Icon, label, value, delta, goodWhenDown, tone }) {
  const down = delta !== null && delta < 0;
  const good = delta === null ? true : goodWhenDown ? down : !down;
  return (
    <div className="rounded-2xl border border-[#e3e8eb] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#6b7b88]">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: tone + '1a', color: tone }}>
          <Icon size={18} />
        </span>
      </div>
      <p className="num mt-3 text-2xl font-bold text-[#2c3e50]">{eur(value)}</p>
      {delta !== null && (
        <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${good ? 'text-[#27ae60]' : 'text-[#e74c3c]'}`}>
          {down ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {delta > 0 ? '+' : ''}
          {delta.toFixed(1)} % <span className="font-normal text-[#6b7b88]">vs mois dernier</span>
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [months, setMonths] = useState([]);
  const [cats, setCats] = useState([]);
  const m = new Date().getMonth() + 1;
  const y = new Date().getFullYear();

  useEffect(() => {
    api.get(`/dashboard?month=${m}&year=${y}`).then((r) => setData(r.data)).catch(() => {});
    api.get(`/dashboard/graph?month=${m}&year=${y}`).then((r) => setMonths(r.data)).catch(() => {});
    api.get(`/dashboard/categories?month=${m}&year=${y}`).then((r) => setCats(r.data)).catch(() => {});
  }, [m, y]);

  if (!data) {
    return (
      <AppShell title="Tableau de bord">
        <p className="text-sm text-[#6b7b88]">Chargement des données…</p>
      </AppShell>
    );
  }

  const ok = data.resteAVivre >= 0;
  const total = cats.reduce((s, c) => s + c.total, 0);
  const lastTrx = [...data.breakdown.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const spent = data.totalRecurring + data.totalNecessary + data.totalTransactions + data.saving;
  const pct = Math.min(100, Math.round((spent / data.revenuMensuel) * 100));

  return (
    <AppShell title="Tableau de bord" subtitle="Où en est votre budget ce mois-ci.">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold ${
          ok ? 'border-[#bfe5cd] bg-[#e6f5ec] text-[#1d7a45]' : 'border-[#f3c5bf] bg-[#fdecea] text-[#b3382c]'
        }`}
      >
        {ok ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
        {ok ? 'Vous êtes dans votre budget, continuez comme ça.' : 'Vous avez dépassé votre budget ce mois-ci.'}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Banknote} label="Revenus" value={data.revenuMensuel} delta={variation(data.revenuMensuelLastMonth, data.revenuMensuel)} tone="#3498db" />
        <Stat icon={ShoppingBag} label="Dépenses" value={data.totalTransactions} delta={variation(data.totalTransactionsLastMonth, data.totalTransactions)} goodWhenDown tone="#e74c3c" />
        <Stat icon={Wallet} label="Solde" value={data.revenuMensuel - data.totalTransactions} delta={variation(data.revenuMensuelLastMonth - data.totalTransactionsLastMonth, data.revenuMensuel - data.totalTransactions)} tone="#27ae60" />
        <Stat icon={Hourglass} label="Reste à vivre" value={data.resteAVivre} delta={variation(data.resteAVivreLastMonth, data.resteAVivre)} tone="#f59e0b" />
      </section>

      <section className="rounded-2xl border border-[#e3e8eb] bg-white p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-bold text-[#2c3e50]">Budget du mois utilisé</h2>
          <p className="num text-sm font-semibold text-[#6b7b88]">
            {eur(spent)} sur {eur(data.revenuMensuel)}
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#eef1f3]">
          <div className="h-full rounded-full bg-[#27ae60]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-[#6b7b88]">
          Charges fixes, budget nécessaire, objectif d'épargne et dépenses du mois compris.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-[#e3e8eb] bg-white p-5 lg:col-span-3">
          <h2 className="text-base font-bold text-[#2c3e50]">Dépenses des six derniers mois</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={months} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#e3e8eb" vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} tick={{ fill: '#6b7b88', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7b88', fontSize: 12 }} />
                <Tooltip formatter={(v) => eur(v)} cursor={{ fill: '#f4f6f7' }} />
                <Bar dataKey="total" fill="#27ae60" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e3e8eb] bg-white p-5 lg:col-span-2">
          <h2 className="text-base font-bold text-[#2c3e50]">Par catégorie</h2>
          <div className="relative mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cats} dataKey="total" nameKey="categorie" innerRadius={52} outerRadius={76} paddingAngle={3} stroke="none">
                  {cats.map((c) => (
                    <Cell key={c.categorie} fill={catColors[c.categorie] || '#95a5a6'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="num text-lg font-bold text-[#2c3e50]">{eur(total)}</p>
                <p className="text-xs text-[#6b7b88]">ce mois-ci</p>
              </div>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {cats.map((c) => (
              <li key={c.categorie} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-[#2c3e50]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: catColors[c.categorie] || '#95a5a6' }} />
                  {c.categorie}
                </span>
                <span className="num text-[#6b7b88]">{eur(c.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e3e8eb] bg-white p-5">
        <h2 className="text-base font-bold text-[#2c3e50]">Dernières transactions</h2>
        <ul className="mt-2 divide-y divide-[#eef1f3]">
          {lastTrx.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: catColors[t.category] || '#95a5a6' }} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#2c3e50]">{t.label}</p>
                  <p className="text-xs text-[#6b7b88]">
                    {new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · {t.category}
                  </p>
                </div>
              </div>
              <p className="num text-sm font-bold text-[#e74c3c]">−{eur(t.amount)}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
