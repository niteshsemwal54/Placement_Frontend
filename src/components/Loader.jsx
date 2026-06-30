import { useState, useEffect } from "react";
import { getTopic } from "../quizData";

export function Loader({ topicId }) {
  const t = getTopic(topicId);
  const [dot, setDot] = useState(0);
  const msgs = ["Connecting to AI engine", "Crafting your questions", "Shuffling options", "Finalising the paper"];
  const [mi, setMi] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setDot(d => (d + 1) % 4), 380);
    const b = setInterval(() => setMi(m => (m + 1) % msgs.length), 1300);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8">
      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${t?.color} flex items-center justify-center text-5xl shadow-2xl animate-pulse`}>
        {t?.icon}
      </div>
      <div className="text-center">
        <p className="text-white text-xl font-bold mb-2">
          {msgs[mi]}
          <span className="text-gray-500">{".".repeat(dot + 1)}</span>
        </p>
        <p className="text-gray-500 text-sm">{t?.label} · AI-powered questions</p>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${t?.color}`}
            style={{ animation: `bbl 1.2s ease ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
      <style>{`@keyframes bbl{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}
