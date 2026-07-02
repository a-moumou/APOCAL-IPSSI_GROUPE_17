import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { changePassword, deleteAccount, updateProfile } from '@/api/auth';
import { getApiErrorMessage } from '@/api/errors';

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [infoErr, setInfoErr] = useState<string | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdErr, setPwdErr] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [delPwd, setDelPwd] = useState('');
  const [delConfirm, setDelConfirm] = useState(false);
  const [delErr, setDelErr] = useState<string | null>(null);
  const [delLoading, setDelLoading] = useState(false);

  const handleInfo = async (e: FormEvent) => {
    e.preventDefault();
    setInfoMsg(null);
    setInfoErr(null);
    setInfoLoading(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, email });
      await refresh();
      setInfoMsg(t('profile_saved'));
    } catch (err) {
      setInfoErr(getApiErrorMessage(err, 'Mise à jour impossible.'));
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    setPwdErr(null);
    if (newPwd !== confirmPwd) {
      setPwdErr(t('profile_pwd_mismatch'));
      return;
    }
    setPwdLoading(true);
    try {
      const detail = await changePassword(oldPwd, newPwd);
      setPwdMsg(detail);
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err) {
      setPwdErr(getApiErrorMessage(err, 'Changement de mot de passe impossible.'));
    } finally {
      setPwdLoading(false);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    setDelErr(null);
    setDelLoading(true);
    try {
      await deleteAccount(delPwd);
      await refresh();
      navigate('/', { replace: true });
    } catch (err) {
      setDelErr(getApiErrorMessage(err, 'Suppression impossible.'));
      setDelLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('profile_title')}</h1>

      {/* Zone 1 : informations */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('profile_info_title')}</h2>
        {infoMsg && (
          <div role="status" className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950 border-l-4 border-emerald-500 text-sm text-emerald-900 dark:text-emerald-300 rounded">
            {infoMsg}
          </div>
        )}
        {infoErr && (
          <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-300 rounded">
            {infoErr}
          </div>
        )}
        <form onSubmit={handleInfo} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="profile-firstname" className="label">{t('profile_firstname')}</label>
              <input
                id="profile-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="profile-lastname" className="label">{t('profile_lastname')}</label>
              <input
                id="profile-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="profile-email" className="label">
              {t('profile_email')}{' '}
              {user && !user.email_verified && (
                <span className="text-amber-600 font-normal">{t('profile_email_unverified')}</span>
              )}
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('profile_email_hint')}</p>
          </div>
          <button type="submit" disabled={infoLoading} className="btn-primary">
            {infoLoading ? t('profile_saving') : t('profile_save')}
          </button>
        </form>
      </section>

      {/* Zone 2 : mot de passe */}
      <section className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('profile_pwd_title')}</h2>
        {pwdMsg && (
          <div role="status" className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950 border-l-4 border-emerald-500 text-sm text-emerald-900 dark:text-emerald-300 rounded">
            {pwdMsg}
          </div>
        )}
        {pwdErr && (
          <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-300 rounded">
            {pwdErr}
          </div>
        )}
        <form onSubmit={handlePassword} className="space-y-4" noValidate>
          <div>
            <label htmlFor="pwd-current" className="label">{t('profile_pwd_current')}</label>
            <input
              id="pwd-current"
              type="password"
              required
              autoComplete="current-password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pwd-new" className="label">{t('profile_pwd_new')}</label>
              <input
                id="pwd-new"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="pwd-confirm" className="label">{t('profile_pwd_confirm')}</label>
              <input
                id="pwd-confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <button type="submit" disabled={pwdLoading} className="btn-primary">
            {pwdLoading ? t('profile_pwd_loading') : t('profile_pwd_submit')}
          </button>
        </form>
      </section>

      {/* Placeholders RGPD */}
      <section className="card bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{t('profile_data_title')}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('profile_data_desc')}</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled className="btn-secondary opacity-60 cursor-not-allowed">
            {t('profile_export')}
          </button>
          <button type="button" disabled className="btn-secondary opacity-60 cursor-not-allowed">
            {t('profile_report')}
          </button>
        </div>
      </section>

      {/* Zone 3 : danger */}
      <section className="card border-2 border-rose-200 dark:border-rose-800">
        <h2 className="text-lg font-semibold text-rose-700 dark:text-rose-400 mb-2">{t('profile_danger_title')}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {t('profile_danger_desc').replace('<strong>', '').replace('</strong>', '')}
        </p>
        {delErr && (
          <div role="alert" className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border-l-4 border-rose-500 text-sm text-rose-900 dark:text-rose-300 rounded">
            {delErr}
          </div>
        )}
        <form onSubmit={handleDelete} className="space-y-4" noValidate>
          <div>
            <label htmlFor="del-pwd" className="label">{t('profile_danger_pwd')}</label>
            <input
              id="del-pwd"
              type="password"
              required
              autoComplete="current-password"
              value={delPwd}
              onChange={(e) => setDelPwd(e.target.value)}
              className="input"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={delConfirm}
              onChange={(e) => setDelConfirm(e.target.checked)}
              className="w-4 h-4"
            />
            {t('profile_danger_check')}
          </label>
          <button
            type="submit"
            disabled={delLoading || !delConfirm}
            className="btn-danger"
          >
            {delLoading ? t('profile_danger_loading') : t('profile_danger_submit')}
          </button>
        </form>
      </section>
    </div>
  );
}
