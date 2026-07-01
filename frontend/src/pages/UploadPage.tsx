import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz } from '@/api/llm';
import { getApiErrorMessage } from '@/api/errors';
import { FileText, FileUp, Sparkles, AlertCircle, UploadCloud } from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();
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
          Créer un nouveau quiz
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Importe un cours, l'IA génère 10 questions QCM en 1 à 5 minutes.
        </p>
      </div>

      {error && (
        <div className="alert-error mb-6 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titre */}
        <div className="card">
          <label className="label">Titre du cours</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Histoire — Révolution française"
            className="input"
          />
        </div>

        {/* Source */}
        <div className="card">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'text'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FileText size={14} /> Texte
            </button>
            <button
              type="button"
              onClick={() => setMode('pdf')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'pdf'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FileUp size={14} /> PDF
            </button>
          </div>

          {mode === 'text' ? (
            <div>
              <label className="label">Contenu du cours</label>
              <div className="relative">
                <textarea
                  required
                  rows={12}
                  minLength={200}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Collez ici le texte de votre cours (minimum 200 caractères)..."
                  className="input resize-none"
                />
                <span
                  className={`absolute bottom-2.5 right-3 text-xs font-mono ${
                    charOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {charCount} / 200
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="label">Fichier PDF</label>
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-10 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors text-center">
                <UploadCloud
                  size={36}
                  className={pdf ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}
                />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pdf ? pdf.name : 'Cliquez pour sélectionner un PDF'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">PDF uniquement, 5 Mo max.</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  required
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
                <span className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                Génération en cours... (1 à 5 min)
              </>
            ) : (
              <>
                <Sparkles size={18} /> Générer le quiz
              </>
            )}
          </button>

          {loading && (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              L'IA tourne en local sur votre machine. Ne fermez pas cette page.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
