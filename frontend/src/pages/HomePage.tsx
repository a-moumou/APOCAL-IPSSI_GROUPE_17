import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload,
  Cpu,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock,
  LayoutDashboard,
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    step: '01',
    title: "Importe ton cours",
    desc: "Colle du texte ou uploade un PDF. Tes données restent entièrement sur ta machine — aucun cloud, aucun abonnement.",
  },
  {
    icon: Cpu,
    step: '02',
    title: "L'IA génère le quiz",
    desc: "Llama 3.2 via Ollama tourne en local et produit 10 questions QCM calibrées sur ton contenu en 1 à 5 minutes.",
  },
  {
    icon: TrendingUp,
    step: '03',
    title: "Mesure ta progression",
    desc: "Score immédiat, visualisation de l'historique, révision des erreurs : tout ce qu'il faut pour progresser.",
  },
];

const guarantees = [
  { icon: Lock,          label: 'Données 100 % locales' },
  { icon: Zap,           label: 'Résultat immédiat'     },
  { icon: CheckCircle2,  label: 'Aucun abonnement'      },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-8 pb-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          IA 100 % locale — open source — APOCAL'IPSSI 2026
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-[1.1] tracking-tight mb-6">
          Révise mieux,{' '}
          <span className="text-blue-600 dark:text-blue-400">grâce à l'IA.</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
          Colle ton cours, EduTutor génère 10 QCM, te corrige et identifie tes lacunes.
          Tout tourne localement sur ta machine.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {user ? (
            <>
              <Link to="/upload" className="btn-amber px-8 py-3 text-base gap-2">
                <Upload size={18} /> Créer un quiz
              </Link>
              <Link to="/dashboard" className="btn-secondary px-6 py-3 text-base gap-2">
                <LayoutDashboard size={18} /> Tableau de bord
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn-amber px-8 py-3 text-base gap-2">
                Commencer gratuitement <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                Se connecter
              </Link>
            </>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {guarantees.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Icon size={15} className="text-emerald-500" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnement */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Comment ça marche
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Trois étapes, de ton cours à ton score.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, step, title, desc }) => (
            <div
              key={step}
              className="card relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
            >
              <div className="absolute top-4 right-4 text-6xl font-black text-slate-100 dark:text-slate-800 leading-none select-none">
                {step}
              </div>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Prêt à tester tes connaissances ?
          </h2>
          <p className="text-blue-100 mb-8 text-sm max-w-md mx-auto">
            Crée ton compte en quelques secondes et génère ton premier quiz.
          </p>
          <Link to="/signup" className="btn-amber px-8 py-3 text-base gap-2">
            Commencer gratuitement <ArrowRight size={18} />
          </Link>
        </section>
      )}

    </div>
  );
}
