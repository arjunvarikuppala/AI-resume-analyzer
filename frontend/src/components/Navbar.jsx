import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";
import { useResumeStore } from "../stores/resumeStore";
import BrandMark from "./BrandMark";

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const clearResumeData = useResumeStore((state) => state.clearResumeData);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearResumeData();
    navigate("/login");
  };

  const isEmployer = user?.role === "employer";

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="glass-nav mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[22px] px-4 py-3 sm:px-6 shadow-sm">
        {/* Brand */}
        <BrandMark compact to="/dashboard" />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          {isEmployer ? (
            <NavLink to="/applicants" className={linkClass}>
              <Users className="h-4 w-4" />
              Candidates
            </NavLink>
          ) : (
            <>
              <NavLink to="/history" className={linkClass}>
                <History className="h-4 w-4" />
                History
              </NavLink>
              <NavLink to="/jobs" className={linkClass}>
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </NavLink>
            </>
          )}
        </nav>

        {/* User Info & Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-50/80 py-1.5 pl-3 pr-3.5 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-xs font-bold text-white uppercase">
              {user?.email?.[0] || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-none">
                {user?.companyName || user?.email?.split("@")[0]}
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider leading-none mt-0.5">
                {isEmployer ? "Employer" : "Job Seeker"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="button-secondary !py-2 !px-3.5 !rounded-xl text-xs"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl md:hidden">
          <div className="mb-2 flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white uppercase">
              {user?.email?.[0] || "U"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.email}</p>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {isEmployer ? `Employer • ${user?.companyName || ""}` : "Job Seeker"}
              </p>
            </div>
          </div>

          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={linkClass}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          {isEmployer ? (
            <NavLink
              to="/applicants"
              onClick={() => setMobileMenuOpen(false)}
              className={linkClass}
            >
              <Users className="h-4 w-4" />
              Candidates
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={linkClass}
              >
                <History className="h-4 w-4" />
                History
              </NavLink>
              <NavLink
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className={linkClass}
              >
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </NavLink>
            </>
          )}

          <div className="mt-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              className="button-secondary w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

