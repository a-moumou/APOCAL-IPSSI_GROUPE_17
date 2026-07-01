import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listQuizzes, deleteQuiz, type QuizSummary } from '@/api/quizzes';
import { Plus, Trash2, ClipboardList, Loader2 } from 'lucide-react';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? 'bg-emerald-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="mt-3 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${(score / 10) * 100}%` }} />
    </div>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null)
    return <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Non passé</span>;
  const cls = score >= 7
    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950'
    : score >= 4
      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950'
      : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950';
  return <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${cls}`}>{score}/10</span>;
}

export default function HistoryPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    listQuizzes()
      .then((res) => setQuizzes(res.results))
      .catch(() => setError("Impossible de charger l'historique."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.preventDefault();
    if (!confirm("Supprimer ce quiz ?")) return;
    setDeleting(id);
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  }

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-10">
      <Loader2 size={16} className="animate-spin" /> Chargement...
    </div>
  );
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mon historique</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {quizzes.length === 0 ? "Aucun quiz pour l'instant." : `${quizzes.length} quiz au compteur.`}
          </p>
        </div>
        <Link to="/upload" className="btn-amber gap-2">
          <Plus size={16} /> Nouveau quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <ClipboardList size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Aucun quiz dans l'historique</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
            Générez votre premier quiz à partir d'un cours pour commencer.
          </p>
          <Link to="/upload" className="btn-primary gap-2"><Plus size={15} /> Créer mon premier quiz</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {quizzes.map((q) => (
            <div key={q.id} className="relative group">
              <Link
                to={`/quiz/${q.id}`}
                className="card block hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    #{q.id} — {new Date(q.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <ScoreBadge score={q.score} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug pr-8">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{q.nb_questions} questions</p>
                {q.score !== null && <ScoreBar score={q.score} />}
              </Link>

              <button
                onClick={(e) => handleDelete(e, q.id)}
                disabled={deleting === q.id}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-200 dark:border-red-800"
                title="Supprimer ce quiz"
              >
                {deleting === q.id
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
