import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz, submitAnswers, type Quiz, type AnswerResult } from '@/api/quizzes';
import { useI18n } from '@/contexts/I18nContext';
import { CheckCircle, XCircle, Send, History, BookOpen, Loader2 } from 'lucide-react';

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const quizId = Number(id);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getQuiz(quizId)
      .then((q) => {
        setQuiz(q);
        const saved: Record<number, number> = {};
        q.questions.forEach((question) => {
          if (question.selected_index !== null) {
            saved[question.index] = question.selected_index;
          }
        });
        if (Object.keys(saved).length === 10 && q.score !== null) {
          setAnswers(saved);
          const details = q.questions.map((question) => ({
            index: question.index,
            selected_index: question.selected_index!,
            correct_index: question.correct_index,
            correct: question.selected_index === question.correct_index,
          }));
          setResult({ score: q.score, total: 10, details });
        } else if (Object.keys(saved).length > 0) {
          setAnswers(saved);
        }
      })
      .catch(() => setError(t('quiz_error_load')))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz || Object.keys(answers).length !== 10) return;
    setSubmitting(true);
    try {
      const payload = quiz.questions.map((q) => ({
        index: q.index,
        selected_index: answers[q.index]!,
      }));
      const res = await submitAnswers(quiz.id, payload);
      setResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(t('quiz_error_submit'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-10">
      <Loader2 size={16} className="animate-spin" aria-hidden="true" /> {t('quiz_loading')}
    </div>
  );
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;
  if (!quiz) return null;

  const allAnswered = Object.keys(answers).length === 10;
  const answeredCount = Object.keys(answers).length;

  const scoreVariant =
    result && result.score >= 7
      ? { bg: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-400' }
      : result && result.score >= 4
        ? { bg: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800', badge: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' }
        : { bg: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800', badge: 'bg-red-600', text: 'text-red-700 dark:text-red-400' };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{quiz.title}</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
            Quiz #{quiz.id} — {quiz.questions.length} questions
          </p>
        </div>
        {!result && (
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">{answeredCount} / 10 {t('quiz_answered')}</div>
            <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Résultat */}
      {result && (
        <div role="alert" aria-live="polite" className={`rounded-xl border p-5 ${scoreVariant.bg}`}>
          <div className="flex items-center gap-4 flex-wrap">
            <div aria-hidden="true" className={`${scoreVariant.badge} text-white rounded-xl w-16 h-16 flex flex-col items-center justify-center shrink-0`}>
              <span className="text-2xl font-black leading-none">{result.score}</span>
              <span className="text-xs opacity-75">/10</span>
            </div>
            <div>
              <p className={`font-bold text-base ${scoreVariant.text}`}>
                {result.score === 10
                  ? t('quiz_score_perfect')
                  : result.score >= 7
                    ? t('quiz_score_good')
                    : result.score >= 4
                      ? t('quiz_score_medium')
                      : t('quiz_score_low')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {result.details.filter((d) => d.correct).length} {t('quiz_correct_count')} {result.total}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Link to="/history" className="btn-secondary !text-xs !py-1.5 !px-3 gap-1.5">
              <History size={13} aria-hidden="true" /> {t('quiz_history')}
            </Link>
            <Link to="/review" className="btn-secondary !text-xs !py-1.5 !px-3 gap-1.5">
              <BookOpen size={13} aria-hidden="true" /> {t('quiz_review')}
            </Link>
          </div>
        </div>
      )}

      {/* Questions */}
      {quiz.questions.map((q) => {
        const userChoice = answers[q.index];
        const detail = result?.details.find((d) => d.index === q.index);
        const isAnswered = userChoice !== undefined;

        return (
          <div
            key={q.index}
            role="group"
            aria-labelledby={`question-label-${q.index}`}
            className={`card transition-all ${isAnswered && !result ? 'border-blue-200 dark:border-blue-800' : ''}`}
          >
            <div className="flex items-start gap-3 mb-4">
              <span aria-hidden="true" className="shrink-0 w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                {q.index}
              </span>
              <p id={`question-label-${q.index}`} className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-relaxed">
                {t('quiz_question_prefix')} {q.index} : {q.prompt}
              </p>
            </div>

            <div className="space-y-2 ml-10">
              {q.options.map((opt, optIdx) => {
                const isSelected = userChoice === optIdx;
                const isCorrect = detail && q.correct_index === optIdx;
                const isWrongPick = detail && isSelected && !detail.correct;

                let cls = 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer';
                let icon = null;
                let ariaLabel = opt;

                if (result) {
                  if (isCorrect) {
                    cls = 'border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 cursor-default';
                    icon = <CheckCircle size={15} aria-hidden="true" className="text-emerald-600 dark:text-emerald-400 shrink-0" />;
                    ariaLabel = `${opt} — ${t('quiz_option_correct')}`;
                  } else if (isWrongPick) {
                    cls = 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-300 cursor-default';
                    icon = <XCircle size={15} aria-hidden="true" className="text-red-500 dark:text-red-400 shrink-0" />;
                    ariaLabel = `${opt} — ${t('quiz_option_wrong')}`;
                  } else {
                    cls = 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50 cursor-default';
                  }
                } else if (isSelected) {
                  cls = 'border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 cursor-pointer';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={ariaLabel}
                    disabled={!!result}
                    onClick={() => handleSelect(q.index, optIdx)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all text-sm ${cls}`}
                  >
                    <span aria-hidden="true" className="shrink-0 w-6 h-6 rounded border border-current flex items-center justify-center text-xs font-bold opacity-60 font-mono">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Soumission */}
      {!result && (
        <div className="sticky bottom-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="btn-amber w-full py-3.5 text-base shadow-lg gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" /> {t('quiz_submitting')}
              </>
            ) : allAnswered ? (
              <>
                <Send size={18} aria-hidden="true" /> {t('quiz_submit')}
              </>
            ) : (
              `${t('quiz_answer_all')} (${answeredCount}/10)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
