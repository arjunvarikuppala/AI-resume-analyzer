import { NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/authStore";
import { useResumeStore } from "../stores/resumeStore";
import BrandMark from "./BrandMark";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-ink text-white shadow-[0_12px_30px_rgba(16,32,51,0.18)]"
      : "text-slate-600 hover:bg-white/80 hover:text-ink"
  }`;

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const clearResumeData = useResumeStore((state) => state.clearResumeData);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearResumeData();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass-nav mx-auto flex max-w-7xl flex-col gap-4 rounded-[32px] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <BrandMark compact to="/dashboard" />

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-white/80 bg-white/[0.85] px-4 py-2 text-sm font-medium text-slate-600 md:block">
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
