import { ExamView } from "./ExamView";

export function TestComponent({ questions, topic, mode = "test", onFinish }) {
  const totalSecs = questions.length ? (questions.length + 5) * 60 : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-4 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">{mode === "test" ? "Timed Test" : "Practice Session"}</p>
            <h2 className="mt-2 text-xl font-bold text-white">{topic || "Selected topic"}</h2>
          </div>
          <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700/90">
            {questions.length} questions · {mode === "test" ? "Test mode" : "Practice mode"}
          </div>
        </div>
      </div>

      {questions.length > 0 ? (
        <ExamView questions={questions} topicId={topic} totalSecs={totalSecs} onFinish={onFinish} />
      ) : (
        <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-8 text-center text-slate-400">
          <p className="text-sm">Load questions to begin the exam.</p>
        </div>
      )}
    </div>
  );
}
