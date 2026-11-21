'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, LogOut, Leaf } from 'lucide-react';
import api from '@/lib/api';

const nav = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
  { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions' },
  { icon: PiggyBank, label: 'Budget et épargne', href: '/budget' }
];

export function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#27ae60] text-white">
        <Leaf size={18} />
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-[#2c3e50]'}`}>
        Eparagnia
      </span>
    </span>
  );
}

export default function AppShell({ title, subtitle, children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/users/me').then((r) => setUser(r.data)).catch(() => {});
  }, []);

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` : '';
  const month = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-[#2c3e50] p-5 text-white md:flex">
        <div className="space-y-8">
          <Logo light />
          <nav className="space-y-1">
            {nav.map(({ icon: Icon, label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active ? 'bg-[#27ae60] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#27ae60] text-sm font-bold">{initials}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : '…'}</p>
            <p className="truncate text-xs text-white/60">{user?.email}</p>
          </div>
          <Link href="/login" aria-label="Se déconnecter" className="text-white/60 hover:text-white">
            <LogOut size={18} />
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-end justify-between gap-2 px-6 pb-2 pt-8 md:px-10">
          <div>
            <h1 className="text-2xl font-bold text-[#2c3e50] md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[#6b7b88]">{subtitle}</p>}
          </div>
          <span className="rounded-full border border-[#e3e8eb] bg-white px-4 py-1.5 text-sm font-semibold capitalize text-[#2c3e50]">
            {month}
          </span>
        </header>
        <div className="space-y-6 px-6 pb-12 pt-4 md:px-10">{children}</div>
      </main>
    </div>
  );
}

export const eur = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n ?? 0);

export const catColors = {
  Alimentation: '#27ae60',
  Transport: '#3498db',
  Loisirs: '#9b59b6',
  Santé: '#e74c3c',
  Shopping: '#f59e0b'
};
