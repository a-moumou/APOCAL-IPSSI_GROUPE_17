import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMistakes, type Mistake } from '@/api/quizzes';
import { getApiErrorMessage } from '@/api/errors';
import { CheckCircle2, XCircle, Plus, Loader2, ArrowRight } from 'lucide-react';

function OptionRow({ text, isCorrect, isSelected }: { text: string; isCorrect: boolean; isSelected: boolean }) {
  let cls = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400';
  let icon = null;
  let tag = '';

  if (isCorrect) {
    cls = 'border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300';
    icon = <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />;
    tag = 'Bonne réponse';
  } else if (isSelected) {
    cls = 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-300';
    icon = <XCircle size={15} className="text-red-500 dark:text-red-400 shrink-0" />;
    tag = 'Votre réponse';
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg text-sm ${cls}`}>
      {icon ?? <span className="w-[15px] shrink-0" />}
      <span className="flex-1">{text}</span>
      {tag && <span className="text-xs font-semibold opacity-75 whitespace-nowrap">{tag}</span>}
    </div>
  );
}

export default function ReviewMistakesPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMistakes()
      .then((res) => setMistakes(res.mistakes))
      .catch((err) => setError(getApiErrorMessage(err, 'Impossible de charger vos erreurs.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-10">
      <Loader2 size={16} className="animate-spin" /> Chargement...
    </div>
  );
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Réviser mes erreurs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {mistakes.length === 0
            ? 'Aucune erreur enregistrée.'
            : `${mistakes.length} question${mistakes.length > 1 ? 's' : ''} à revoir.`}
        </p>
      </div>

      {mistakes.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Aucune erreur a réviser</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
            Passez un quiz pour vous entraîner — vos erreurs apparaîtront ici.
          </p>
          <Link to="/upload" className="btn-primary gap-2"><Plus size={15} /> Créer un quiz</Link>
        </div>
      ) : (
        <div className="max-w-3xl space-y-4">
          {mistakes.map((m) => (
            <div key={`${m.quiz_id}-${m.index}`} className="card">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  Quiz #{m.quiz_id} — Question {m.index}
                </span>
                <Link
                  to={`/quiz/${m.quiz_id}`}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Refaire ce quiz <ArrowRight size={12} />
                </Link>
              </div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">{m.prompt}</p>
              <div className="space-y-2">
                {m.options.map((opt, i) => (
                  <OptionRow
                    key={i}
                    text={opt}
                    isCorrect={i === m.correct_index}
                    isSelected={i === m.selected_index}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                Issu du quiz « {m.quiz_title} »
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
