import { useState } from 'react';
import { resendVerification } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { getApiErrorMessage } from '@/api/errors';

export default function VerifyEmailBanner() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.email_verified) return null;

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    try {
      setMessage(await resendVerification());
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Impossible de renvoyer l'email pour le moment."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="alert" className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-6xl mx-auto px-4 py-2 text-sm text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2">
        <span>
          {t('banner_unverified')}
          {message ? ` — ${message}` : '.'}
        </span>
        <button
          onClick={handleResend}
          disabled={loading}
          className="underline hover:no-underline font-medium disabled:opacity-50"
        >
          {loading ? t('banner_resending') : t('banner_resend')}
        </button>
      </div>
    </div>
  );
}
