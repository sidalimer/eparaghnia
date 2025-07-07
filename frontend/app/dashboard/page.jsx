'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import DashboardCards from '@/components/DashboardCards';
import SpendingChart from '@/components/SpendingChart';
import BudgetProgress from '@/components/BudgetProgress';
import TransactionsList from '@/components/TransactionsList';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const mois = new Date().getMonth() + 1;
  const annee = new Date().getFullYear();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/dashboard?month=${mois}&year=${annee}`);
        setData(res.data);
      } catch (error) {
        console.error('Erreur chargement dashboard', error);
      }
    };

    fetchDashboard();
  }, [mois, annee]);

  if (!data) {
    return <p className="p-10">Chargement des données...</p>;
  }
  function calcVariation(prev, current) {
    if (typeof prev !== 'number' || typeof current !== 'number' || prev === 0) return null;
    const variation = ((current - prev) / prev) * 100;
    return `${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`;
  }
  return (
    <div className="flex min-h-screen bg-[#F4F6F7]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-6 space-y-8">
          {/* Cartes de résumé */}
          <DashboardCards
            revenu={data.revenuMensuel}
            depenses={data.totalTransactions}
            solde={data.revenuMensuel - data.totalTransactions}
            reste={data.resteAVivre}
            variations={{
                revenu: calcVariation(data.revenuMensuelLastMonth, data.revenuMensuel),
                depenses: calcVariation(data.totalTransactionsLastMonth, data.totalTransactions),
                solde: calcVariation(
                data.revenuMensuelLastMonth - data.totalTransactionsLastMonth,
                data.revenuMensuel - data.totalTransactions
                ),
                reste: calcVariation(data.resteAVivreLastMonth, data.resteAVivre)
            }}
            />

          {/* Graphique dépenses par catégorie */}
          <SpendingChart
            data={[
              { category: 'Fixes', amount: data.totalRecurring },
              { category: 'Nécessaires', amount: data.totalNecessary },
              { category: 'Autres', amount: data.totalTransactions }
            ]}
          />


          {/* Liste des dernières transactions */}
          <TransactionsList
            transactions={data.breakdown.transactions.map(t => ({
              id: t.id,
              label: t.label,
              amount: t.amount,
              date: new Date(t.date).toLocaleDateString('fr-FR'),
              category: t.category
            }))}
          />
        </div>
      </div>
    </div>
  );
}
