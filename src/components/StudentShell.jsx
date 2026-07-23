import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNav from "./BottomNav";

const navItems = [
  { to: "dashboard", label: "Dashboard", icon: "🏠" },
  { to: "library", label: "Topics", icon: "📚" },
  { to: "test", label: "Test", icon: "🧪" },
 // { to: "results", label: "Results", icon: "📊" },
  { to: "profile", label: "Profile", icon: "👤" },
];

export function StudentShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">{/* pb for bottom nav */}
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[1.25rem] border border-slate-800/90 bg-slate-900/90 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Placement hub</p>
              <h1 className="mt-2 text-xl font-bold text-white sm:text-2xl">Student dashboard</h1>
            </div>

            <div className="hidden sm:flex gap-3 items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-slate-950/80 text-slate-300 hover:bg-slate-900/90 hover:text-white"
                    }`
                  }
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}

              {/* <NavLink to="/profile" className="flex items-center gap-2 rounded-full px-3 py-2 bg-slate-900/80 hover:bg-slate-900">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black">JD</span>
                <span className="hidden md:inline">Profile</span>
              </NavLink> */}

              <button onClick={handleLogout} title="Logout" className="rounded-full p-2 bg-red-600 hover:bg-red-500 text-white">
                🔒
              </button>
            </div>

            <div className="sm:hidden">
              {/* small-screen quick actions: Topics and Test */}
              <div className="flex gap-2">
                <NavLink to="/library" className="rounded-full px-3 py-2 bg-slate-950/80 text-sm">Topics</NavLink>
                <NavLink to="/test" className="rounded-full px-3 py-2 bg-indigo-600 text-white">Test</NavLink>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
