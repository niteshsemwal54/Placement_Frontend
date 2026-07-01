import { ExamView } from "./ExamView";

export function TestComponent({ questions, topic, mode = "test", onFinish }) {
  const totalSecs = questions.length ? (questions.length + 5) * 60 : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">🧪</div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-indigo-200">{mode === "test" ? "Timed Test" : "Practice Session"}</p>
                <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-white leading-tight">{topic || "Selected topic"}</h2>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="rounded-full bg-slate-800/60 px-3 py-2 text-sm text-slate-200">{questions.length} questions</div>
              <div className="rounded-full bg-white/5 px-3 py-2 text-sm text-white/90">{mode === "test" ? "Test mode" : "Practice mode"}</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-950/95 px-4 py-3 text-sm text-slate-300 sm:hidden flex items-center justify-between">
          <div>{questions.length} questions · {mode === "test" ? "Test mode" : "Practice mode"}</div>
          <div className="text-slate-400">Good luck 👊</div>
        </div>
      </div>

      {questions.length > 0 ? (
        <ExamView questions={questions} topicId={topic} totalSecs={totalSecs} onFinish={onFinish} />
      ) : (
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/90 p-8 text-center text-slate-400">
          <p className="text-sm">Load questions to begin the exam.</p>
        </div>
      )}
    </div>
  );
}
