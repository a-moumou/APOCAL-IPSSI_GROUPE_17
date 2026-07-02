import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { getApiErrorMessage } from '@/api/errors';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const { refresh } = useAuth();
  const token = params.get('token') ?? '';

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState(t('verify_loading'));
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (!token) {
      setStatus('error');
      setMessage('Lien de validation incomplet (token manquant).');
      return;
    }

    verifyEmail(token)
      .then(async (detail) => {
        setStatus('success');
        setMessage(detail);
        await refresh().catch(() => undefined);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(getApiErrorMessage(err, 'Lien de validation invalide ou expiré.'));
      });
  }, [token, refresh]);

  const tone =
    status === 'success'
      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-300'
      : status === 'error'
        ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-300'
        : 'bg-slate-50 dark:bg-slate-800 border-slate-400 text-slate-700 dark:text-slate-300';

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('verify_title')}</h1>

        <div role={status === 'loading' ? 'status' : 'alert'} className={`p-3 border-l-4 text-sm rounded ${tone}`}>
          {message}
        </div>

        <div className="mt-6 flex gap-4 text-sm">
          <Link to="/upload" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t('verify_go_app')}
          </Link>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t('verify_login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
