import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Calendar,
  SlidersHorizontal,
  ChevronRight,
  Target,
  Zap,
  BarChart3
} from "lucide-react";

import HistoryTable from "../components/HistoryTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { useResumeStore } from "../stores/resumeStore";

const formatInsightDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const HistoryPage = () => {
  const history = useResumeStore((state) => state.history);
  const loading = useResumeStore((state) => state.historyLoading);
  const error = useResumeStore((state) => state.historyError);
  const loadHistory = useResumeStore((state) => state.loadHistory);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all"); // 'all', 'high', 'solid', 'needs_work'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'score_desc', 'ats_desc'

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const totalAnalyses = history.length;
  const latestResume = history[0] ?? null;
  const averageScore = totalAnalyses
    ? Math.round(
        history.reduce((sum, resume) => sum + (Number(resume.score) || 0), 0) / totalAnalyses
      )
    : 0;
  const bestAtsScore = totalAnalyses
    ? Math.max(...history.map((resume) => Number(resume.atsScore) || 0))
    : 0;
  const atsReadyCount = history.filter((resume) => Number(resume.atsScore) >= 80).length;
  const totalMissingSkills = history.reduce(
    (sum, resume) => sum + (resume.missingSkills?.length ?? 0),
    0
  );

  // Filter and sort items
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const matchesQuery =
          !searchQuery.trim() ||
          item.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.missingSkills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesQuery) return false;

        const score = Number(item.score) || 0;
        if (filterTier === "high") return score >= 80;
        if (filterTier === "solid") return score >= 65 && score < 80;
        if (filterTier === "needs_work") return score < 65;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "score_desc") return (Number(b.score) || 0) - (Number(a.score) || 0);
        if (sortBy === "ats_desc") return (Number(b.atsScore) || 0) - (Number(a.atsScore) || 0);
        return 0;
      });
  }, [history, searchQuery, filterTier, sortBy]);

  if (loading && !history.length) {
    return <LoadingSpinner label="Loading resume history..." />;
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl lg:p-10">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Resume Performance Archive</span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Track your resumes, revisions & ATS growth.
            </h1>
            
            <p className="max-w-2xl text-base text-slate-300 leading-relaxed">
              Compare AI scores, review historical keyword alignment, and reopen in-depth diagnostics across all uploaded versions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/10">
                <FileText className="h-4 w-4 text-indigo-300" />
                <span>{totalAnalyses} Resumes Analyzed</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/10">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>{atsReadyCount} ATS-Ready (80%+)</span>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Card */}
          <div className="relative rounded-3xl border border-white/15 bg-white/[0.08] p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Latest Review</p>
                <h3 className="mt-1 text-lg font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {latestResume ? latestResume.fileName : "No uploads yet"}
                </h3>
              </div>
              {latestResume && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Score: {latestResume.score}
                </span>
              )}
            </div>

            {latestResume ? (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-black/20 p-3 border border-white/5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Score</p>
                    <p className="mt-1 text-2xl font-black text-indigo-300">{latestResume.score}</p>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3 border border-white/5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">ATS Pass</p>
                    <p className="mt-1 text-2xl font-black text-emerald-400">{latestResume.atsScore}%</p>
                  </div>
                  <div className="rounded-2xl bg-black/20 p-3 border border-white/5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Gaps</p>
                    <p className="mt-1 text-2xl font-black text-amber-300">
                      {latestResume.missingSkills?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatInsightDate(latestResume.createdAt)}
                  </span>
                  <Link
                    to={`/resume/${latestResume._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white transition group"
                  >
                    <span>View Report</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-6">
                <p className="text-sm text-slate-300">
                  Upload a resume from the dashboard to see your performance metrics here.
                </p>
                <Link
                  to="/dashboard"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition"
                >
                  Upload First Resume
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Uploads</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{totalAnalyses}</p>
          <p className="mt-1 text-xs text-slate-500">Across your entire account</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Score</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{averageScore}</p>
          <p className="mt-1 text-xs text-slate-500">Benchmark across all submissions</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest ATS Fit</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{bestAtsScore}%</p>
          <p className="mt-1 text-xs text-slate-500">Best parsed keyword alignment</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Skill Gaps</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{totalMissingSkills}</p>
          <p className="mt-1 text-xs text-slate-500">Skills recommended for additions</p>
        </div>
      </section>

      {/* Error Message */}
      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by resume filename or missing skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Filter Pills & Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 text-xs">
            <button
              onClick={() => setFilterTier("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterTier === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterTier("high")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterTier === "high" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Top Tier (80+)
            </button>
            <button
              onClick={() => setFilterTier("solid")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterTier === "solid" ? "bg-white text-sky-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Solid (65-79)
            </button>
            <button
              onClick={() => setFilterTier("needs_work")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterTier === "needs_work" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Needs Work (&lt;65)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score_desc">Highest Score</option>
              <option value="ats_desc">Highest ATS Match</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table / Cards Component */}
      <HistoryTable items={filteredHistory} totalCount={history.length} />
    </div>
  );
};

export default HistoryPage;
