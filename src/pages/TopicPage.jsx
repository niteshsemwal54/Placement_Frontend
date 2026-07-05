import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTopic, fmtTime } from "../quizData.js";
import { loadTopicDetails, loadTopicQuestions } from "../services/api.js";
import { TestComponent } from "../components/TestComponent.jsx";
import { ResultView } from "../components/ResultView.jsx";
import { useAuth } from "../context/AuthContext";
import { submitTestAttempt } from "../services/testAttemptService.js";

const QUESTION_COUNTS = [10, 15, 20, 25];

export default function TopicPage() {
  const { topic: topicParam } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [status, setStatus] = useState("loading");
  const [topicError, setTopicError] = useState("");
  
  const [phase, setPhase] = useState("ready");
  const [questions, setQuestions] = useState([]);
  const [examError, setExamError] = useState("");
  const [result, setResult] = useState(null);
  const [totalSecs, setTotalSecs] = useState(0);
  const [submissionNotice, setSubmissionNotice] = useState("");
  const [submissionState, setSubmissionState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setTopicDetails(null);
    setTopicError("");
    setPhase("ready");
    setQuestions([]);
    setResult(null);

    async function loadTopic() {
      setStatus("loading");
      const result = await loadTopicDetails(topicParam);
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
  }, [topicParam]);

  const [topic, setTopic] = useState(topicParam || "");
  const [questionCount, setQuestionCount] = useState(10);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    setTopic(topicDetails?.label || topicParam || "");
  }, [topicDetails, topicParam]);
  const topicDescription = topicDetails?.description || "Generate a timed test for this topic using backend-backed question generation.";
  const topicMeta = getTopic(topicParam) || {};

  async function startExam() {
    setExamError("");
    setPhase("loading");
    setQuestions([]);
    setResult(null);

    const loadResult = await loadTopicQuestions(topicParam, questionCount);
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
    setTotalSecs(questionCount * 60 + 300);
    setIsTestMode(true);
    setPhase("exam");
  }

  function buildTestAttempt(data) {
    const correct = data.answers.filter((answer, index) => answer === questions[index].answer).length;
    const attempted = data.answers.filter((answer) => answer !== null).length;
    const wrong = attempted - correct;
    const skipped = questions.length - attempted;
    const score = Math.round((correct / questions.length) * 100);

    return {
      topic: topicParam,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skippedQuestions: skipped,
      percentage: score,
      score,
      totalTimeTaken: data.timeTaken,
      submittedAt: new Date().toISOString(),
      answers: questions.map((question, index) => {
        const selectedOption = data.answers[index];
        const selectedLabel = selectedOption === null ? null : String.fromCharCode(65 + selectedOption);
        const correctLabel = String.fromCharCode(65 + question.answer);
        const isCorrect = selectedOption !== null && selectedOption === question.answer;
        const skipped = selectedOption === null;
        const markedForReview = Array.isArray(data.markedForReview) ? data.markedForReview.includes(index) : false;
        const timeTaken = Array.isArray(data.questionTimes) && Number.isFinite(data.questionTimes[index]) ? data.questionTimes[index] : 0;

        return {
          questionId: question._id || question.id,
          selectedOption: selectedLabel,
          correctOption: correctLabel,
          isCorrect,
          skipped,
          markedForReview,
          timeTaken,
          difficulty: question.difficulty,
        };
      }),
    };
  }

  async function handleFinish(data) {
    const correct = data.answers.filter((answer, index) => answer === questions[index].answer).length;
    const attempted = data.answers.filter((answer) => answer !== null).length;
    const wrong = attempted - correct;
    const skipped = questions.length - attempted;
    const score = Math.round((correct / questions.length) * 100);
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const testAttempt = buildTestAttempt(data);
    const submissionPayload = { testAttempt, resultSummary: { correct, wrong, skipped, score, accuracy } };

    setResult({ ...data, score, accuracy, correct, wrong, skipped });
    setSubmissionState(submissionPayload);
    setPhase("result");

    try {
      const response = await submitTestAttempt(testAttempt);
      setSubmissionState({ ...submissionPayload, response });
    } catch (error) {
      console.error("Unable to save topic test history", error);
      setSubmissionNotice("Unable to save your test history.");
    }
  }

  function resetExam() {
    setQuestions([]);
    setResult(null);
    setExamError("");
    setPhase("ready");
      setIsTestMode(false);
      setTotalSecs(0);
  }

  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Topic simulator</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{topic}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{topicDescription}</p>
          </div>
          <Link
            to="/library"
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
        <TestComponent questions={questions} topic={topic} mode="test" onFinish={handleFinish} />
      ) : phase === "loading" ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80" />
          ))}
        </div>
      ) : phase === "result" ? (
        <ResultView
          questions={questions}
          result={result}
          topicId={topicParam}
          playerName={user?.name || user?.email || "Candidate"}
          allScores={[]}
          submissionState={submissionState}
          submissionNotice={submissionNotice}
          onHome={() => { resetExam(); }}
          onProfile={() => {}}
          onLeaderboard={() => {}}
        />
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
                        onClick={() => setQuestionCount(option)}
                        className={`rounded-3xl border px-4 py-4 text-left text-sm transition ${questionCount === option ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600"}`}
                      >
                        <p className="text-lg font-bold">{option}</p>
                        <p className="text-slate-500">{option} questions</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-800/90 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Estimated timer</p>
                  <p className="mt-2 text-3xl font-black text-white">{fmtTime(questionCount * 60 + 300)}</p>
                  <p className="mt-2 text-sm text-slate-500">{questionCount} minutes plus a 5-minute review buffer.</p>
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
                Start {questionCount}-question test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
