'use client';
import { useEffect, useState } from 'react';
import { Home, PieChart, List, Tags, Bell, Settings, User } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api'; // ← assure-toi que tu as bien ce fichier api.js

const menuItems = [
  { icon: <Home />, label: 'Tableau de bord', href: '/dashboard' },
  { icon: <PieChart />, label: 'Statistiques', href: '#' },
  { icon: <List />, label: 'Transactions', href: '#' },
  { icon: <Tags />, label: 'Catégories', href: '#' },
  { icon: <Bell />, label: 'Alertes', href: '#' },
  { icon: <Settings />, label: 'Paramètres', href: '#' }
];

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/me'); // récupère prénom/nom/email
        setUser(res.data);
      } catch (err) {
        console.error('Erreur récupération profil utilisateur :', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-[#2C3E50] text-white w-64 min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 p-4 border-b border-[#1e2a38]">
          <div className="bg-white p-2 rounded-lg">
            <Home className="text-[#2C3E50]" />
          </div>
          <span className="text-xl font-bold">Eparagnia</span>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(({ icon, label, href }) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1e2a38] cursor-pointer transition">
                {icon}
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Profil utilisateur dynamique */}
      <div className="p-4 border-t border-[#1e2a38] flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1e2a38] rounded-full flex items-center justify-center">
          <User />
        </div>
        <div>
          {user ? (
            <>
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            </>
          ) : (
            <p className="text-sm text-gray-300">Chargement...</p>
          )}
        </div>
      </div>
    </div>
  );
}
