import { useState } from "react";
import { buildProfile, TOPICS, getTopic, fmtTime } from "../quizData";
import { ScoreRing } from "./ScoreRing";
import { MiniRing } from "./MiniRing";

export function ProfileView({ scores, playerName, onHome }) {
  const profile = buildProfile(scores, playerName);
  const { byTopic, totals, history } = profile;
  const overallAcc = totals.totalQs - totals.skipped > 0 ? Math.round((totals.correct / (totals.totalQs - totals.skipped)) * 100) : 0;
  const overallScore = totals.totalQs > 0 ? Math.round((totals.correct / totals.totalQs) * 100) : 0;
  const [selTopic, setSelTopic] = useState(null);
  const activeTopic = selTopic ? byTopic[selTopic] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-sm">
            {playerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold">{playerName}</p>
            <p className="text-gray-400 text-xs">{totals.attempts} test{totals.attempts !== 1 ? "s" : ""} completed</p>
          </div>
        </div>
        <button onClick={onHome} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold">← Home</button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {totals.attempts === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-white font-bold text-lg mb-2">No tests yet</p>
            <p className="text-gray-400 text-sm">Take a test and your performance will appear here.</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-bold mb-5 text-base">Overall performance</h3>
              <div className="flex items-center gap-8">
                <ScoreRing pct={overallScore} size={120} stroke={11} />
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Tests taken", val: totals.attempts, color: "text-indigo-400" },
                    { label: "Total correct", val: totals.correct, color: "text-emerald-400" },
                    { label: "Total wrong", val: totals.wrong, color: "text-red-400" },
                    { label: "Accuracy", val: `${overallAcc}%`, color: "text-blue-400" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className={`text-xl font-black ${color}`}>{val}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-bold mb-4 text-base">Topic-wise performance <span className="text-gray-500 font-normal text-sm">— click a topic for details</span></h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TOPICS.map(tp => {
                  const b = byTopic[tp.id];
                  const hasData = b.attempts > 0;
                  const topicScore = b.totalQs > 0 ? Math.round((b.correct / b.totalQs) * 100) : 0;
                  const isActive = selTopic === tp.id;
                  return (
                    <button
                      key={tp.id}
                      onClick={() => setSelTopic(isActive ? null : tp.id)}
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        isActive
                          ? "border-indigo-500 bg-indigo-900/20 shadow-lg shadow-indigo-500/10"
                          : hasData
                          ? "border-gray-700 bg-gray-900 hover:border-gray-600"
                          : "border-gray-800 bg-gray-900/50 opacity-50 cursor-default"
                      }`}
                      disabled={!hasData}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl">{tp.icon}</span>
                        {hasData ? <MiniRing pct={topicScore} size={44} /> : <span className="text-gray-600 text-xs">No attempts</span>}
                      </div>
                      <p className="text-white font-bold text-sm leading-snug mb-1">{tp.label}</p>
                      {hasData ? (
                        <>
                          <p className="text-gray-400 text-xs">{b.attempts} attempt{b.attempts !== 1 ? "s" : ""} · {b.correct}/{b.totalQs} correct</p>
                          <div className="mt-3 flex gap-2">
                            <div className="flex-1 bg-gray-800 rounded h-1.5 overflow-hidden">
                              <div className={`h-1.5 ${tp.bar}`} style={{ width: `${topicScore}%` }} />
                            </div>
                          </div>
                          <div className="mt-2 flex gap-3 text-xs">
                            <span className="text-emerald-400">✓ {b.correct}</span>
                            <span className="text-red-400">✗ {b.wrong}</span>
                            <span className="text-gray-500">– {b.skipped}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 text-xs">Take a test to see data</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selTopic && activeTopic && (
              <div className="bg-gray-900 border border-indigo-700/40 rounded-2xl p-6 mb-6">
                {(() => {
                  const tp = getTopic(selTopic);
                  const b = activeTopic;
                  const ts = Math.round((b.correct / b.totalQs) * 100);
                  const ta = b.totalQs - b.skipped > 0 ? Math.round((b.correct / (b.totalQs - b.skipped)) * 100) : 0;
                  const best = b.scores.length > 0 ? Math.max(...b.scores) : 0;
                  const avg = b.scores.length > 0 ? Math.round(b.scores.reduce((a, v) => a + v, 0) / b.scores.length) : 0;
                  const weak = ts < 60 || ta < 60;
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-3xl">{tp?.icon}</span>
                        <div>
                          <h4 className="text-white font-bold">{tp?.label} — Detailed view</h4>
                          <p className="text-gray-400 text-xs">{b.attempts} attempt{b.attempts !== 1 ? "s" : ""} · {b.totalQs} questions total</p>
                        </div>
                        <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full ${weak ? "bg-red-900/40 text-red-400 border border-red-700/40" : "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40"}`}>
                          {weak ? "Needs improvement" : "Good performance"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                        {[
                          { label: "Best score", val: `${best}%`, color: "text-emerald-400" },
                          { label: "Avg score", val: `${avg}%`, color: "text-blue-400" },
                          { label: "Accuracy", val: `${ta}%`, color: "text-violet-400" },
                          { label: "Skipped", val: b.skipped, color: "text-gray-400" },
                        ].map(({ label, val, color }) => (
                          <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                            <p className={`text-xl font-black ${color}`}>{val}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Question distribution across all attempts</span>
                          <span>{b.totalQs} total</span>
                        </div>
                        <div className="flex rounded-full overflow-hidden h-5">
                          <div className="bg-emerald-500 flex items-center justify-center text-xs font-bold text-white transition-all" style={{ width: `${(b.correct / b.totalQs) * 100}%` }}>{b.correct > 0 && `${b.correct}`}</div>
                          <div className="bg-red-500 flex items-center justify-center text-xs font-bold text-white transition-all" style={{ width: `${(b.wrong / b.totalQs) * 100}%` }}>{b.wrong > 0 && `${b.wrong}`}</div>
                          <div className="bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 transition-all" style={{ width: `${(b.skipped / b.totalQs) * 100}%` }}>{b.skipped > 0 && `${b.skipped}`}</div>
                        </div>
                        <div className="flex gap-5 text-xs mt-2">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /><span className="text-gray-400">Correct {b.correct}</span></span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /><span className="text-gray-400">Wrong {b.wrong}</span></span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" /><span className="text-gray-400">Skipped {b.skipped}</span></span>
                        </div>
                      </div>
                      {b.scores.length > 1 && (
                        <div className="mt-5">
                          <p className="text-gray-400 text-xs mb-2">Score history ({b.scores.length} attempts)</p>
                          <div className="flex items-end gap-2 h-16">
                            {b.scores.slice(-12).map((s, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className={`w-full rounded-t-sm ${s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-red-500"} transition-all`} style={{ height: `${s}%` }} />
                                <span className="text-gray-600 text-xs">{s}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {weak && (
                        <div className="mt-5 px-4 py-3 bg-amber-900/20 border border-amber-700/40 rounded-xl">
                          <p className="text-amber-300 text-xs font-semibold mb-1">💡 Recommendation</p>
                          <p className="text-gray-300 text-xs">
                            {ta < 50
                              ? `Your accuracy in ${tp?.label} is ${ta}% — you're attempting questions but getting many wrong. Review fundamentals before the next test.`
                              : b.skipped > b.correct
                              ? `You're skipping more questions (${b.skipped}) than you're getting right (${b.correct}) in ${tp?.label}. Work on speed and confidence.`
                              : `Your score in ${tp?.label} is ${ts}%. Consistent practice will push it above 80%.`}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-white font-bold text-sm">Test history</h3>
              </div>
              {history.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No tests yet.</div>
              ) : history.map(s => {
                const tp = getTopic(s.topicId);
                return (
                  <div key={s.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-all">
                    <span className="text-2xl">{tp?.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{tp?.label}</p>
                      <p className="text-gray-500 text-xs">{s.date} · {s.total} Qs · {fmtTime(s.timeTaken)}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-black ${gradeColor(s.score)}`}>{s.score}%</p>
                      <p className="text-gray-600 text-xs">score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-400 text-sm font-black">{s.accuracy}%</p>
                      <p className="text-gray-600 text-xs">accuracy</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${gradeBg(s.score)} ${gradeColor(s.score)} border`}>{gradeOf(s.score)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
