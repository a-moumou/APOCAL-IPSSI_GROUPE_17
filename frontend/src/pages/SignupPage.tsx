import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useI18n } from '@/contexts/I18nContext';
import { getApiErrorMessage } from '@/api/errors';
import { BookOpen, AlertCircle, UserPlus, Lock } from 'lucide-react';

export default function SignupPage() {
  const { refresh } = useAuth();
  const { config } = useSiteConfig();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup({ email, password, first_name: firstName || undefined, last_name: lastName || undefined });
      await refresh();
      navigate('/upload', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Inscription impossible.'));
    } finally {
      setLoading(false);
    }
  };

  if (!config.allow_signups) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="card text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Lock size={22} className="text-slate-500 dark:text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('signup_closed_title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{t('signup_closed_desc')}</p>
          <Link to="/login" className="btn-primary w-full">{t('signup_closed_login')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-5" aria-hidden="true">
            <BookOpen size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('signup_title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('signup_have_account')}{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t('signup_login_link')}
            </Link>
          </p>
        </div>

        <div className="card">
          {error && (
            <div role="alert" aria-live="assertive" className="alert-error mb-4 flex items-start gap-2">
              <AlertCircle size={16} aria-hidden="true" className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-email" className="label">{t('signup_email')}</label>
              <input
                id="signup-email"
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-firstname" className="label">
                  {t('signup_firstname')} <span className="text-slate-400 font-normal">{t('signup_optional')}</span>
                </label>
                <input id="signup-firstname" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Léa" className="input" />
              </div>
              <div>
                <label htmlFor="signup-lastname" className="label">
                  {t('signup_lastname')} <span className="text-slate-400 font-normal">{t('signup_optional')}</span>
                </label>
                <input id="signup-lastname" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Martin" className="input" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="label">
                {t('signup_password')} <span className="text-slate-400 font-normal">{t('signup_pwd_hint')}</span>
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('signup_pwd_placeholder')}
                className="input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  {t('signup_loading')}
                </>
              ) : (
                <>
                  <UserPlus size={16} aria-hidden="true" /> {t('signup_submit')}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5">
          {t('signup_legal')}{' '}
          <Link to="/legal/cgu" className="underline hover:text-slate-600">{t('login_cgu')}</Link>
          {' '}{t('login_and')}{' '}
          <Link to="/legal/confidentialite" className="underline hover:text-slate-600">{t('login_privacy')}</Link>.
        </p>
      </div>
    </div>
  );
}
