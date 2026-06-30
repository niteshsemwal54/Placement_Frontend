export function DashboardHeader({ profile }) {
  const user = profile || {
    name: "Student",
    currentFocus: "Placement practice",
    progressPercent: 0,
    nextInterview: "Soon",
    tagline: "Prepare for placements with curated practice and progress insights.",
  };

  return (
    <section className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-10">
      <div className="max-w-4xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Placement preparation</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Welcome back, {user.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{user.tagline}</p>
          </div>
          <div className="rounded-4xl bg-slate-900/90 p-5 text-center ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Next milestone</p>
            <p className="mt-3 text-xl font-bold text-white">{user.nextInterview}</p>
            <p className="text-gray-400 text-xs mt-1">Interview or practice checkpoint</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Focus area</p>
            <p className="mt-3 text-white font-semibold">{user.currentFocus}</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Progress</p>
            <p className="mt-3 text-white font-semibold">{user.progressPercent}% complete</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${user.progressPercent}%` }} />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Batch</p>
            <p className="mt-3 text-white font-semibold">{user.batch || "2026"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
