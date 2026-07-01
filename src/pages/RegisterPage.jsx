import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token, saveSession } = useAuth();

  if (token) navigate("/dashboard", { replace: true });

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Full name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const fakeToken = `tok_${Date.now()}`;
      saveSession(fakeToken, { name, email });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-6 bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h2 className="text-2xl font-bold text-white">Create account</h2>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div>
          <label className="text-sm text-slate-300">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" type="email" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" type="password" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Confirm password</label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-4 py-2 bg-indigo-600 rounded-full text-white font-semibold">
            {loading ? "Creating…" : "Create account"}
          </button>
        </div>
        <p className="text-sm text-slate-400">Already have an account? <a className="text-indigo-400 hover:underline" href="/login">Sign in</a></p>
      </form>
    </div>
  );
}
