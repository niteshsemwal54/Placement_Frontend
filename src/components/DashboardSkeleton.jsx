export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="h-80 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
              <div className="h-40 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
            <div className="h-56 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
          </div>
          <div className="h-56 animate-pulse rounded-[2rem] border border-slate-800/90 bg-slate-900/80" />
        </div>
      </div>
    </div>
  );
}
