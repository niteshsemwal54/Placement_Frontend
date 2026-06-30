import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "dashboard", label: "Dashboard" },
  { to: "library", label: "Library" },
  { to: "test", label: "Test" },
];

export function StudentShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-indigo-300">Placement hub</p>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Student dashboard</h1>
            </div>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                      isActive
                        ? "bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20"
                        : "bg-slate-950/80 text-slate-300 hover:bg-slate-900/90 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
