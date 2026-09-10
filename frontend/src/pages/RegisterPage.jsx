import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck,
  History,
  Layers,
  Sparkles,
  UserCheck,
} from "lucide-react";

import PublicHeader from "../components/PublicHeader";
import { useAuthStore } from "../stores/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState({ email: "", password: "", role: "employee", companyName: "" });
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
      await register(form);
      navigate("/dashboard");
    } catch (requestError) {
      const details = requestError.details?.length ? requestError.details.join(" ") : "";
      setError(details || requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="site-shell min-h-screen pb-16">
      <PublicHeader />
      <main className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-6 pt-6 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        {/* Left Form Card */}
        <section className="panel my-auto w-full max-w-xl shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="pill-indigo">
              <Sparkles className="h-3.5 w-3.5" />
              Get Started Free
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Join thousands of professionals optimizing resumes and employers finding top talent with AI.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection Segmented Cards */}
            <div>
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                I want to use this account as a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm((c) => ({ ...c, role: "employee", companyName: "" }))}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                    form.role === "employee"
                      ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        form.role === "employee"
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                    </div>
                    {form.role === "employee" && (
                      <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Job Seeker</p>
                    <p className="text-xs text-slate-500 mt-0.5">Analyze & optimize resume</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm((c) => ({ ...c, role: "employer" }))}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                    form.role === "employer"
                      ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        form.role === "employer"
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>
                    {form.role === "employer" && (
                      <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Employer</p>
                    <p className="text-xs text-slate-500 mt-0.5">Post jobs & bulk rank candidates</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Email Field */}
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

            {/* Password Field with Show/Hide */}
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
                  placeholder="Minimum 8 characters"
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

            {/* Conditional Company Name for Employer */}
            {form.role === "employer" && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-indigo-900" htmlFor="companyName">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  className="field bg-white"
                  placeholder="e.g. Acme Corporation, Stark Tech"
                  value={form.companyName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, companyName: event.target.value }))
                  }
                  required
                />
              </div>
            )}

            {/* Error Message Display */}
            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700">
                <span className="mt-0.5 shrink-0 font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            ) : null}

            {/* Submit Button */}
            <button type="submit" className="button-primary w-full py-3.5 text-base" disabled={submitting}>
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Setting up your workspace...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4" to="/login">
              Log in here
            </Link>
          </div>
        </section>

        {/* Right Feature Showcase */}
        <section className="flex flex-col gap-6 lg:pl-4">
          <div className="space-y-4">
            <span className="pill-emerald">
              <Sparkles className="h-3.5 w-3.5" />
              Intelligent Resume Platform
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl leading-tight">
              Start with a smarter workspace for resume intelligence.
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Get detailed ATS compatibility insights, keyword gap analysis, and tailored formatting advice powered by advanced AI models.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: FileCheck,
                title: "Resume Score & ATS",
                copy: "Deep section-by-section breakdown and algorithmic ATS fit analysis.",
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              },
              {
                icon: Layers,
                title: "Keyword Fit",
                copy: "Identify missing industry keywords and high-impact action verbs.",
                color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              },
              {
                icon: Briefcase,
                title: "Tailored Feedback",
                copy: "Targeted suggestions to rewrite projects and bullets for specific job descriptions.",
                color: "text-blue-600 bg-blue-50 border-blue-100",
              },
              {
                icon: History,
                title: "Version History",
                copy: "Track revision metrics over time and compare improvements side-by-side.",
                color: "text-violet-600 bg-violet-50 border-violet-100",
              },
            ].map(({ icon: Icon, title, copy, color }) => (
              <article key={title} className="feature-card !p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${color} mb-3.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;

