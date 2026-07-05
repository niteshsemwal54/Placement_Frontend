export default function UserProfileCard({ user }) {
  const displayName = (() => {
    if (!user) return "Guest User";
    const name = user.name?.trim();
    if (name) return name;
    const email = user.email?.trim();
    if (email) return email;
    return "Unknown User";
  })();

  const displayEmail = user?.email?.trim() || "";
  const role = user?.role?.trim() ? user.role.trim().toUpperCase() : "MEMBER";
  const profilePicture = user?.profilePicture?.trim();
  const initial = (() => {
    const name = user?.name?.trim();
    if (name) return name.charAt(0).toUpperCase();
    const email = user?.email?.trim();
    if (email) return email.charAt(0).toUpperCase();
    return "G";
  })();
  const isGuest = !user;

  return (
    <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-5 shadow-lg shadow-slate-950/40">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 shadow-lg shadow-indigo-500/20">
          {profilePicture ? (
            <img src={profilePicture} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
              {initial}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-indigo-300">
            {isGuest ? "Signed out" : "Signed in"}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{displayName}</h3>
          {displayEmail ? <p className="mt-1 truncate text-sm text-slate-400">{displayEmail}</p> : null}
          <p className="mt-2 inline-flex rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
            {isGuest ? "Guest" : role}
          </p>
        </div>
      </div>
    </div>
  );
}
