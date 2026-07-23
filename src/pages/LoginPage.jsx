import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginRequest, googleLogin as googleLoginRequest } from "../services/authService.js";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.55Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.91A5.99 5.99 0 0 1 6.41 10.1V7.52H3.07a10 10 0 0 0 0 12.78l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 6.04c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.93 5.52l3.34 2.59C7.2 7.8 9.4 6.04 12 6.04Z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const navigate = useNavigate();
  const { token, login } = useAuth();

useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setGoogleReady(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required");
    if (!password) return setError("Password is required");
    setLoading(true);
    try {
      const { token: sessionToken, user } = await loginRequest({ email, password });
      login(sessionToken, user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      const idToken = await getGoogleIdToken();
      if (!idToken) throw new Error("Google authentication failed");
      const { token: sessionToken, user } = await googleLoginRequest(idToken);
      login(sessionToken, user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  function getGoogleIdToken() {
    return new Promise((resolve, reject) => {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!googleReady || !googleClientId) {
        reject(new Error("Google login is not configured yet."));
        return;
      }

      if (!window.google?.accounts?.id) {
        reject(new Error("Google Identity Services is unavailable."));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response?.credential) {
            resolve(response.credential);
          } else {
            reject(new Error("Google did not return a credential."));
          }
        },
      });

      window.google.accounts.id.prompt();
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-md space-y-6 rounded-[2rem] border border-slate-800/90 bg-slate-900/95 p-7 shadow-2xl shadow-indigo-500/10 sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-indigo-300">Welcome back</p>
          <h2 className="text-3xl font-bold text-white">Sign in</h2>
          <p className="text-sm leading-6 text-slate-400">Access your dashboard with your email or Google account.</p>
        </div>
        {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            disabled={loading}
            className="w-full rounded-full bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          {/* <a className="text-sm text-slate-400 transition hover:text-slate-200 hover:underline" href="/forgot">Forgot password?</a>
        */}
        </div>
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-700" />
          <span className="mx-3 shrink text-xs uppercase tracking-[0.32em] text-slate-500">Or continue with</span>
          <div className="flex-grow border-t border-slate-700" />
        </div>
        <button
          type="button"
          disabled={loading || !googleReady}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{loading ? "Please wait…" : "Continue with Google"}</span>
        </button>
        <p className="text-sm text-slate-400">
          Don't have an account? <Link className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
