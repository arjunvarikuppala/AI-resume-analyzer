import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
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
    <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section className="panel my-auto">
        <p className="section-title">Create account</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Start analyzing resumes</h2>
        <p className="mt-3 text-sm text-slate-500">
          Registration creates a secure JWT session and unlocks the analysis dashboard.
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

      <section className="panel flex flex-col gap-6 overflow-hidden bg-gradient-to-br from-white/80 via-orange-50 to-mist">
        <p className="section-title">What you get</p>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Resume score",
              "Weighted scoring across sections, grammar, spelling, skills, and formatting.",
            ],
            [
              "ATS compatibility",
              "Keyword and structure checks focused on machine-readable resumes.",
            ],
            [
              "Actionable feedback",
              "Spelling, grammar, formatting, and missing section suggestions.",
            ],
            [
              "Analysis history",
              "A private timeline of previous resume uploads per user account.",
            ],
          ].map(([title, copy]) => (
            <article
              key={title}
              className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-3 text-sm text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;

