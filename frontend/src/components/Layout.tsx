import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
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
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base hidden sm:inline">
              {nameHead && <span>{nameHead} </span>}
              <span className="text-amber-500">{nameTail}</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {user ? (
              <>
                <NavLink to="/upload" className={navCls}>
                  <PlusCircle size={15} />
                  <span className="hidden sm:inline">Nouveau quiz</span>
                </NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => `${navCls({ isActive })} hidden sm:flex`}>
                  <LayoutDashboard size={15} />
                  <span className="hidden md:inline">Tableau de bord</span>
                </NavLink>
                <NavLink to="/review" className={({ isActive }) => `${navCls({ isActive })} hidden md:flex`}>
                  <BookOpen size={15} />
                  <span className="hidden lg:inline">Révision</span>
                </NavLink>
                <NavLink to="/history" className={navCls}>
                  <History size={15} />
                  <span className="hidden sm:inline">Historique</span>
                </NavLink>
                {user.is_staff && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-amber-50 text-amber-700' : 'text-amber-600 hover:bg-amber-50'
                      }`
                    }
                  >
                    <Settings size={15} />
                    <span className="hidden sm:inline">Admin</span>
                  </NavLink>
                )}
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
                <NavLink to="/profile" className={({ isActive }) => `${navCls({ isActive })} hidden sm:flex`}>
                  <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden md:inline text-sm">{user.first_name || user.email}</span>
                </NavLink>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950 transition-colors ml-1"
                  title="Déconnexion"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User size={15} />
                  Connexion
                </Link>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <Link to="/signup" className="btn-primary !px-4 !py-1.5 !text-sm ml-1">
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {config.banner_enabled && config.banner_message && (
        <div className="bg-blue-600 text-white text-sm text-center py-2 px-4 font-medium">
          {config.banner_message}
        </div>
      )}

      <VerifyEmailBanner />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{config.app_name}</div>
              <div className="text-xs text-slate-400">APOCAL'IPSSI 2026 — CC BY-NC-SA 4.0</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/legal/mentions-legales" className="hover:text-blue-600 transition-colors">Mentions légales</Link>
            <Link to="/legal/confidentialite" className="hover:text-blue-600 transition-colors">Confidentialité</Link>
            <Link to="/legal/cgu" className="hover:text-blue-600 transition-colors">CGU</Link>
            <Link to="/legal/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link>
            <a href="https://mohamedelafrit.com/teaching/Master_Classe_Agile/cours.html" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Cours Agile</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
