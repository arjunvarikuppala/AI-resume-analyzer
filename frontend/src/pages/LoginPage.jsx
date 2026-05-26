import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PublicHeader from "../components/PublicHeader";
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
    <div className="site-shell min-h-screen pb-12">
      <PublicHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 pb-6 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <section className="panel flex flex-col gap-8">
          <div className="space-y-6">
            <span className="pill !border-sky-200/80 !bg-sky-50/80 !text-sky-700">
              Welcome back
            </span>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-ink">
                Sign in and continue your resume review.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600">
                Open previous analyses, upload the next draft, and keep your revision history in
                one simple workspace.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Saved reports", "Open earlier resume analyses any time."],
                ["Fast re-uploads", "Upload the next draft from the dashboard."],
                ["Focused feedback", "Return to scores, issues, and missing skills quickly."],
              ].map(([title, copy]) => (
                <article key={title} className="feature-card !rounded-[26px] !p-4">
                  <p className="text-base font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="panel my-auto max-w-xl lg:ml-auto lg:w-full">
          <p className="section-title">Secure workspace</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Log in</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Use your account to upload resumes and continue reviewing earlier analysis runs.
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
      </main>
    </div>
  );
};

export default LoginPage;
