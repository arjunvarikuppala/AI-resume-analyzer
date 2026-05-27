import { useEffect } from "react";
import { Link } from "react-router-dom";

import AnalyzingOverlay from "../components/AnalyzingOverlay";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeUploadPanel from "../components/ResumeUploadPanel";
import ScoreOverview from "../components/ScoreOverview";
import { useAuthStore } from "../stores/authStore";
import { useResumeStore } from "../stores/resumeStore";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const history = useResumeStore((state) => state.history);
  const latestResume = useResumeStore((state) => state.latestResume);
  const loading = useResumeStore((state) => state.dashboardLoading);
  const error = useResumeStore((state) => state.dashboardError);
  const loadDashboard = useResumeStore((state) => state.loadDashboard);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <AnalyzingOverlay />
      <section className="panel grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <p className="section-title">Overview</p>
          <h1 className="max-w-2xl text-4xl font-semibold text-ink">
            Resume scoring and improvement suggestions in one place.
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Signed in as {user?.email}. Upload a resume to evaluate ATS compatibility, missing
            sections, technical skills, grammar quality, spelling issues, and formatting.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Analyses", history.length],
              ["Latest score", latestResume?.score ?? "--"],
              ["ATS score", latestResume?.atsScore ?? "--"],
            ].map(([label, value]) => (
              <div key={label} className="metric-tile">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-gradient-to-br from-ink via-slate-900 to-slate-800 p-6 text-white shadow-soft">
          <p className="section-title !text-white/60">What gets analyzed</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Formatting consistency",
              "Spelling mistakes",
              "Grammar issues",
              "Missing sections",
              "Technical skills",
              "ATS compatibility score",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <ResumeUploadPanel />

      {latestResume ? (
        <>
          <ScoreOverview />
        </>
      ) : (
        <div className="panel flex flex-col gap-4">
          <p className="section-title">Ready to start</p>
          <h2 className="text-2xl font-semibold text-ink">No resume analyses yet</h2>
          <p className="text-sm text-slate-500">
            Upload your first resume above to get a score and targeted recommendations.
          </p>
        </div>
      )}

      {history.length ? (
        <div className="panel flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-title">History Snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Recent activity</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="pill">{history.length} total analyses</span>
            <Link className="button-secondary" to="/history">
              View full history
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardPage;
