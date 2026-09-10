import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Award,
  CheckCircle,
  FileCheck2,
  FileText,
  History,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import EmployerDashboard from "./EmployerDashboard";
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

  if (loading && user?.role !== "employer") {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (user?.role === "employer") {
    return <EmployerDashboard />;
  }

  const latestScore = latestResume?.score ?? "--";
  const atsScore = latestResume?.atsScore ?? latestResume?.score ?? "--";
  const jobMatchScore = latestResume?.jobMatchScore ? `${latestResume.jobMatchScore}%` : "Not evaluated";

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AnalyzingOverlay />

      {/* Hero Banner Section */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="pill-indigo">
                <Sparkles className="h-3.5 w-3.5" />
                Resume Dashboard
              </span>
              <span className="text-xs font-medium text-slate-400">
                {user?.email}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Optimize your resume for any hiring pipeline.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              Upload your resume to receive instantaneous ATS compatibility scoring, keyword coverage audits, and actionable rewrites.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="metric-tile">
              <div className="flex items-center gap-2 text-indigo-600">
                <FileText className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Analyses</span>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{history.length}</p>
            </div>

            <div className="metric-tile">
              <div className="flex items-center gap-2 text-emerald-600">
                <Award className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Latest ATS</span>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {atsScore !== "--" ? `${atsScore}%` : "--"}
              </p>
            </div>

            <div className="metric-tile">
              <div className="flex items-center gap-2 text-blue-600">
                <Target className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Match Fit</span>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{jobMatchScore}</p>
            </div>
          </div>
        </div>

        {/* AI Capabilities Card */}
        <div className="panel-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="pill !border-indigo-400/30 !bg-indigo-500/20 !text-indigo-300">
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                AI Diagnostic Engine
              </span>
              <span className="text-xs text-slate-400">Gemini 2.5 / 3.0</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">What we evaluate</h2>
            <p className="mt-1 text-xs text-slate-400">
              Six-dimensional resume analysis calibrated to real-world ATS software.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {[
              "ATS Parse Compatibility",
              "Missing Technical Keywords",
              "Action-Driven Bullet Points",
              "Measurable Metrics & Impact",
              "Grammar, Tone & Clarity",
              "Job Description Match Rate",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-200"
              >
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* Upload Component */}
      <ResumeUploadPanel />

      {/* Score and Detailed Insights */}
      {latestResume ? (
        <ScoreOverview />
      ) : (
        <div className="panel flex flex-col items-center justify-center py-12 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No resumes analyzed yet</h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Upload your resume above to view an instant breakdown of scores, strengths, and keywords.
          </p>
        </div>
      )}

      {/* History Snapshot Bar */}
      {history.length > 0 && (
        <div className="panel flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <History className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Analysis History</p>
              <p className="text-xs text-slate-500">
                You have {history.length} saved resume {history.length === 1 ? "report" : "reports"}
              </p>
            </div>
          </div>
          <Link className="button-secondary" to="/history">
            <span>View Full History</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

