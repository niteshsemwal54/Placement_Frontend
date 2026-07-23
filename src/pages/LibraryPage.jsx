import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LibraryCard } from "../components/LibraryCard.jsx";
import { loadLibraryTopics } from "../services/api.js";
import { showToast } from "../utils/toast.js";

export default function LibraryPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadTopics() {
      setStatus("loading");
      setError("");
      showToast("Topics may take a moment to load because the free-tier server is waking up.");
      const result = await loadLibraryTopics();
      if (!isMounted) return;
      if (result.error) {
        setError(result.error);
        setStatus("error");
        return;
      }
      setTopics(result.topics);
      setStatus("success");
    }

    loadTopics();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleSelect(topic) {
    setSelectedTopic(topic.label);
    setSelectedSubject(topic.subject || null);
    navigate(topic.id);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Learning library</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Choose a topic to begin</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Browse topics created for placement preparation and launch focused practice directly from the library.
          </p>
        </div>
        {selectedTopic ? (
          <div className="mt-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
            Selected topic: <span className="font-semibold text-white">{selectedTopic}</span>
            {selectedSubject ? <span className="text-slate-300"> — {selectedSubject}</span> : null}
          </div>
        ) : null}
      </section>

      {error ? (
        <div className="rounded-[1.75rem] border border-red-500/20 bg-red-500/10 p-6 text-center text-red-200">
          <p className="font-semibold">Unable to load library topics.</p>
          <p className="mt-2 text-sm text-red-100">{error}</p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {status === "loading"
          ? Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80" />
            ))
          : topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleSelect(topic)}
                className="block text-left"
              >
                <LibraryCard topic={topic.label} count={topic.count} />
              </button>
            ))}
      </section>
    </div>
  );
}
