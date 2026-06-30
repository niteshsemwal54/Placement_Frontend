import { useState, useEffect, useRef } from "react";
import { getTopic, fmtTime } from "../quizData";

function QuestionContent({ question, selectedAnswer, onSelect, locked }) {
  const isCode = question.type === "code";
  const hasOptions = Array.isArray(question.options) && question.options.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Question</p>
            <p className="text-lg sm:text-xl font-semibold leading-8 text-white">{question.q}</p>
          </div>

          {isCode ? (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-4 overflow-x-auto">
              <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                <span>Code snippet</span>
                {question.language ? <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300">{question.language}</span> : null}
              </div>
              <pre className="whitespace-pre font-mono text-sm leading-6 text-slate-100">
                <code>{question.code_lines.join("\n")}</code>
              </pre>
            </div>
          ) : null}

          {hasOptions ? (
            <div className="space-y-3">
              {question.options.map((opt, oi) => {
                const isSelected = selectedAnswer === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => !locked && onSelect(oi)}
                    disabled={locked}
                    className={`w-full rounded-[1.75rem] border px-5 py-5 text-left transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10"
                        : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900"
                    } ${locked ? "opacity-80" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-3xl text-sm font-black ${isSelected ? "bg-indigo-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="text-sm leading-7">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ExamView({ questions, topicId, totalSecs, onFinish }) {
  const t = getTopic(topicId);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [locked, setLocked] = useState(Array(questions.length).fill(false));
  const [chosen, setChosen] = useState(null);
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(totalSecs);
  const [confirm, setConfirm] = useState(false);
  const done = useRef(false);
  const t0 = useRef(Date.now());

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!done.current) {
        done.current = true;
        finish(false);
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  function finish(manual) {
    const timeTaken = Math.round((Date.now() - t0.current) / 1000);
    onFinish({ answers, timeTaken, totalSecs, timedOut: !manual });
  }

  function saveAndGo(dir) {
    const na = [...answers];
    const nl = [...locked];
    if (chosen !== null) {
      na[cur] = chosen;
      nl[cur] = true;
    }
    setAnswers(na);
    setLocked(nl);
    setChosen(null);
    const next = cur + dir;
    if (next >= 0 && next < questions.length) setCur(next);
  }

  function jumpTo(i) {
    const na = [...answers];
    const nl = [...locked];
    if (chosen !== null) {
      na[cur] = chosen;
      nl[cur] = true;
    }
    setAnswers(na);
    setLocked(nl);
    setChosen(null);
    setCur(i);
  }

  const q = questions[cur];
  const pct = (timeLeft / totalSecs) * 100;
  const timerCls = pct > 50 ? "text-emerald-400" : pct > 20 ? "text-amber-400" : "text-red-400 animate-pulse";
  const barCls = pct > 50 ? "bg-emerald-500" : pct > 20 ? "bg-amber-500" : "bg-red-500";
  const answered = answers.filter(a => a !== null).length;
  const display = chosen !== null ? chosen : answers[cur];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/95 px-4 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600/15 text-2xl">{t?.icon}</div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Question</p>
                <p className="text-base font-semibold text-white">{cur + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-mono tabular-nums font-black ${timerCls}`}>{fmtTime(timeLeft)}</p>
              <p className="text-xs text-slate-400">Time left</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900">
              <div className={`h-full rounded-full transition-all duration-1000 ${barCls}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
              <div className="rounded-3xl bg-slate-900/80 px-3 py-2">{answered} answered</div>
              <div className="rounded-3xl bg-slate-900/80 px-3 py-2">{questions.length - answered} left</div>
              <div className="rounded-3xl bg-slate-900/80 px-3 py-2">{flagged.size} flagged</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto w-full max-w-3xl space-y-5">
          <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
            {q.subtopic && <p className="text-xs uppercase tracking-[0.32em] text-indigo-300 mb-3">📌 {q.subtopic}</p>}
            <p className="text-lg sm:text-xl font-semibold leading-8 text-white">{q.q}</p>
          </div>

          <QuestionContent question={q} selectedAnswer={display} onSelect={(selection) => setChosen(selection)} locked={locked[cur]} />

          <div className="rounded-[1.75rem] border border-slate-800/90 bg-slate-900/90 p-4 text-sm text-slate-300">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setFlagged((p) => {
                  const n = new Set(p);
                  n.has(cur) ? n.delete(cur) : n.add(cur);
                  return n;
                })}
                className={`w-full sm:w-auto rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                  flagged.has(cur)
                    ? "border-amber-500 bg-amber-500/15 text-amber-300"
                    : "border-slate-800 bg-slate-950 hover:border-amber-500 hover:text-amber-300"
                }`}
              >
                {flagged.has(cur) ? "Unflag question" : "Flag this question"}
              </button>
              <p className="text-slate-400">Tap an option card to select your answer. Your choice is saved when you move next.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-50 border-t border-slate-800/90 bg-slate-950/95 px-4 py-4 backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => saveAndGo(-1)}
            disabled={cur === 0}
            className="rounded-3xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="rounded-3xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => saveAndGo(1)}
            className="rounded-3xl bg-indigo-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
          >
            {cur === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </footer>

      {confirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <p className="text-white text-xl font-bold mb-2">Submit test?</p>
            <p className="text-gray-400 text-sm mb-1">
              Answered: <span className="text-white font-bold">{answered}/{questions.length}</span>
            </p>
            {questions.length - answered > 0 && <p className="text-amber-400 text-sm mb-5">{questions.length - answered} question{questions.length - answered > 1 ? "s" : ""} unanswered.</p>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button onClick={() => setConfirm(false)} className="flex-1 rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition">Continue</button>
              <button onClick={() => { done.current = true; finish(true); }} className="flex-1 rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-500 transition">Submit ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
