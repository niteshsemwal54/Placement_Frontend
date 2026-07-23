import { useEffect, useState } from "react";
import CreateTest from "../CreateTest.jsx";
import { loadScheduledTests } from "../services/api.js";
import { showToast } from "../utils/toast.js";

export default function TestPage() {
  const [scheduledTests, setScheduledTests] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadSchedule() {
      setStatus("loading");
      showToast("The exam schedule may take a moment to load because the backend is running on a free tier.");
      const result = await loadScheduledTests();
      if (!isMounted) return;
      setScheduledTests(result.scheduledTests);
      setStatus("success");
    }

    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Exam schedule</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Available scheduled tests</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Keep track of upcoming test windows and start your practice session with the right topic and timing.
          </p>
        </div>
      </section>

      <section className="space-y-6 w-full max-w-7xl mx-auto px-4">
        <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/95 p-6 shadow-2xl shadow-indigo-500/10 w-full">
          <div className="mb-6 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Create test</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Build your custom timed exam</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Create a full-screen mock test with fresh questions from the backend. The interface is optimized for desktop and mobile.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-800/90 bg-slate-950/80 p-5 w-full shadow-inner shadow-slate-950/20">
            <CreateTest embedded />
          </div>
        </div>
      </section>

      <section className="space-y-4 w-full max-w-7xl mx-auto px-4">
        <div className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Exam schedule</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Available scheduled tests</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              Keep track of upcoming test windows and start your practice session with the right topic and timing.
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100">
          Scheduled test data is currently being served from the app and may take a moment to appear while the free-tier backend wakes up.
        </div>

        <div className="grid gap-6">
          {status === "loading"
            ? Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80" />
              ))
            : scheduledTests.map((test) => (
                <article key={test.id} className="rounded-[1.75rem] border border-slate-800/90 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-indigo-300">{test.type}</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{test.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{test.topicLabel}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-right text-sm text-slate-300 ring-1 ring-slate-700/80">
                      <p className="font-semibold text-white">{test.date}</p>
                      <p className="mt-1 text-slate-400">{test.time}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-400">
                    <span className="rounded-full bg-slate-950/80 px-3 py-2">Duration: {test.duration}</span>
                    <span className="rounded-full bg-slate-950/80 px-3 py-2">Questions: {test.questions}</span>
                  </div>
                </article>
              ))}
        </div>
      </section>
    </div>
  );
}
