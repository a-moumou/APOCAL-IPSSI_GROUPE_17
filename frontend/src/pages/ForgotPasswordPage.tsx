import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '@/api/auth';
import { useI18n } from '@/contexts/I18nContext';
import { getApiErrorMessage } from '@/api/errors';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const detail = await requestPasswordReset(email);
      setMessage(detail);
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible d'envoyer le lien."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('forgot_title')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('forgot_desc')}</p>

        {message ? (
          <div role="status" className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950 border-l-4 border-emerald-500 text-sm text-emerald-900 dark:text-emerald-300 rounded">
            {message}
            <div className="mt-3">
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t('forgot_back')}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="forgot-email" className="label">{t('forgot_email')}</label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  aria-required="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? t('forgot_loading') : t('forgot_submit')}
              </button>
            </form>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t('forgot_back')}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
