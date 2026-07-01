import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, type Stats } from '@/api/quizzes';
import { getApiErrorMessage } from '@/api/errors';
import { Plus, BarChart3, Target, Trophy, CheckSquare, Percent, BookOpen, History, Loader2 } from 'lucide-react';

function KpiCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ElementType }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <Icon size={16} className="text-slate-300 dark:text-slate-600" />
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{value}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

function barColor(score: number) {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(getApiErrorMessage(err, 'Impossible de charger les statistiques.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-10">
      <Loader2 size={16} className="animate-spin" /> Chargement...
    </div>
  );
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;
  if (!stats) return null;

  const hasData = stats.quizzes_taken > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tableau de bord</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Votre progression sur EduTutor IA.</p>
        </div>
        <Link to="/upload" className="btn-amber gap-2">
          <Plus size={16} /> Nouveau quiz
        </Link>
      </div>

      {!hasData ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <BarChart3 size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Aucune statistique disponible</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
            Passez votre premier quiz pour voir vos stats apparaître ici.
          </p>
          <Link to="/upload" className="btn-primary gap-2"><Plus size={15} /> Créer un quiz</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={Target}      label="Quiz passés"   value={String(stats.quizzes_taken)} sub={`${stats.total_quizzes} créés au total`} />
            <KpiCard icon={BarChart3}   label="Score moyen"   value={stats.average_score !== null ? `${stats.average_score}/10` : '—'} />
            <KpiCard icon={Trophy}      label="Meilleur score" value={stats.best_score !== null ? `${stats.best_score}/10` : '—'} />
            <KpiCard icon={Percent}     label="Précision"      value={stats.accuracy !== null ? `${stats.accuracy}%` : '—'} sub={`${stats.questions_correct}/${stats.questions_answered} bonnes réponses`} />
          </div>

          {stats.history.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={16} className="text-slate-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Progression des scores</h2>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
                Chaque barre correspond à un quiz passé, dans l'ordre chronologique.
              </p>
              <div className="flex items-end gap-1.5 h-40 border-b border-l border-slate-200 dark:border-slate-700 pl-1 pb-px">
                {stats.history.map((p) => (
                  <div key={p.id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {p.score}/10
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mb-0.5 font-mono">{p.score}</span>
                    <div
                      className={`w-full rounded-t ${barColor(p.score)}`}
                      style={{ height: `${Math.max((p.score / 10) * 100, 4)}%` }}
                      title={`${p.title} — ${p.score}/10`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Score &ge; 7</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" />Score 4–6</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />Score &lt; 4</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link to="/review" className="btn-secondary gap-2"><BookOpen size={15} /> Réviser mes erreurs</Link>
            <Link to="/history" className="btn-secondary gap-2"><History size={15} /> Voir l'historique</Link>
            <Link to="/upload" className="btn-secondary gap-2"><CheckSquare size={15} /> Nouveau quiz</Link>
          </div>
        </>
      )}
    </div>
  );
}
