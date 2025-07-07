'use client';

import { useForm } from 'react-hook-form';
import api from '@/lib/api';

export default function InitialSetup({ onClose }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.patch('/users/me', { revenuMensuel: parseFloat(data.revenu) });
      await api.post('/saving-goals', { targetAmount: parseFloat(data.epargne) });

      // Optionnel : enregistrer une dépense fixe
      if (data.nomRec && data.montantRec) {
        await api.post('/recurring-expenses', {
          name: data.nomRec,
          amount: parseFloat(data.montantRec)
        });
      }

      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Erreur enregistrement setup :', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          🎯 Configurez votre budget
        </h2>

        <label className="block text-sm text-[#333333] mb-2">
          Revenu mensuel (€)
          <input
            type="number"
            step="any"
            {...register('revenu', { required: true })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-xl focus:ring-[#4CAF50] focus:outline-none"
          />
        </label>

        <label className="block text-sm text-[#333333] mb-2 mt-4">
          Objectif d’épargne (€)
          <input
            type="number"
            step="any"
            {...register('epargne', { required: true })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-xl focus:ring-[#4CAF50] focus:outline-none"
          />
        </label>

        <div className="mt-4">
          <p className="text-sm font-semibold text-[#2C3E50] mb-2">💸 Dépense récurrente (optionnel)</p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nom (ex : loyer)"
              {...register('nomRec')}
              className="w-1/2 p-2 border border-gray-300 rounded-xl text-sm"
            />
            <input
              type="number"
              placeholder="Montant"
              step="any"
              {...register('montantRec')}
              className="w-1/2 p-2 border border-gray-300 rounded-xl text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-[#4CAF50] text-white p-2 rounded-xl hover:bg-[#43a047] shadow transition"
        >
          Valider mes données
        </button>
      </form>
    </div>
  );
}
