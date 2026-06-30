import { useEffect, useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader.jsx";
import { ScoreRing } from "../components/ScoreRing.jsx";
import { loadDashboardData, loadStudentProfile } from "../services/api.js";
import { gradeColor, gradeBg } from "../quizData.js";

function MovementBadge({ movement }) {
  const isImproved = movement > 0;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${isImproved ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
      {isImproved ? `↑ +${movement}` : `↓ ${Math.abs(movement)}`}
    </span>
  );
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setStatus("loading");
      const [profileResult, dashboardResult] = await Promise.all([loadStudentProfile(), loadDashboardData()]);
      if (!isMounted) return;
      setProfile(profileResult.profile);
      setDashboard(dashboardResult);
      setStatus("success");
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading" || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-[2rem] bg-slate-900/80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const movement = dashboard.rankMovement.previousRank - dashboard.rankMovement.currentRank;
  const scoreLabel = dashboard.readinessLabel;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader profile={profile} />

        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Placement readiness</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">Placement score</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Use this score to track your competitive readiness across practice sessions.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-4 text-center ring-1 ring-white/10">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Status</p>
                  <p className="mt-2 text-xl font-bold text-white">{scoreLabel}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-5 rounded-[2rem] border border-slate-800/90 bg-slate-950/95 p-6 text-center sm:flex-row sm:items-center sm:justify-between">
                <div className="mx-auto sm:mx-0">
                  <ScoreRing pct={dashboard.readinessScore} size={150} stroke={14} />
                </div>
                <div className="space-y-4 text-left sm:text-left">
                  <div>
                    <p className="text-sm text-slate-400">Current readiness</p>
                    <p className="mt-2 text-4xl font-bold text-white">{dashboard.readinessScore}%</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{dashboard.readinessSubtext}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
                <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Weekly progress</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5">
                    <p className="text-sm text-slate-400">This week</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{dashboard.weeklyProgress.thisWeek}%</p>
                    <p className="mt-2 text-sm text-slate-500">Target performance this week</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5">
                    <p className="text-sm text-slate-400">Last week</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{dashboard.weeklyProgress.lastWeek}%</p>
                    <p className="mt-2 text-sm text-slate-500">Previous week baseline</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-400">
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-300">{dashboard.weeklyProgress.change > 0 ? "+" : ""}{dashboard.weeklyProgress.change}%</span>
                  <span>{dashboard.weeklyProgress.change > 0 ? "Improved from last week" : "Maintained pace"}</span>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Rank movement</p>
                    <h3 className="mt-3 text-3xl font-bold text-white">#{dashboard.rankMovement.currentRank}</h3>
                  </div>
                  <MovementBadge movement={movement} />
                </div>
                <div className="mt-5 flex flex-col gap-3 rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Previous rank</span>
                    <span className="font-semibold text-white">#{dashboard.rankMovement.previousRank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Trend</span>
                    <span className={`font-semibold ${movement > 0 ? "text-emerald-300" : "text-red-300"}`}>{movement > 0 ? "Rising" : "Falling"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Strong areas</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Topics you ace</h3>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {dashboard.strongTopics.map((topic) => (
                  <div key={topic.id} className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{topic.label}</p>
                      <p className="mt-1 text-base font-semibold text-white">Accuracy {topic.accuracy}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">Strong</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Weak areas</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">Topics to improve</h3>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {dashboard.weakTopics.map((topic) => (
                  <div key={topic.id} className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{topic.label}</p>
                      <p className="mt-1 text-base font-semibold text-white">Accuracy {topic.accuracy}</p>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-300">Focus</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Leaderboard</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Top 10 campus performers</h3>
              </div>
              <p className="text-sm text-slate-400">Swipe the list on mobile to see more.</p>
            </div>
            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[720px] space-y-3">
                {dashboard.leaderboard.map((user, index) => (
                  <div key={user.id} className="grid grid-cols-[auto_1fr_auto] gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500/10 text-lg font-bold text-indigo-300">#{index + 1}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.topicId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{user.score}%</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{user.accuracy}% acc</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Study timeline</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Recent activity</h3>
              </div>
              <span className="text-sm text-slate-400">Latest updates first</span>
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-indigo-300" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{activity.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{activity.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs uppercase tracking-[0.22em] text-slate-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
