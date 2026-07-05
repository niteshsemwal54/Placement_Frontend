import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadTestAttemptHistory } from "../services/api.js";

function HistorySkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
          <div className="h-24 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryReviewPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandAll, setExpandAll] = useState(false);
  const questionRefs = useRef([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchAttempt() {
      setLoading(true);
      setError("");
      setActiveIndex(0);

      try {
        const result = await loadTestAttemptHistory(attemptId);
        if (!isMounted) return;

        if (result?.error) {
          setAttempt(null);
          setError(result.error);
        } else {
          setAttempt(result);
        }
      } catch {
        if (isMounted) {
          setAttempt(null);
          setError("Unable to load test history.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (attemptId) {
      fetchAttempt();
    }

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  useEffect(() => {
    if (!attempt?.questions?.length) return;
    if (activeIndex >= attempt.questions.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, attempt]);

  useEffect(() => {
    if (typeof questionRefs.current[activeIndex]?.scrollIntoView === "function") {
      questionRefs.current[activeIndex].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeIndex, loading]);

  const questions = useMemo(() => Array.isArray(attempt?.questions) ? attempt.questions : [], [attempt]);

  if (loading) return <HistorySkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-red-500/20 bg-slate-900/90 p-8 text-center shadow-2xl shadow-red-500/10">
            <p className="text-lg font-semibold text-white">Unable to load test history.</p>
            <p className="mt-3 text-sm text-slate-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return null;
  }

  const stats = [
    { label: "Score", value: `${attempt.score ?? 0}` },
    { label: "Accuracy", value: `${attempt.percentage ?? 0}%` },
    { label: "Correct", value: attempt.correctAnswers ?? 0 },
    { label: "Wrong", value: attempt.wrongAnswers ?? 0 },
    { label: "Skipped", value: attempt.skippedQuestions ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Test review</p>
              <h1 className="mt-3 text-3xl font-black text-white">{attempt.topic || "Test review"}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString("en-IN") : "—"}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-800/80 bg-slate-950/80 px-4 py-4 text-left">
              <p className="text-sm text-slate-400">Overall score</p>
              <p className="mt-2 text-4xl font-black text-white">{attempt.score ?? 0}</p>
              <p className="mt-1 text-sm text-indigo-300">Accuracy {attempt.percentage ?? 0}%</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-4 shadow-2xl shadow-indigo-500/10 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Question review</p>
              <p className="mt-2 text-sm text-slate-400">
                Question {Math.min(activeIndex + 1, questions.length)} of {questions.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                className="rounded-full border border-slate-700/80 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                disabled={questions.length === 0 || activeIndex === 0}
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="rounded-full border border-slate-700/80 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                disabled={questions.length === 0 || activeIndex === questions.length - 1}
              >
                Next →
              </button>
              <button
                type="button"
                onClick={() => setExpandAll((prev) => !prev)}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                {expandAll ? "Collapse all" : "Expand all"}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {questions.length === 0 ? (
              <div className="rounded-[1.6rem] border border-dashed border-slate-700/80 bg-slate-950/70 p-8 text-center text-sm text-slate-400">
                No questions were returned for this attempt.
              </div>
            ) : (
              questions.map((question, index) => {
                const isActive = index === activeIndex;
                const selectedOption = question.selectedOption;
                const correctOption = question.correctOption;
                const options = Array.isArray(question.options) ? question.options : [];
                const isCorrect = question.isCorrect ?? question.correct ?? false;

                return (
                  <article
                    key={question.questionId || index}
                    ref={(node) => {
                      questionRefs.current[index] = node;
                    }}
                    className={`rounded-[1.6rem] border p-5 shadow-sm transition ${isActive ? "border-indigo-500/50 bg-slate-950/95" : "border-slate-800/80 bg-slate-900/80"}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Question {index + 1}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{question.question}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isCorrect ? (
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">Correct</span>
                        ) : question.selectedOption === null || question.selectedOption === undefined || question.selectedOption === "" ? (
                          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-300">Skipped</span>
                        ) : (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-300">Incorrect</span>
                        )}
                        {question.markedForReview ? (
                          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-300">Marked for review</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {options.map((option, optionIndex) => {
                        const optionLabel = typeof option === "object" && option !== null ? (option.id || option.label || String.fromCharCode(65 + optionIndex)) : (option?.id || String.fromCharCode(65 + optionIndex));
                        const optionText = typeof option === "string" ? option : option?.text ?? option?.label ?? "";
                        const isChosen = selectedOption === optionLabel;
                        const isAnswer = correctOption === optionLabel;
                        const isWrongChoice = isChosen && !isAnswer;
                        const isCorrectChoice = isAnswer && (isChosen || isCorrect || expandAll);
                        const classes = isCorrectChoice
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : isWrongChoice
                          ? "border-red-500/40 bg-red-500/10 text-red-200"
                          : "border-slate-800/80 bg-slate-950/80 text-slate-300";

                        return (
                          <div key={`${question.questionId || index}-${optionIndex}`} className={`rounded-[1.2rem] border px-4 py-3 ${classes}`}>
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900/80 text-sm font-semibold text-white">
                                {optionLabel}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm leading-7">{optionText}</p>
                                {isCorrectChoice ? <p className="mt-1 text-xs font-semibold text-emerald-300">Correct answer</p> : null}
                                {isWrongChoice ? <p className="mt-1 text-xs font-semibold text-red-300">Your answer</p> : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {(expandAll || isActive) && (
                      <div className="mt-5 flex flex-wrap gap-3 rounded-[1.2rem] border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
                        <span>Time taken: {question.timeTaken ?? 0}s</span>
                        <span>•</span>
                        <span>{question.markedForReview ? "Marked for review" : "Not marked for review"}</span>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
