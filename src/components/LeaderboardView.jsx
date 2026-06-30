import { useState } from "react";
import { TOPICS, getTopic, fmtTime, gradeBg, gradeColor } from "../quizData";

export function LeaderboardView({ scores, onHome }) {
  const [filter, setFilter] = useState("all");
  const sorted = [...scores]
    .filter(s => filter === "all" || s.topicId === filter)
    .sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">🏆 Leaderboard</h1>
          <p className="text-gray-400 text-xs">{scores.length} attempts</p>
        </div>
        <button onClick={onHome} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold">← Home</button>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>All topics</button>
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === t.id ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>{t.icon} {t.label}</button>
          ))}
        </div>
        {sorted.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[sorted[1], sorted[0], sorted[2]].map((s, pi) => {
              if (!s) return <div key={pi} />;
              const rank = pi === 1 ? 0 : pi === 0 ? 1 : 2;
              const tp = getTopic(s.topicId);
              return (
                <div key={s.id} className={`bg-gray-900 border rounded-2xl p-5 text-center ${pi === 1 ? "border-amber-500/50 bg-amber-900/5 -mt-4" : "border-gray-700 mt-4"}`}>
                  <p className="text-4xl mb-2">{medals[rank]}</p>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tp?.color} mx-auto flex items-center justify-center text-white font-black text-sm mb-2`}>
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-white font-bold text-sm">{s.name}</p>
                  <p className={`text-2xl font-black mt-1 ${gradeColor(s.score)}`}>{s.score}%</p>
                  <p className="text-gray-500 text-xs">{tp?.label}</p>
                </div>
              );
            })}
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-800 px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Topic</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-2 text-center">Accuracy</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
          {sorted.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No scores yet.</div>
          ) : sorted.map((s, i) => {
            const tp = getTopic(s.topicId);
            return (
              <div key={s.id} className={`grid grid-cols-12 px-5 py-3.5 items-center border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-all ${i < 3 ? "bg-amber-900/5" : ""}`}>
                <div className="col-span-1">{i < 3 ? <span className="text-lg">{medals[i]}</span> : <span className="text-gray-500 text-sm font-bold">#{i + 1}</span>}</div>
                <div className="col-span-3 flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${tp?.color || "from-gray-600 to-gray-700"} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-semibold truncate">{s.name}</span>
                </div>
                <div className="col-span-3"><span className="text-gray-400 text-xs">{tp?.icon} {tp?.label}</span></div>
                <div className="col-span-2 text-center"><span className={`text-sm font-black px-2 py-1 rounded-lg ${gradeBg(s.score)} ${gradeColor(s.score)} border`}>{s.score}%</span></div>
                <div className="col-span-2 text-center"><span className="text-blue-400 text-sm font-bold">{s.accuracy}%</span></div>
                <div className="col-span-1 text-right"><span className="text-gray-500 text-xs font-mono">{fmtTime(s.timeTaken)}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
