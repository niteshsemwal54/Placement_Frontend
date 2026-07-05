import UserProfileCard from "./UserProfileCard.jsx";

export function DashboardHeader({ profile }) {
  const rawStoredUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
  const storedUser = (() => {
    if (!rawStoredUser) return null;
    try {
      return JSON.parse(rawStoredUser);
    } catch {
      return null;
    }
  })();

  const user = {
    ...(storedUser || {}),
    currentFocus: "Placement practice",
    progressPercent: 0,
    nextInterview: "Soon",
    tagline: "Prepare for placements with curated practice and progress insights.",
  };

  const displayName = storedUser?.name?.trim() || "Guest User";

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Placement preparation</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Welcome back, {displayName}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{user.tagline}</p>
          </div>
          <div className="w-full max-w-sm">
            <UserProfileCard user={storedUser || null} />
          </div>
        </div>

      </div>
    </section>
  );
}
