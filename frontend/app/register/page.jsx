'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // 👁 pour confirmation

  const onSubmit = async (data) => {
    const { nom, prenom, email, password } = data;
    try {
      await api.post('/auth/register', {
        email,
        password,
        // nom & prénom ajoutables côté backend plus tard
      });
      router.push('/login');
    } catch (error) {
      setApiError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <h1 className="text-2xl font-bold mb-6 text-[#2C3E50]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <span className="inline-flex items-center gap-2">
            <UserPlus size={20} className="text-[#4CAF50]" />
            Créer un compte
          </span>
        </h1>

        {apiError && (
          <p className="text-[#E74C3C] mb-4 text-sm">{apiError}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm text-[#333333]">
            Prénom
            <input
              {...register('prenom', { required: true })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
            {errors.prenom && <p className="text-[#E74C3C] text-xs mt-1">Prénom requis</p>}
          </label>

          <label className="text-sm text-[#333333]">
            Nom
            <input
              {...register('nom', { required: true })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
            {errors.nom && <p className="text-[#E74C3C] text-xs mt-1">Nom requis</p>}
          </label>
        </div>

        <label className="block mt-4 text-sm text-[#333333]">
          Email
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
          {errors.email && <p className="text-[#E74C3C] text-xs mt-1">Email requis</p>}
        </label>

        {/* Mot de passe avec show/hide */}
        <label className="block mt-4 text-sm text-[#333333] relative">
          Mot de passe
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: true,
              minLength: 6
            })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[35px] right-3 text-gray-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          {errors.password && (
            <p className="text-[#E74C3C] text-xs mt-1">
              Le mot de passe doit contenir au moins 6 caractères
            </p>
          )}
        </label>

        {/* Confirmation avec show/hide 👇 */}
        <label className="block mt-4 text-sm text-[#333333] relative">
          Confirmer le mot de passe
          <input
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: true,
              validate: (value) => value === watch('password')
            })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] pr-10"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-[35px] right-3 text-gray-500 cursor-pointer"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          {errors.confirmPassword && (
            <p className="text-[#E74C3C] text-xs mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </label>

        <button
          type="submit"
          className="mt-6 w-full bg-[#2C3E50] text-white p-2 rounded-xl hover:bg-[#1e2d3a] shadow-md transition duration-200"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          S'inscrire
        </button>

        {/* 👇 Lien vers connexion */}
        <div className="text-center mt-4 text-sm text-[#333333]">
          Vous avez déjà un compte ?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-[#4CAF50] hover:underline"
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}
