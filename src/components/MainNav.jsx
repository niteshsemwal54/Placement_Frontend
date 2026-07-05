import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainNav() {
  const { isAuthenticated, user, logout } = useAuth();

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-950/95 text-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="text-lg font-semibold text-white">Placement hub</Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-slate-300">{user?.name || user?.email}</span>
              <Link
                to="/dashboard"
                className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
