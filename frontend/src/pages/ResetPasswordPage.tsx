import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from '@/api/auth';
import { useI18n } from '@/contexts/I18nContext';
import { getApiErrorMessage } from '@/api/errors';

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get('uid') ?? '';
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const linkInvalid = !uid || !token;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t('reset_mismatch'));
      return;
    }
    setLoading(true);
    try {
      const detail = await confirmPasswordReset(uid, token, password);
      setMessage(detail);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Réinitialisation impossible.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('reset_title')}</h1>

        {linkInvalid ? (
          <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-300 rounded">
            {t('reset_invalid')}{' '}
            <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('reset_invalid_link')}
            </Link>.
          </div>
        ) : message ? (
          <div role="status" className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950 border-l-4 border-emerald-500 text-sm text-emerald-900 dark:text-emerald-300 rounded">
            {message} {t('reset_redirect')}
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('reset_desc')}</p>

            {error && (
              <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="reset-pwd" className="label">{t('reset_new_pwd')}</label>
                <input
                  id="reset-pwd"
                  type="password"
                  required
                  minLength={8}
                  autoFocus
                  autoComplete="new-password"
                  aria-required="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="reset-confirm" className="label">{t('reset_confirm_pwd')}</label>
                <input
                  id="reset-confirm"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-required="true"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? t('reset_loading') : t('reset_submit')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
