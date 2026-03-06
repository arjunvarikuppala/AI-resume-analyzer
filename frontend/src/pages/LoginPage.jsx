import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
    <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <section className="panel flex flex-col justify-between gap-8 overflow-hidden bg-ink text-white">
        <div className="space-y-6">
          <span className="pill border-white/20 bg-white/10 text-white/80">
            Production-ready MERN app
          </span>
          <div className="space-y-4">
            <h1 className="max-w-xl text-5xl font-semibold leading-tight">
              Resume analysis tuned for recruiters and ATS systems.
            </h1>
            <p className="max-w-lg text-base text-white/75">
              Upload a resume and get a score, missing skills, grammar and spelling feedback,
              formatting consistency checks, and section-level recommendations.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["5-part scoring", "Balanced evaluation across content quality and ATS readiness."],
            ["History tracking", "Keep previous scans and compare later revisions."],
            ["Protected dashboard", "JWT-based access with isolated per-user results."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-4">
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm text-white/70">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel my-auto">
        <p className="section-title">Welcome back</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Log in</h2>
        <p className="mt-3 text-sm text-slate-500">
          Use your account to upload resumes and review previous analyses.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="field"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button type="submit" className="button-primary w-full" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Need an account?{" "}
          <Link className="font-semibold text-ink underline decoration-coral/60" to="/register">
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;

