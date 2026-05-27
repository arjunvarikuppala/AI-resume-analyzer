import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PublicHeader from "../components/PublicHeader";
import { useAuthStore } from "../stores/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
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
    <div className="site-shell min-h-screen pb-12">
      <PublicHeader />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 pb-6 pt-8 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8">
        <section className="panel my-auto max-w-xl lg:w-full">
          <p className="section-title">Create account</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Start analyzing resumes</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Registration opens your private workspace so you can upload resumes, review feedback,
            and track how each new version improves over time.
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
                placeholder="Minimum 8 characters"
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
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already registered?{" "}
            <Link className="font-semibold text-ink underline decoration-coral/60" to="/login">
              Log in
            </Link>
          </p>
        </section>

        <section className="panel flex flex-col gap-6 overflow-hidden">
          <div className="space-y-5">
            <span className="pill !border-amber-200/80 !bg-amber-50/80 !text-amber-700">
              Product overview
            </span>
            <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-ink">
              Start with a simple workspace for resume improvement.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600">
              Create an account to upload resumes, read the analysis clearly, and keep your drafts
              organized in one place.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              [
                "Resume score",
                "See an overall score plus separate section-based scoring signals.",
              ],
              [
                "ATS compatibility",
                "Check structure and keyword fit for machine-readable resumes.",
              ],
              [
                "Actionable feedback",
                "Review missing sections, wording issues, and formatting inconsistencies.",
              ],
              [
                "Analysis history",
                "Keep earlier uploads available for future comparison.",
              ],
            ].map(([title, copy]) => (
              <article key={title} className="feature-card !rounded-[26px] !p-5">
                <h3 className="text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </article>
              ))}
            </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
