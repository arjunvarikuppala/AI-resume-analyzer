import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, FileSearch, History, Lock, Sparkles, Zap } from "lucide-react";

import PublicHeader from "../components/PublicHeader";
import { useAuthStore } from "../stores/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site-shell min-h-screen pb-16">
      <PublicHeader />
      <main className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-6 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* Left Welcome Showcase */}
        <section className="flex flex-col gap-6">
          <div className="space-y-4">
            <span className="pill-indigo">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome Back
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl leading-tight">
              Sign in to continue your resume optimization.
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Access your previous reports, analyze fresh revisions, and track your ATS readiness across all job applications.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: History,
                title: "Saved History",
                copy: "Review previous scores and revision comparisons anytime.",
              },
              {
                icon: Zap,
                title: "Instant ATS Check",
                copy: "Run deep analysis on new PDF/DOCX drafts in seconds.",
              },
              {
                icon: FileSearch,
                title: "Keyword Gaps",
                copy: "Target job descriptions with tailored skill matches.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="feature-card !p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Right Login Card */}
        <section className="panel my-auto w-full max-w-md shadow-xl shadow-slate-200/50 lg:ml-auto">
          <div className="flex items-center gap-2">
            <span className="pill-emerald">
              <Lock className="h-3.5 w-3.5" />
              Secure Workspace
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Log in</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and password to access your dashboard.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="field"
                placeholder="you@company.com"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="field pr-11"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700">
                <span className="mt-0.5 shrink-0 font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            ) : null}

            <button type="submit" className="button-primary w-full py-3.5 text-base" disabled={submitting}>
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            Don't have an account yet?{" "}
            <Link className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4" to="/register">
              Create one for free
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;

