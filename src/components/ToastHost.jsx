import { useEffect, useState } from "react";

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handleToast(event) {
      const { message, duration = 4000 } = event.detail || {};
      const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      setToasts((prev) => [...prev, { id, message }]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }

    window.addEventListener("app:toast", handleToast);
    return () => window.removeEventListener("app:toast", handleToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1000] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-indigo-500/20 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-slate-950/40 backdrop-blur"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
