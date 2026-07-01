import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token, saveSession } = useAuth();

  if (token) {
    navigate("/dashboard", { replace: true });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required");
    if (!password) return setError("Password is required");
    setLoading(true);
    try {
      // Replace with real backend call if available
      await new Promise((r) => setTimeout(r, 700));
      const fakeToken = `tok_${Date.now()}`;
      saveSession(fakeToken, { name: email.split("@")[0], email });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-6 bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h2 className="text-2xl font-bold text-white">Sign in</h2>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" type="email" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-4 py-2 bg-indigo-600 rounded-full text-white font-semibold">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <a className="text-sm text-slate-400 hover:underline" href="/forgot">Forgot?</a>
        </div>
        <p className="text-sm text-slate-400">Don't have an account? <a className="text-indigo-400 hover:underline" href="/register">Register</a></p>
      </form>
    </div>
  );
}
