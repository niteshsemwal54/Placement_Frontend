import { useState, useEffect } from "react";
import { Loader, ExamView, ResultView, ProfileView, LeaderboardView } from "./components";
import { TOPICS, QCOUNTS, calcDuration, fetchQuestions } from "./quizData";

function useLS(key, init) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {
      console.log(e);
    }
  }, [key, v]);

  return [v, setV];
}

export default function CreateTest({ embedded = false }) {
  const [scores, setScores] = useLS("iqscores_v3", []);
  const [playerName, setPlayerName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [selTopic, setSelTopic] = useState(null);
  const [selCount, setSelCount] = useState(null);
  const [phase, setPhase] = useState("home");
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loadErr, setLoadErr] = useState("");
  const [actualCount, setActualCount] = useState(10);

  async function startTest() {
    if (!playerName.trim()) {
      setNameErr(true);
      return;
    }
    if (!selTopic || !selCount) return;
    setNameErr(false);
    setLoadErr("");

    const n = selCount === "random" ? [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)] : selCount;
    setActualCount(n);
    setPhase("loading");

    try {
      const qs = await fetchQuestions(selTopic, n);
      if (!Array.isArray(qs) || qs.length === 0) throw new Error("empty");
      setQuestions(qs);
      setPhase("exam");
    } catch {
      setLoadErr("Failed to fetch questions. Check connection and try again.");
      setPhase("home");
    }
  }

  function handleFinish(res) {
    const correct = res.answers.filter((a, i) => a === questions[i].answer).length;
    const attempted = res.answers.filter((a) => a !== null).length;
    const wrong = attempted - correct;
    const skipped = questions.length - attempted;
    const score = Math.round((correct / questions.length) * 100);
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const entry = {
      id: Date.now(),
      name: playerName,
      topicId: selTopic,
      score,
      accuracy,
      correct,
      wrong,
      skipped,
      total: questions.length,
      timeTaken: res.timeTaken,
      date: new Date().toLocaleDateString("en-IN"),
      answers: res.answers,
    };
    setScores((prev) => [...prev, entry]);
    setResult({ ...res, score, accuracy, correct, wrong, skipped });
    setPhase("result");
  }

  if (phase === "loading") return <Loader topicId={selTopic} />;
  if (phase === "exam") return <ExamView questions={questions} topicId={selTopic} totalSecs={calcDuration(actualCount)} onFinish={handleFinish} />;
  if (phase === "result") return <ResultView questions={questions} result={result} topicId={selTopic} playerName={playerName} allScores={scores} onHome={() => setPhase("home")} onProfile={() => setPhase("profile")} onLeaderboard={() => setPhase("leaderboard")} />;
  if (phase === "profile") return <ProfileView scores={scores} playerName={playerName} onHome={() => setPhase("home")} />;
  if (phase === "leaderboard") return <LeaderboardView scores={scores} onHome={() => setPhase("home")} />;

  const canStart = playerName.trim() && selTopic && selCount;
  const wrapperClass = embedded
    ? "rounded-4xl border border-slate-800/90 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/30 w-full"
    : "min-h-screen w-full bg-gray-950 text-white";

  return (
    <div className={wrapperClass} style={embedded ? undefined : { fontFamily: "'Inter',sans-serif" }}>
      {!embedded && (
        <>
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
          </div>
          <header className="relative border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/30">Q</div>
              <div>
                <h1 className="font-black text-xl leading-none">AptitudeIQ</h1>
                <p className="text-gray-500 text-xs">AI-Powered Test Platform</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              {playerName.trim() && (
                <button onClick={() => setPhase("profile")} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-2xl text-sm font-semibold transition-all">
                  📈 My Profile
                </button>
              )}
              <button onClick={() => setPhase("leaderboard")} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-2xl text-sm font-semibold transition-all">
                🏅 Leaderboard
              </button>
            </div>
          </header>
        </>
      )}

      <main className={embedded ? "p-0 w-full" : "relative w-full max-w-full mx-auto px-4 py-10 lg:px-8"}>
        {embedded && (
          <div className="mb-6">
            <div className="rounded-3xl bg-slate-950/70 p-5 shadow-sm shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Create test</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Launch your placement mock test</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Select a topic, choose your question count, and get ready for a smooth practice session.</p>
            </div>
          </div>
        )}

        {!embedded && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-700/50 rounded-full text-indigo-300 text-xs font-semibold mb-5">
              ✦ AI generates fresh questions every time
            </div>
            <h2 className="text-4xl font-black mb-3 leading-tight">
              Build your exam
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400">in 3 steps</span>
            </h2>
            <p className="text-gray-400 text-sm">Choose topic & count — we track every answer and show you exactly where to improve.</p>
          </div>
        )}

        {loadErr && <div className="mb-5 bg-red-900/30 border border-red-700/50 rounded-2xl px-5 py-4 text-red-300 text-sm">{loadErr}</div>}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black">1</div>
            <p className="font-bold text-white">Your name</p>
          </div>
          <input
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setNameErr(false);
            }}
            placeholder="Enter your full name"
            className={`w-full bg-gray-900 border rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all ${nameErr ? "border-red-500" : "border-gray-700"}`}
          />
          {nameErr && <p className="text-red-400 text-xs mt-2">Enter your name to continue.</p>}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${playerName.trim() ? "bg-indigo-600" : "bg-gray-700 text-gray-500"}`}>2</div>
            <p className={`font-bold ${playerName.trim() ? "text-white" : "text-gray-600"}`}>Choose topic</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${!playerName.trim() ? "opacity-40 pointer-events-none" : ""}`}>
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelTopic(t.id)}
                className={`relative min-h-[150px] p-5 rounded-3xl border text-left transition-all ${selTopic === t.id ? "border-indigo-500 bg-indigo-900/30 shadow-lg shadow-indigo-500/20" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}
              >
                {selTopic === t.id && (
                  <span className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-black">✓</span>
                )}
                <span className="text-4xl block mb-3">{t.icon}</span>
                <p className="text-white font-semibold text-base leading-snug">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${selTopic ? "bg-indigo-600" : "bg-gray-700 text-gray-500"}`}>3</div>
            <p className={`font-bold ${selTopic ? "text-white" : "text-gray-600"}`}>Number of questions</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${!selTopic ? "opacity-40 pointer-events-none" : ""}`}>
            {QCOUNTS.map(({ value, label, desc, timer }) => {
              const dur = value === "random" ? "Varies" : "";
              return (
                <button
                  key={value}
                  onClick={() => setSelCount(value)}
                  className={`min-h-[140px] p-5 rounded-3xl border text-left transition-all ${selCount === value ? "border-indigo-500 bg-indigo-900/30 shadow-lg shadow-indigo-500/20" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}
                >
                  <p className="text-3xl font-black mb-2">{label}</p>
                  <p className="text-gray-400 text-sm">{desc}</p>
                  <p className="text-gray-500 text-sm mt-3">{dur} {timer}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setSelTopic(null);
              setSelCount(null);
            }}
            className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={startTest}
            disabled={!canStart}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${canStart ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
          >
            Start test
          </button>
        </div>
      </main>
    </div>
  );
}
