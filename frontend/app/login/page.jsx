'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import api from '@/lib/api';
import { Logo } from '@/components/AppShell';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible. Vérifiez vos identifiants.');
    }
  };

  const field = 'w-full rounded-xl border border-[#e3e8eb] bg-white py-3 pl-11 pr-3 text-sm outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/20';

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-[#2c3e50] p-12 text-white lg:flex">
        <Logo light />
        <div>
          <p className="text-3xl font-bold leading-snug">Sachez ce qu'il vous reste avant de dépenser.</p>
          <p className="mt-4 max-w-sm text-white/70">Revenus, charges fixes et épargne : votre reste à vivre est calculé pour vous.</p>
        </div>
        <p className="text-sm text-white/50">Eparagnia · gestion de budget personnel</p>
      </aside>

      <main className="grid place-items-center px-6 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden"><Logo /></div>
          <div>
            <h1 className="text-3xl font-bold text-[#2c3e50]">Bon retour</h1>
            <p className="mt-1 text-sm text-[#6b7b88]">Connectez-vous pour retrouver votre budget.</p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#2c3e50]">Adresse e-mail</span>
            <span className="relative block">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7b88]" />
              <input type="email" placeholder="vous@exemple.fr" className={field} {...register('email', { required: true })} />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#2c3e50]">Mot de passe</span>
            <span className="relative block">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7b88]" />
              <input type="password" placeholder="••••••••" className={field} {...register('password', { required: true })} />
            </span>
          </label>

          {error && <p className="text-sm font-semibold text-[#e74c3c]">{error}</p>}

          <button type="submit" className="w-full rounded-xl bg-[#27ae60] py-3 font-bold text-white hover:bg-[#1f9a52]">
            Se connecter
          </button>
          <p className="text-center text-sm text-[#6b7b88]">
            Pas encore de compte ?{' '}
            <button type="button" onClick={() => router.push('/register')} className="font-bold text-[#2c3e50] underline">
              Créer un compte
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}
