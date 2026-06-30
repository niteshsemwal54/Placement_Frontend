import { questionBank } from "./data/mockStudentData.js";

export const TOPICS = [
  { id: "java",     label: "Java Programming",      icon: "☕", color: "from-orange-500 to-red-500",    ring: "ring-orange-500",  bar: "bg-orange-500",  glow: "shadow-orange-500/20"  },
  { id: "aptitude", label: "Quantitative Aptitude", icon: "📐", color: "from-blue-500 to-indigo-600",   ring: "ring-blue-500",    bar: "bg-blue-500",    glow: "shadow-blue-500/20"    },
  { id: "logical",  label: "Logical Reasoning",     icon: "🧠", color: "from-violet-500 to-purple-600", ring: "ring-violet-500",  bar: "bg-violet-500",  glow: "shadow-violet-500/20"  },
  { id: "verbal",   label: "Verbal Ability",        icon: "📖", color: "from-emerald-500 to-teal-600",  ring: "ring-emerald-500", bar: "bg-emerald-500", glow: "shadow-emerald-500/20" },
  { id: "data",     label: "Data Interpretation",   icon: "📊", color: "from-pink-500 to-rose-600",     ring: "ring-pink-500",    bar: "bg-pink-500",    glow: "shadow-pink-500/20"    },
  { id: "general",  label: "General Knowledge",     icon: "🌍", color: "from-amber-500 to-yellow-500",  ring: "ring-amber-500",   bar: "bg-amber-500",   glow: "shadow-amber-500/20"   },
];

export const QCOUNTS = [
  { value: 10,       label: "10",    desc: "Quick test",  timer: "15 min" },
  { value: 20,       label: "20",    desc: "Standard",    timer: "25 min" },
  { value: 30,       label: "30",    desc: "Full length", timer: "35 min" },
  { value: "random", label: "🎲",   desc: "Random",      timer: "Varies" },
];

export function calcDuration(n) {
  if (n === 10) return 900;
  if (n === 20) return 1500;
  if (n === 30) return 2100;
  return (n + 5) * 60;
}

const pad = n => String(n).padStart(2, "0");
export const fmtTime = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
export const getTopic = id => TOPICS.find(t => t.id === id);
export const gradeOf = pct => pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
export const gradeColor = pct => pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400";
export const gradeBg = pct => pct >= 80 ? "bg-emerald-500/10 border-emerald-500/30" : pct >= 60 ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";
export const gradeEmoji = pct => pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪";
export const gradeLabel = pct => pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Job!" : "Keep Practicing";

export function buildProfile(scores, name) {
  const mine = scores.filter(s => s.name?.toLowerCase().trim() === name?.toLowerCase().trim());
  const byTopic = {};
  TOPICS.forEach(t => { byTopic[t.id] = { attempts: 0, totalQs: 0, correct: 0, wrong: 0, skipped: 0, totalTime: 0, scores: [] }; });
  mine.forEach(s => {
    const b = byTopic[s.topicId];
    if (!b) return;
    b.attempts++;
    b.totalQs += s.total || 0;
    b.correct += s.correct || 0;
    b.wrong += s.wrong || 0;
    b.skipped += s.skipped || 0;
    b.totalTime += s.timeTaken || 0;
    b.scores.push(s.score);
  });
  const totals = { attempts: mine.length, totalQs: 0, correct: 0, wrong: 0, skipped: 0 };
  Object.values(byTopic).forEach(b => { totals.totalQs += b.totalQs; totals.correct += b.correct; totals.wrong += b.wrong; totals.skipped += b.skipped; });
  return { byTopic, totals, history: mine.slice().reverse() };
}

function normalizeQuestion(item) {
  const options = Array.isArray(item.options)
    ? item.options.map((option) => option.text ?? option)
    : [];

  const answerIndex = Array.isArray(item.options)
    ? item.options.findIndex((option) => {
        if (typeof option === "object") {
          return String(option.id).toUpperCase() === String(item.correctAnswer).toUpperCase();
        }
        return false;
      })
    : -1;

  return {
    id: item._id || item.questionId || null,
    type: item.type || "mcq",
    q: item.question || item.q || "",
    options,
    answer: answerIndex >= 0 ? answerIndex : Number.isInteger(item.answer) ? item.answer : 0,
    subtopic: item.subtopic || item.topic || "",
    language: item.language || null,
    code_lines: Array.isArray(item.code_lines) ? item.code_lines : [],
  };
}

export async function fetchQuestions(topicId, count) {
  try {
    const response = await fetch(
      `https://temp-backend-gbya.onrender.com/api/library/questions/random?topic=${encodeURIComponent(topicId)}&count=${encodeURIComponent(count)}`
    );
    const payload = await response.json();
    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
      throw new Error("Invalid response format");
    }
    return payload.data.map(normalizeQuestion);
  } catch (error) {
    const bank = questionBank[topicId] || [];
    if (bank.length === 0) return [];
    return Array.from({ length: count }, (_, index) => ({ ...bank[index % bank.length] }));
  }
}
