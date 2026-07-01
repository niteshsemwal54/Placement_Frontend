export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
        <h2 className="text-2xl font-bold text-white">Forgot password</h2>
        <p className="text-sm text-slate-400">This page is a UI-only placeholder. If the backend exposes a password-reset endpoint, integrate it here.</p>
        <input className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white" placeholder="Enter your email" />
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-indigo-600 rounded-full text-white">Send reset link</button>
        </div>
      </div>
    </div>
  );
}
