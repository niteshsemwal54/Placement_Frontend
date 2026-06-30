import CreateTest from "../CreateTest.jsx";

export function TestCreator() {
  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Mock test workflow</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Create a test that matches your preparation pace</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Choose a topic, set the question count, and launch a personalized placement mock test without leaving the dashboard.
          </p>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-800/90 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/30">
        <CreateTest embedded />
      </div>
    </div>
  );
}
