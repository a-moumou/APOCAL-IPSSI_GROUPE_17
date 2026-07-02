import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { getApiErrorMessage } from '@/api/errors';
import { BookOpen, AlertCircle, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/upload';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Identifiants invalides.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-5">
            <BookOpen size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('login_title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('login_no_account')}{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t('login_signup_link')}
            </Link>
          </p>
        </div>

        <div className="card">
          {error && (
            <div role="alert" aria-live="assertive" className="alert-error mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="label">{t('login_email')}</label>
              <input
                id="login-email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="label !mb-0">{t('login_password')}</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  {t('login_forgot')}
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('login_loading')}
                </>
              ) : (
                <>
                  <LogIn size={16} aria-hidden="true" /> {t('login_submit')}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5">
          {t('login_legal')}{' '}
          <Link to="/legal/cgu" className="underline hover:text-slate-600">{t('login_cgu')}</Link>
          {' '}{t('login_and')}{' '}
          <Link to="/legal/confidentialite" className="underline hover:text-slate-600">{t('login_privacy')}</Link>.
        </p>
      </div>
    </div>
  );
}
