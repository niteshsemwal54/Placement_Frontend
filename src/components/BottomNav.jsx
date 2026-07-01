import { NavLink } from "react-router-dom";

export function BottomNav() {
  const items = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/library", label: "Topics", icon: "📚" },
    { to: "/test", label: "Test", icon: "🧪" },
    { to: "/results", label: "Results", icon: "📊" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-sm sm:hidden">
      <div className="mx-auto max-w-6xl px-4 py-2">
        <div className="flex items-center justify-between">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition ${isActive ? "text-indigo-400" : "text-slate-400"}`
              }
            >
              <div className="text-lg">{it.icon}</div>
              <div className="truncate w-16 text-[11px]">{it.label}</div>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;
