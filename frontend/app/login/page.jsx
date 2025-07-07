'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // 👁 gestion mot de passe visible

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe invalide');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F7] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-[12px] shadow-lg w-full max-w-sm"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <h1 className="text-2xl font-bold mb-6 text-[#2C3E50]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <span className="inline-flex items-center gap-2">
            <LogIn size={20} className="text-[#4CAF50]" />
            Connexion
          </span>
        </h1>

        {error && (
          <p className="text-[#E74C3C] mb-4 text-sm">{error}</p>
        )}

        <label className="block mb-4 text-[#333333] text-sm">
          Email
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-[12px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
        </label>

        <label className="block mb-6 text-[#333333] text-sm relative">
          Mot de passe
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: true })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-[12px] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[35px] right-3 text-gray-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-[#2C3E50] text-white p-2 rounded-[12px] hover:bg-[#1e2d3a] shadow-md transition duration-200"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Se connecter
        </button>

        {/* 🔗 Lien vers /register */}
        <div className="text-center mt-4 text-sm text-[#333333]">
          Pas encore de compte ?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-[#4CAF50] hover:underline"
          >
            Créer un compte
          </button>
        </div>
      </form>
    </div>
  );
}
