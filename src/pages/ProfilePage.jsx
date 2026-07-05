import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
          <p className="text-sm text-slate-400">No profile information is available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Full name</p>
            <p className="mt-3 text-lg font-semibold text-white">{user.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Email</p>
            <p className="mt-3 text-lg font-semibold text-white">{user.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Role</p>
            <p className="mt-3 text-lg font-semibold text-white">{user.role || "USER"}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">ID</p>
            <p className="mt-3 text-lg font-semibold text-white">{user.id || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
