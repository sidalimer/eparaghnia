import Link from 'next/link';
import { ArrowRight, CalendarCheck, PiggyBank, PieChart } from 'lucide-react';
import { Logo } from '@/components/AppShell';

const features = [
  { icon: CalendarCheck, title: 'Un reste à vivre toujours à jour', text: 'Vos charges fixes, votre budget de la semaine et votre épargne sont retirés de vos revenus pour vous montrer ce qu\'il vous reste vraiment.' },
  { icon: PieChart, title: 'Vos dépenses par catégorie', text: 'Alimentation, transport, loisirs : voyez en un coup d\'œil où part votre argent et comparez avec le mois dernier.' },
  { icon: PiggyBank, title: 'Un objectif d\'épargne clair', text: 'Fixez un montant à mettre de côté chaque mois et suivez-le avant de dépenser le reste.' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f6f7]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-[#2c3e50] hover:bg-white">Se connecter</Link>
          <Link href="/register" className="rounded-xl bg-[#2c3e50] px-4 py-2 text-sm font-bold text-white hover:bg-[#1e2a38]">Créer un compte</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#27ae60]">Gestion de budget personnel</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-[#2c3e50] md:text-5xl">
            Sachez ce qu'il vous reste avant de dépenser.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-[#5b6b78]">
            Eparagnia calcule votre reste à vivre à partir de vos revenus, de vos charges fixes et de votre objectif d'épargne.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-[#27ae60] px-6 py-3 font-bold text-white hover:bg-[#1f9a52]">
              Voir la démo <ArrowRight size={18} />
            </Link>
            <Link href="/register" className="rounded-xl border border-[#d3dadf] bg-white px-6 py-3 font-bold text-[#2c3e50] hover:border-[#2c3e50]">
              Commencer gratuitement
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-[#2c3e50] p-6 text-white shadow-xl">
          <p className="text-sm text-white/70">Reste à vivre en novembre</p>
          <p className="num mt-1 text-4xl font-bold text-[#6fe3a1]">378,41 €</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[84%] rounded-full bg-[#27ae60]" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            {[['Revenus', '2 400 €'], ['Charges fixes', '808 €'], ['Épargne', '300 €']].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-white/60">{k}</p>
                <p className="num mt-1 font-bold">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-[#e3e8eb] bg-white p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6f5ec] text-[#27ae60]"><Icon size={22} /></span>
            <h2 className="mt-4 text-lg font-bold text-[#2c3e50]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5b6b78]">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
