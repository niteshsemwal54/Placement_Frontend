import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
        <h2 className="text-3xl font-bold text-white">404 — Not found</h2>
        <p className="text-sm text-slate-400">We couldn't find that page.</p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 rounded-full text-white">Go home</Link>
      </div>
    </div>
  );
}
