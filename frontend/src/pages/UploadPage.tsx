import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz } from '@/api/llm';
import { getApiErrorMessage } from '@/api/errors';
import { useI18n } from '@/contexts/I18nContext';
import { FileText, FileUp, Sparkles, AlertCircle, UploadCloud } from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'pdf' | 'text'>('text');
  const [pdf, setPdf] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const quiz = await generateQuiz({
        title,
        pdf: mode === 'pdf' ? (pdf ?? undefined) : undefined,
        source_text: mode === 'text' ? sourceText : undefined,
      });
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Échec de la génération.'));
    } finally {
      setLoading(false);
    }
  };

  const charCount = sourceText.length;
  const charOk = charCount >= 200;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          {t('upload_title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('upload_subtitle')}
        </p>
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="alert-error mb-6 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Titre */}
        <div className="card">
          <label htmlFor="quiz-title" className="label">{t('upload_course_title')}</label>
          <input
            id="quiz-title"
            type="text"
            required
            aria-required="true"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('upload_course_title_placeholder')}
            className="input"
          />
        </div>

        {/* Source */}
        <div className="card">
          {/* Tabs */}
          <div role="tablist" aria-label="Mode de saisie du cours" className="flex gap-1 mb-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              aria-controls="panel-text"
              id="tab-text"
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'text'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FileText size={14} aria-hidden="true" /> {t('upload_tab_text')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'pdf'}
              aria-controls="panel-pdf"
              id="tab-pdf"
              onClick={() => setMode('pdf')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'pdf'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FileUp size={14} aria-hidden="true" /> {t('upload_tab_pdf')}
            </button>
          </div>

          {mode === 'text' ? (
            <div id="panel-text" role="tabpanel" aria-labelledby="tab-text">
              <label htmlFor="course-text" className="label">{t('upload_text_label')}</label>
              <div className="relative">
                <textarea
                  id="course-text"
                  required
                  rows={12}
                  minLength={200}
                  aria-required="true"
                  aria-describedby="char-counter"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder={t('upload_text_placeholder')}
                  className="input resize-none"
                />
                <span
                  id="char-counter"
                  aria-live="polite"
                  className={`absolute bottom-2.5 right-3 text-xs font-mono ${
                    charOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {charCount} / 200
                </span>
              </div>
            </div>
          ) : (
            <div id="panel-pdf" role="tabpanel" aria-labelledby="tab-pdf">
              <label htmlFor="course-pdf" className="label">{t('upload_pdf_label')}</label>
              <label htmlFor="course-pdf" className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-10 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors text-center">
                <UploadCloud
                  size={36}
                  aria-hidden="true"
                  className={pdf ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}
                />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pdf ? pdf.name : t('upload_pdf_click')}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('upload_pdf_hint')}</p>
                </div>
                <input
                  id="course-pdf"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  aria-required="true"
                  onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading || (mode === 'text' && !charOk)}
            className="btn-amber w-full py-3 text-base gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" aria-hidden="true" />
                {t('upload_loading')}
              </>
            ) : (
              <>
                <Sparkles size={18} aria-hidden="true" /> {t('upload_submit')}
              </>
            )}
          </button>

          {loading && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              {t('upload_loading_hint')}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
