import { useState } from "react";
import { getTopic, gradeColor, gradeBg, gradeEmoji, gradeLabel, gradeOf, fmtTime } from "../quizData";
import { ScoreRing } from "./ScoreRing";
import { MiniRing } from "./MiniRing";

export function ResultView({ questions, result, topicId, playerName, allScores, onHome, onProfile, onLeaderboard }) {
  const t = getTopic(topicId);
  const correct = result.answers.filter((a, i) => a === questions[i].answer).length;
  const attempted = result.answers.filter(a => a !== null).length;
  const wrong = attempted - correct;
  const skipped = questions.length - attempted;
  const score = Math.round((correct / questions.length) * 100);
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const [tab, setTab] = useState("overview");
  const [showExp, setShowExp] = useState({});

  const subtopicMap = {};
  questions.forEach((q, i) => {
    const sub = q.subtopic || "General";
    if (!subtopicMap[sub]) subtopicMap[sub] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    subtopicMap[sub].total++;
    const ua = result.answers[i];
    if (ua === null) subtopicMap[sub].skipped++;
    else if (ua === q.answer) subtopicMap[sub].correct++;
    else subtopicMap[sub].wrong++;
  });

  const subtopics = Object.entries(subtopicMap)
    .map(([name, d]) => ({
      name,
      ...d,
      accuracy: d.total - d.skipped > 0 ? Math.round((d.correct / (d.total - d.skipped)) * 100) : 0,
      pct: Math.round((d.correct / d.total) * 100),
    }))
    .sort((a, b) => a.pct - b.pct);

  const history = allScores.filter(s => s.name?.toLowerCase().trim() === playerName?.toLowerCase().trim() && s.topicId === topicId);
  const bestScore = history.length > 0 ? Math.max(...history.map(s => s.score)) : score;
  const avgScore = history.length > 0 ? Math.round(history.reduce((a, s) => a + s.score, 0) / history.length) : score;

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "subtopic", label: "🗂 Topic Breakdown" },
    { id: "review", label: "📝 Answer Review" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{t?.icon}</span>
          <div>
            <p className="text-white font-bold">{t?.label}</p>
            <p className="text-gray-400 text-xs">{playerName} · {result.timedOut ? "⏱ Time's up — auto submitted" : "Submitted manually"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onProfile} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-all">📈 My Profile</button>
          <button onClick={onLeaderboard} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-all">🏅 Leaderboard</button>
          <button onClick={onHome} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all">← Home</button>
          <button onClick={() => {
            try {
              const win = window.open('', '_blank');
              if (!win) { alert('Unable to open print window (popup blocked)'); return; }
              const head = `
                <head>
                  <title>${playerName} - ${t?.label} Report</title>
                  <style>
                    body { font-family: Arial, Helvetica, sans-serif; color: #111; padding: 20px; }
                    h1 { font-size: 20px; }
                    .q { margin-bottom: 16px; }
                    .opt { margin-left: 16px; }
                    .meta { color: #444; font-size: 12px; }
                  </style>
                </head>`;
              const body = `
                <body>
                  <h1>${playerName} — ${t?.label} Test Report</h1>
                  <p class="meta">Score: ${gradeOf(score)} (${score}%) · Time: ${fmtTime(result.timeTaken)}</p>
                  <hr/>
                  ${questions.map((q, i) => `
                    <div class="q">
                      <h3>Question ${i+1}</h3>
                      <p>${q.q}</p>
                      <ul>
                        ${q.options.map((opt, oi) => `<li class="opt">${String.fromCharCode(65+oi)}. ${opt}</li>`).join('')}
                      </ul>
                      <p class="meta">Your answer: ${result.answers[i] === null ? 'Skipped' : String.fromCharCode(65 + result.answers[i])} · Correct: ${String.fromCharCode(65 + q.answer)}</p>
                      ${q.explanation ? `<p><strong>Explanation:</strong> ${q.explanation}</p>` : ''}
                    </div>
                  `).join('')}
                </body>`;
              win.document.write(`<!doctype html><html>${head}${body}</html>`);
              win.document.close();
              win.focus();
              setTimeout(() => { try { win.print(); } catch (e) { /* ignore */ } }, 300);
            } catch (err) {
              window.print();
            }
          }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-sm font-semibold transition-all">⬇️ Download PDF</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-6 text-center">
          <p className="text-5xl mb-3">{gradeEmoji(score)}</p>
          <p className={`text-3xl font-black mb-1 ${gradeColor(score)}`}>{gradeLabel(score)}</p>
          <p className="text-gray-400 text-sm mb-6">{t?.label} · {questions.length} Questions</p>
          <div className="flex justify-center mb-6">
            <ScoreRing pct={score} size={150} stroke={13} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { val: correct, label: "Correct", bg: "bg-emerald-500/10 border-emerald-500/30", color: "text-emerald-400" },
              { val: wrong, label: "Wrong", bg: "bg-red-500/10 border-red-500/30", color: "text-red-400" },
              { val: skipped, label: "Skipped", bg: "bg-gray-700/40 border-gray-700", color: "text-gray-400" },
              { val: `${accuracy}%`, label: "Accuracy", bg: "bg-blue-500/10 border-blue-500/30", color: "text-blue-400" },
            ].map(({ val, label, bg, color }) => (
              <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
                <p className={`text-3xl font-black ${color}`}>{val}</p>
                <p className="text-gray-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[
            { icon: "⏱", label: "Time taken", val: fmtTime(result.timeTaken) },
            { icon: "⚡", label: "Avg / question", val: `${attempted > 0 ? Math.round(result.timeTaken / attempted) : 0}s` },
            { icon: "🎓", label: "Grade", val: gradeOf(score) },
            { icon: "🏆", label: "Best score", val: `${bestScore}%` },
            { icon: "📈", label: "Your avg", val: `${avgScore}%` },
          ].map(({ icon, label, val }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">{icon}</span>
              <p className="text-white font-black text-base">{val}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 mb-6 bg-gray-900 p-1.5 rounded-xl border border-gray-800 w-fit flex-wrap">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? "bg-indigo-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white font-bold text-base mb-6">Score breakdown</h3>
            <div className="space-y-5">
              {[
                { label: "Correct answers", val: correct, max: questions.length, color: "bg-emerald-500", fmt: v => `${v}/${questions.length}` },
                { label: "Accuracy rate", val: accuracy, max: 100, color: "bg-blue-500", fmt: v => `${v}%` },
                { label: "Completion rate", val: Math.round((attempted / questions.length) * 100), max: 100, color: "bg-violet-500", fmt: v => `${v}%` },
                { label: "Time efficiency", val: Math.round((result.timeTaken / result.totalSecs) * 100), max: 100, color: "bg-amber-500", fmt: v => `${v}%` },
              ].map(({ label, val, max, color, fmt }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white font-bold">{fmt(val)}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${(val / max) * 100}%`, transition: "width 1.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className={`rounded-xl border p-4 ${gradeBg(score)}`}>
                <p className="text-xs text-gray-400 mb-1">Grade</p>
                <p className={`text-2xl font-black ${gradeColor(score)}`}>{gradeOf(score)}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Marks</p>
                <p className="text-2xl font-black text-white">{correct}/{questions.length}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Attempts on {t?.label}</p>
                <p className="text-2xl font-black text-white">{history.length}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "subtopic" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{t?.icon}</span>
                <div>
                  <h3 className="text-white font-bold">Topic-wise breakdown — {t?.label}</h3>
                  <p className="text-gray-400 text-xs">{subtopics.length} subtopics covered in this test</p>
                </div>
              </div>
              <div className="flex rounded-full overflow-hidden h-4 mb-3">
                <div className="bg-emerald-500 transition-all" style={{ width: `${(correct / questions.length) * 100}%` }} title={`Correct: ${correct}`} />
                <div className="bg-red-500 transition-all" style={{ width: `${(wrong / questions.length) * 100}%` }} title={`Wrong: ${wrong}`} />
                <div className="bg-gray-700 transition-all" style={{ width: `${(skipped / questions.length) * 100}%` }} title={`Skipped: ${skipped}`} />
              </div>
              <div className="flex gap-5 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /><span className="text-gray-400">Correct {correct}</span></span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /><span className="text-gray-400">Wrong {wrong}</span></span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-600 inline-block" /><span className="text-gray-400">Skipped {skipped}</span></span>
              </div>
            </div>

            {subtopics.map(sub => {
              const statusColor = sub.pct >= 80 ? "border-emerald-700/40" : sub.pct >= 50 ? "border-amber-700/40" : "border-red-700/40";
              const statusBg = sub.pct >= 80 ? "bg-emerald-900/10" : sub.pct >= 50 ? "bg-amber-900/10" : "bg-red-900/10";
              const barFill = sub.pct >= 80 ? "bg-emerald-500" : sub.pct >= 50 ? "bg-amber-500" : "bg-red-500";
              const tag = sub.pct >= 80
                ? { label: "Strong", cls: "bg-emerald-900/40 text-emerald-400 border-emerald-700/40" }
                : sub.pct >= 50
                ? { label: "Average", cls: "bg-amber-900/40 text-amber-400 border-amber-700/40" }
                : sub.skipped === sub.total
                ? { label: "All skipped", cls: "bg-gray-800 text-gray-400 border-gray-700" }
                : { label: "Needs work", cls: "bg-red-900/40 text-red-400 border-red-700/40" };
              return (
                <div key={sub.name} className={`border rounded-2xl p-5 ${statusColor} ${statusBg}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-bold text-sm">{sub.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{sub.total} question{sub.total > 1 ? "s" : ""} in this test</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tag.cls}`}>{tag.label}</span>
                      <MiniRing pct={sub.pct} size={48} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-emerald-900/30 rounded-xl py-2">
                      <p className="text-emerald-400 font-black text-lg">{sub.correct}</p>
                      <p className="text-gray-500 text-xs">Correct</p>
                    </div>
                    <div className="bg-red-900/30 rounded-xl py-2">
                      <p className="text-red-400 font-black text-lg">{sub.wrong}</p>
                      <p className="text-gray-500 text-xs">Wrong</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl py-2">
                      <p className="text-gray-400 font-black text-lg">{sub.skipped}</p>
                      <p className="text-gray-500 text-xs">Skipped</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${barFill} transition-all`} style={{ width: `${sub.pct}%`, transitionDuration: "1.2s" }} />
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${barFill.replace("bg-", "text-")}`}>{sub.pct}%</span>
                  </div>
                  {sub.pct < 60 && sub.total - sub.skipped > 0 && (
                    <div className="mt-3 px-3 py-2 bg-gray-800/80 border border-gray-700 rounded-xl">
                      <p className="text-xs text-gray-300">
                        💡 {sub.skipped === sub.total
                          ? `You skipped all ${sub.name} questions. Attempt them next time!`
                          : sub.correct === 0
                          ? `You got 0/${sub.total} correct in ${sub.name}. Focus on this subtopic.`
                          : `You solved ${sub.correct}/${sub.total} in ${sub.name}. Practice more to improve accuracy.`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "review" && (
          <div className="space-y-3">
            {questions.map((q, i) => {
              const ua = result.answers[i];
              const ok = ua === q.answer;
              const skip = ua === null;
              const open = showExp[i];
              return (
                <div key={i} className={`rounded-2xl border overflow-hidden ${ok ? "border-emerald-700/40 bg-emerald-900/10" : skip ? "border-gray-700 bg-gray-900" : "border-red-700/40 bg-red-900/10"}`}>
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${ok ? "bg-emerald-600" : skip ? "bg-gray-700 text-gray-400" : "bg-red-600"}`}>
                        {ok ? "✓" : skip ? "–" : "✗"}
                      </span>
                      <div className="flex-1">
                        {q.subtopic && <p className="text-xs text-gray-500 mb-1">📌 {q.subtopic}</p>}
                        <p className="text-white font-semibold text-sm leading-relaxed">{i + 1}. {q.q}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {q.options.map((opt, oi) => (
                        <div
                          key={oi}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs ${
                            oi === q.answer
                              ? "bg-emerald-600/20 border border-emerald-600 text-emerald-300 font-semibold"
                              : oi === ua && !ok
                              ? "bg-red-600/20 border border-red-600 text-red-300"
                              : "bg-gray-800 border border-gray-700 text-gray-500"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${oi === q.answer ? "bg-emerald-600 text-white" : oi === ua && !ok ? "bg-red-600 text-white" : "bg-gray-700 text-gray-500"}`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {oi === q.answer && <span className="text-emerald-400 font-bold ml-auto">✓</span>}
                          {oi === ua && !ok && <span className="text-red-400 ml-auto">✗</span>}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setShowExp(p => ({ ...p, [i]: !p[i] }))} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                      {open ? "▲ Hide explanation" : "▼ Show explanation"}
                    </button>
                    {open && q.explanation && (
                      <div className="mt-2 px-4 py-3 bg-indigo-900/20 border border-indigo-700/40 rounded-xl">
                        <p className="text-indigo-300 text-xs font-semibold mb-0.5">Explanation</p>
                        <p className="text-gray-300 text-xs leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
