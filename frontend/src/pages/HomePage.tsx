import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
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

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useI18n();

  const features = [
    { icon: Upload,     step: '01', title: t('home_step1_title'), desc: t('home_step1_desc') },
    { icon: Cpu,        step: '02', title: t('home_step2_title'), desc: t('home_step2_desc') },
    { icon: TrendingUp, step: '03', title: t('home_step3_title'), desc: t('home_step3_desc') },
  ];

  const guarantees = [
    { icon: Lock,         label: t('home_guarantee_local')   },
    { icon: Zap,          label: t('home_guarantee_instant') },
    { icon: CheckCircle2, label: t('home_guarantee_free')    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-8 pb-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
          {t('home_badge')}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 leading-[1.1] tracking-tight mb-6">
          {t('home_hero_title_1')}{' '}
          <span className="text-blue-600 dark:text-blue-400">{t('home_hero_title_2')}</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
          {t('home_hero_desc')}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {user ? (
            <>
              <Link to="/upload" className="btn-amber px-8 py-3 text-base gap-2">
                <Upload size={18} aria-hidden="true" /> {t('home_cta_create')}
              </Link>
              <Link to="/dashboard" className="btn-secondary px-6 py-3 text-base gap-2">
                <LayoutDashboard size={18} aria-hidden="true" /> {t('home_cta_dashboard')}
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn-amber px-8 py-3 text-base gap-2">
                {t('home_cta_start')} <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                {t('home_cta_login')}
              </Link>
            </>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {guarantees.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Icon size={15} aria-hidden="true" className="text-emerald-500" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnement */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('home_how_title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('home_how_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, step, title, desc }) => (
            <div
              key={step}
              className="card relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
            >
              <div aria-hidden="true" className="absolute top-4 right-4 text-6xl font-black text-slate-100 dark:text-slate-800 leading-none select-none">
                {step}
              </div>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
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
            {t('home_cta_ready')}
          </h2>
          <p className="text-blue-100 mb-8 text-sm max-w-md mx-auto">
            {t('home_cta_ready_desc')}
          </p>
          <Link to="/signup" className="btn-amber px-8 py-3 text-base gap-2">
            {t('home_cta_start')} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
}
