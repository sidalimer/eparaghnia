'use client';
import { useEffect, useState } from 'react';
import { Home, Repeat, Target } from 'lucide-react';
import api from '@/lib/api';
import AppShell, { eur, catColors } from '@/components/AppShell';

function Panel({ icon: Icon, title, hint, total, children }) {
  return (
    <section className="rounded-2xl border border-[#e3e8eb] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f5ec] text-[#27ae60]">
            <Icon size={20} />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#2c3e50]">{title}</h2>
            <p className="text-xs text-[#6b7b88]">{hint}</p>
          </div>
        </div>
        <p className="num text-lg font-bold text-[#2c3e50]">{total}</p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function BudgetPage() {
  const [dash, setDash] = useState(null);
  const m = new Date().getMonth() + 1;
  const y = new Date().getFullYear();

  useEffect(() => {
    api.get(`/dashboard?month=${m}&year=${y}`).then((r) => setDash(r.data)).catch(() => {});
  }, [m, y]);

  if (!dash) {
    return (
      <AppShell title="Budget et épargne">
        <p className="text-sm text-[#6b7b88]">Chargement des données…</p>
      </AppShell>
    );
  }

  const { recurring, necessary } = dash.breakdown;
  const pct = Math.round((dash.saving / dash.revenuMensuel) * 100);

  return (
    <AppShell title="Budget et épargne" subtitle="Vos charges fixes, votre budget de la semaine et votre objectif d'épargne.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel icon={Home} title="Charges fixes" hint="Prélevées chaque mois" total={eur(dash.totalRecurring)}>
          <ul className="divide-y divide-[#eef1f3]">
            {recurring.map((r) => (
              <li key={r.id} className="flex justify-between py-3 text-sm">
                <span className="font-semibold text-[#2c3e50]">{r.name}</span>
                <span className="num text-[#6b7b88]">{eur(r.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon={Repeat} title="Budget nécessaire" hint="Montant prévu par semaine" total={eur(dash.totalNecessary) + ' / mois'}>
          <ul className="space-y-4">
            {necessary.map((n) => (
              <li key={n.id}>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-[#2c3e50]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: catColors[n.category] || '#95a5a6' }} />
                    {n.category}
                  </span>
                  <span className="num text-[#6b7b88]">{eur(n.weeklyAmount)} par semaine</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef1f3]">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (n.weeklyAmount / 80) * 100)}%`, background: catColors[n.category] || '#95a5a6' }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <section className="grid gap-6 rounded-2xl bg-[#2c3e50] p-6 text-white md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Target size={16} /> Objectif d'épargne mensuel
          </p>
          <p className="num mt-2 text-4xl font-bold">{eur(dash.saving)}</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-[#27ae60]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-white/70">{pct} % de vos revenus mis de côté chaque mois.</p>
        </div>
        <div className="rounded-xl bg-white/10 p-5">
          <p className="text-sm text-white/70">Épargne sur un an</p>
          <p className="num mt-1 text-2xl font-bold">{eur(dash.saving * 12)}</p>
          <p className="mt-4 text-sm text-white/70">Reste à vivre ce mois-ci</p>
          <p className="num mt-1 text-2xl font-bold text-[#6fe3a1]">{eur(dash.resteAVivre)}</p>
        </div>
      </section>
    </AppShell>
  );
}
