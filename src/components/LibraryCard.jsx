export function LibraryCard({ topic, count }) {
  const initials = topic
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group rounded-[1.75rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-500/10 text-xl font-bold text-indigo-300 ring-1 ring-indigo-500/15">
          {initials}
        </div>
        <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {count} qs
        </span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{topic}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        A focused set of questions to help you deepen your understanding of <span className="text-indigo-300">{topic}</span> concepts.
      </p>
    </article>
  );
}
