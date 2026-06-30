import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTopic, fmtTime } from "../quizData.js";
import { loadTopicDetails, loadTopicQuestions } from "../services/api.js";
import { ExamView } from "../components/ExamView.jsx";

const QUESTION_COUNTS = [10, 15, 20, 25];

export default function TopicPage() {
  const { topic } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [status, setStatus] = useState("loading");
  const [topicError, setTopicError] = useState("");
  const [count, setCount] = useState(10);
  const [phase, setPhase] = useState("ready");
  const [questions, setQuestions] = useState([]);
  const [examError, setExamError] = useState("");
  const [result, setResult] = useState(null);
  const [totalSecs, setTotalSecs] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setTopicDetails(null);
    setTopicError("");
    setPhase("ready");
    setQuestions([]);
    setResult(null);

    async function loadTopic() {
      setStatus("loading");
      const result = await loadTopicDetails(topic);
      if (!isMounted) return;

      if (result.error) {
        setTopicError(result.error);
        setStatus("error");
        return;
      }

      setTopicDetails(result.topic);
      setStatus("success");
    }

    loadTopic();
    return () => {
      isMounted = false;
    };
  }, [topic]);

  const selectedTopic = topicDetails?.label || topic;
  const topicDescription = topicDetails?.description || "Generate a timed test for this topic using backend-backed question generation.";
  const topicMeta = getTopic(topic) || {};

  async function startExam() {
    setExamError("");
    setPhase("loading");
    setQuestions([]);
    setResult(null);

    const loadResult = await loadTopicQuestions(topic, count);
    if (loadResult.error) {
      setExamError(loadResult.error);
      setPhase("ready");
      return;
    }

    if (!loadResult.questions.length) {
      setExamError("No questions were returned for this topic. Try a different count or select another topic.");
      setPhase("ready");
      return;
    }

    setQuestions(loadResult.questions);
    setTotalSecs(count * 60 + 300);
    setPhase("exam");
  }

  function handleFinish(data) {
    setResult(data);
    setPhase("result");
  }

  function resetExam() {
    setQuestions([]);
    setResult(null);
    setExamError("");
    setPhase("ready");
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Topic simulator</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{selectedTopic}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{topicDescription}</p>
          </div>
          <Link
            to="/student/library"
            className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            ← Back to library
          </Link>
        </div>
      </section>

      {status === "loading" ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80" />
          ))}
        </div>
      ) : status === "error" ? (
        <div className="rounded-[1.75rem] border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
          <p className="text-lg font-semibold">Unable to load topic details.</p>
          <p className="mt-2 text-sm">{topicError || "Topic could not be found."}</p>
        </div>
      ) : phase === "exam" ? (
        <ExamView questions={questions} topicId={topic} totalSecs={totalSecs} onFinish={handleFinish} />
      ) : phase === "loading" ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80" />
          ))}
        </div>
      ) : phase === "result" ? (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-indigo-300">Test complete</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Exam results for {selectedTopic}</h3>
                <p className="mt-2 text-sm text-slate-400">You had {questions.length} questions and {result.timedOut ? "time expired" : "submitted manually"}.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-center text-slate-200">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Time</p>
                <p className="mt-2 text-2xl font-black text-white">{fmtTime(result.timeTaken)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { label: "Answered", value: result.answers.filter((a) => a !== null).length, color: "text-emerald-400" },
              { label: "Skipped", value: result.answers.filter((a) => a === null).length, color: "text-slate-400" },
              {
                label: "Correct",
                value: result.answers.filter((a, i) => a === questions[i].answer).length,
                color: "text-cyan-400",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-slate-800/90 bg-slate-900/90 p-6 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                <p className={`mt-3 text-4xl font-black ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={resetExam}
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Retake this topic
            </button>
            <Link
              to="/student/library"
              className="rounded-full border border-slate-700/80 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900 transition"
            >
              Back to library
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {examError ? (
            <div className="rounded-[1.75rem] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              <p className="font-semibold">Unable to start the test.</p>
              <p className="mt-2 text-sm text-red-100">{examError}</p>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.32em] text-indigo-300">Ready to launch</p>
              <h3 className="mt-3 text-2xl font-bold text-white">Build your timed topic test</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">Choose the number of questions and start a backend-generated exam for this topic.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 mb-3">Question count</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {QUESTION_COUNTS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setCount(option)}
                        className={`rounded-3xl border px-4 py-4 text-left text-sm transition ${count === option ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600"}`}
                      >
                        <p className="text-lg font-bold">{option}</p>
                        <p className="text-slate-500">{option} questions</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-800/90 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Estimated timer</p>
                  <p className="mt-2 text-3xl font-black text-white">{fmtTime(count * 60 + 300)}</p>
                  <p className="mt-2 text-sm text-slate-500">{count} minutes plus a 5-minute review buffer.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.32em] text-indigo-300">What to expect</p>
              <ul className="mt-5 space-y-3 text-slate-300 text-sm">
                <li className="rounded-3xl border border-slate-800/90 bg-slate-950/80 p-4">Fresh questions delivered from the backend API.</li>
                <li className="rounded-3xl border border-slate-800/90 bg-slate-950/80 p-4">Timed mode with auto-submit when time expires.</li>
                <li className="rounded-3xl border border-slate-800/90 bg-slate-950/80 p-4">Review your answers and retry the same topic instantly.</li>
              </ul>
              <button
                type="button"
                onClick={startExam}
                className="mt-6 w-full rounded-full bg-indigo-600 px-6 py-4 text-sm font-semibold text-white hover:bg-indigo-500 transition"
              >
                Start {count}-question test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
