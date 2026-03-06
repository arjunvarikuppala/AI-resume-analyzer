import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-white/80 hover:text-ink"
  }`;

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-white">
            AI
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Resume Intelligence
            </p>
            <h1 className="text-xl font-semibold text-ink">AI Resume Analyzer</h1>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 md:block">
            {user?.email}
          </div>
          <button type="button" className="button-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

