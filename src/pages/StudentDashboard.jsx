import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../components/DashboardHeader.jsx";
import { DashboardAvatar } from "../components/DashboardAvatar.jsx";
import { DashboardSkeleton } from "../components/DashboardSkeleton.jsx";
import { loadDashboardData, loadStudentProfile } from "../services/api.js";

function formatSubmittedDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  async function loadStats() {
    setStatus("loading");
    setError("");

    try {
      const [profileResult, dashboardResult] = await Promise.all([loadStudentProfile(), loadDashboardData()]);
      setProfile(profileResult.profile);
      setDashboard(dashboardResult);
      setStatus(dashboardResult?.error ? "error" : "success");
      setError(dashboardResult?.error || "");
    } catch {
      setProfile(null);
      setDashboard(null);
      setStatus("error");
      setError("Unable to load dashboard.");
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function runLoad() {
      if (!isMounted) return;
      await loadStats();
    }

    runLoad();
    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-red-500/20 bg-slate-900/90 p-8 text-center shadow-2xl shadow-red-500/10">
            <p className="text-lg font-semibold text-white">Unable to load dashboard.</p>
            <p className="mt-3 text-sm text-slate-400">{error || "Please try again in a moment."}</p>
            <button
              type="button"
              onClick={loadStats}
              className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const user = dashboard?.user || profile;
  const recentTests = Array.isArray(dashboard?.recentTests) ? dashboard.recentTests : [];
  const leaderboard = Array.isArray(dashboard?.leaderboard) ? dashboard.leaderboard : [];
  const placementScore = user?.placementScore ?? 0;
  const testsAttempted = user?.testsAttempted ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader profile={profile} />

        <div className="mt-6 space-y-6">
          <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <DashboardAvatar user={user} size="lg" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">User profile</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{user?.name || "Guest User"}</h2>
                    <p className="mt-1 text-sm text-slate-400">{user?.email || "No email available"}</p>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-400">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Placement score</p>
                  <p className="mt-2 text-3xl font-black text-white">{placementScore}%</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-slate-800/80 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Tests attempted</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{testsAttempted}</p>
                </div>
                <div className="rounded-[1.4rem] border border-slate-800/80 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Performance</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{placementScore}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Performance card</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Placement score</h3>
                </div>
              </div>
              <div className="mt-6 flex flex-col items-center justify-center gap-5 rounded-[1.6rem] border border-slate-800/80 bg-slate-950/80 p-5 sm:flex-row sm:justify-between">
                <div className="flex items-center justify-center">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-slate-900">
                    <div className="absolute inset-0 rounded-full border-[10px] border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-[10px] border-indigo-500" style={{ clipPath: `inset(0 ${100 - placementScore}% 0 0)` }} />
                    <div className="text-center">
                      <p className="text-3xl font-black text-white">{placementScore}</p>
                      <p className="text-sm text-slate-400">%</p>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-400">Tests attempted</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{testsAttempted}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Recent tests</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Latest activity</h3>
              </div>
            </div>

            {recentTests.length === 0 ? (
              <div className="mt-6 rounded-[1.6rem] border border-dashed border-slate-700/80 bg-slate-950/70 p-6 text-center text-sm text-slate-400">
                No tests attempted yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recentTests.slice(0, 5).map((test) => (
                  <button
                    key={test.attemptId}
                    type="button"
                    onClick={() => navigate(`/history/${test.attemptId}`)}
                    className="rounded-[1.6rem] border border-slate-800/80 bg-slate-950/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-slate-900"
                  >
                    <p className="text-sm font-semibold text-white">{test.topic}</p>
                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      <p>Score : {test.score}</p>
                      <p>Accuracy : {test.percentage}%</p>
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">{formatSubmittedDate(test.submittedAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Leaderboard</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Top 3 performers</h3>
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="mt-6 rounded-[1.6rem] border border-dashed border-slate-700/80 bg-slate-950/70 p-6 text-center text-sm text-slate-400">
                No leaderboard data available.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {leaderboard.slice(0, 3).map((entry, index) => (
                  <div key={entry.id} className="rounded-[1.6rem] border border-slate-800/80 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-2xl font-black text-indigo-300">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>
                      <div className="text-sm font-semibold text-slate-400">Rank {index + 1}</div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <DashboardAvatar user={entry} size="md" />
                      <div>
                        <p className="font-semibold text-white">{entry.name}</p>
                        <p className="text-sm text-slate-400">{entry.placementScore}%</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-slate-400">
                      <p>{entry.testsAttempted} Tests</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
