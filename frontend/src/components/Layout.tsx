import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useI18n } from '@/contexts/I18nContext';
import VerifyEmailBanner from '@/components/VerifyEmailBanner';
import {
  PlusCircle,
  LayoutDashboard,
  BookOpen,
  History,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { config } = useSiteConfig();
  const { t, locale, toggleLocale } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const nameWords = config.app_name.trim().split(' ');
  const nameHead = nameWords.slice(0, -1).join(' ');
  const nameTail = nameWords[nameWords.length - 1];

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Lien d'évitement RGAA — visible au focus clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        {t('skip_to_content')}
      </a>

      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" aria-label={`${config.app_name} — ${t('nav_home_aria')}`} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center" aria-hidden="true">
              <BookOpen size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base hidden sm:inline">
              {nameHead && <span>{nameHead} </span>}
              <span className="text-amber-500">{nameTail}</span>
            </span>
          </Link>

          {/* Nav */}
          <nav aria-label="Navigation principale" className="flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/upload" className={navCls} aria-label={t('nav_new_quiz')}>
                  <PlusCircle size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">{t('nav_new_quiz')}</span>
                </NavLink>
                <NavLink to="/dashboard" aria-label={t('nav_dashboard')} className={({ isActive }) => `${navCls({ isActive })} hidden sm:flex`}>
                  <LayoutDashboard size={15} aria-hidden="true" />
                  <span className="hidden md:inline">{t('nav_dashboard')}</span>
                </NavLink>
                <NavLink to="/review" aria-label={t('nav_review')} className={({ isActive }) => `${navCls({ isActive })} hidden md:flex`}>
                  <BookOpen size={15} aria-hidden="true" />
                  <span className="hidden lg:inline">{t('nav_review')}</span>
                </NavLink>
                <NavLink to="/history" aria-label={t('nav_history')} className={navCls}>
                  <History size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">{t('nav_history')}</span>
                </NavLink>
                {user.is_staff && (
                  <NavLink
                    to="/admin"
                    aria-label={t('nav_admin')}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-amber-50 text-amber-700' : 'text-amber-600 hover:bg-amber-50'
                      }`
                    }
                  >
                    <Settings size={15} aria-hidden="true" />
                    <span className="hidden sm:inline">{t('nav_admin')}</span>
                  </NavLink>
                )}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />
                <NavLink to="/profile" aria-label={t('nav_profile')} className={({ isActive }) => `${navCls({ isActive })} hidden sm:flex`}>
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden md:inline text-sm">{user.first_name || user.email}</span>
                </NavLink>
                <LocaleToggle locale={locale} onToggle={toggleLocale} />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  aria-label={t('nav_logout')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950 transition-colors ml-1"
                >
                  <LogOut size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">{t('nav_logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User size={15} aria-hidden="true" />
                  {t('nav_login')}
                </Link>
                <LocaleToggle locale={locale} onToggle={toggleLocale} />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <Link to="/signup" className="btn-primary !px-4 !py-1.5 !text-sm ml-1">
                  {t('nav_signup')}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {config.banner_enabled && config.banner_message && (
        <div role="banner" className="bg-blue-600 text-white text-sm text-center py-2 px-4 font-medium">
          {config.banner_message}
        </div>
      )}

      <VerifyEmailBanner />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center" aria-hidden="true">
              <BookOpen size={14} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{config.app_name}</div>
              <div className="text-xs text-slate-400">APOCAL'IPSSI 2026 — CC BY-NC-SA 4.0</div>
            </div>
          </div>
          <nav aria-label="Navigation légale" className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/legal/mentions-legales" className="hover:text-blue-600 transition-colors">Mentions légales</Link>
            <Link to="/legal/confidentialite" className="hover:text-blue-600 transition-colors">Confidentialité</Link>
            <Link to="/legal/cgu" className="hover:text-blue-600 transition-colors">CGU</Link>
            <Link to="/legal/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link>
            <a href="https://mohamedelafrit.com/teaching/Master_Classe_Agile/cours.html" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" aria-label={`Cours Agile ${t('external_link_suffix')}`}>Cours Agile</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) {
  const { t } = useI18n();
  const label = theme === 'dark' ? t('nav_theme_light') : t('nav_theme_dark');
  return (
    <button
      onClick={onToggle}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
    >
      {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
    </button>
  );
}

function LocaleToggle({ locale, onToggle }: { locale: 'fr' | 'en'; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
      className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 text-xs font-bold"
    >
      {locale === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
