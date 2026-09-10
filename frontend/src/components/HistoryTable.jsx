import { Link } from "react-router-dom";
import { 
  FileText, 
  ArrowUpRight, 
  Calendar, 
  Target, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck2
} from "lucide-react";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const getScoreBadge = (score) => {
  const value = Number(score) || 0;

  if (value >= 85) {
    return {
      label: "Excellent",
      className: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
      dotColor: "bg-emerald-500",
    };
  }

  if (value >= 70) {
    return {
      label: "Competitive",
      className: "border-sky-200/80 bg-sky-50 text-sky-700",
      dotColor: "bg-sky-500",
    };
  }

  if (value >= 55) {
    return {
      label: "Needs Work",
      className: "border-amber-200/80 bg-amber-50 text-amber-700",
      dotColor: "bg-amber-500",
    };
  }

  return {
    label: "Critical",
    className: "border-rose-200/80 bg-rose-50 text-rose-700",
    dotColor: "bg-rose-500",
  };
};

const getFileBadge = (fileName = "") => {
  const extension = fileName.split(".").pop();

  if (extension && extension !== fileName) {
    return extension.slice(0, 3).toUpperCase();
  }

  return "PDF";
};

const HistoryTable = ({ items = [], totalCount = 0 }) => {
  if (totalCount === 0) {
    return (
      <div className="panel relative overflow-hidden text-center py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-slate-900">No resumes analyzed yet</h3>
        <p className="mt-2 max-w-md mx-auto text-sm text-slate-500">
          Upload your first resume from the dashboard to diagnose ATS compatibility, formatting issues, and missing skills.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-105"
        >
          <Sparkles className="h-4 w-4" />
          <span>Upload New Resume</span>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="panel text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-3 text-xl font-bold text-slate-900">No matching resumes found</h3>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search keywords or tier filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-soft backdrop-blur-md">
        <div className="grid grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.2fr_auto] items-center gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Resume Document</span>
          <span>Analysis Date</span>
          <span>Overall Score</span>
          <span>ATS Fit & Missing Skills</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((resume) => {
            const scoreBadge = getScoreBadge(resume.score);
            const score = Number(resume.score) || 0;
            const atsScore = Number(resume.atsScore) || 0;
            const missingSkills = resume.missingSkills || [];

            return (
              <div
                key={resume._id}
                className="grid grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.2fr_auto] items-center gap-4 px-6 py-4.5 transition hover:bg-slate-50/80 group"
              >
                {/* Document details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 font-bold text-xs border border-indigo-100/80 shadow-sm">
                    {getFileBadge(resume.fileName)}
                  </div>
                  <div className="min-w-0 pr-2">
                    <h4 className="truncate text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {resume.fileName}
                    </h4>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      ID: {resume._id.slice(-8)} • {resume.issues?.length || 0} issues flagged
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">{formatDate(resume.createdAt)}</div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-900 border border-slate-200">
                    {score}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${scoreBadge.className}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${scoreBadge.dotColor}`} />
                    {scoreBadge.label}
                  </span>
                </div>

                {/* ATS & Skills */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      ATS Match: <span className={atsScore >= 80 ? "text-emerald-600 font-extrabold" : "text-slate-700"}>{atsScore}%</span>
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 max-w-xs">
                    {missingSkills.length > 0 ? (
                      missingSkills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60">
                          +{skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> No skill gaps
                      </span>
                    )}
                    {missingSkills.length > 2 && (
                      <span className="text-[10px] font-semibold text-slate-400 self-center">
                        +{missingSkills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-right">
                  <Link
                    to={`/resume/${resume._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200/80 bg-indigo-50/60 px-3.5 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white hover:shadow-md"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 lg:hidden">
        {items.map((resume) => {
          const scoreBadge = getScoreBadge(resume.score);
          const atsScore = Number(resume.atsScore) || 0;
          const missingSkills = resume.missingSkills || [];

          return (
            <article
              key={resume._id}
              className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-soft backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-xs text-indigo-600 border border-indigo-100">
                    {getFileBadge(resume.fileName)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-bold text-slate-900">{resume.fileName}</h4>
                    <p className="text-xs text-slate-400">{formatDate(resume.createdAt)}</p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${scoreBadge.className}`}>
                  {resume.score} / 100
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ATS Fit</span>
                  <p className="mt-0.5 text-base font-extrabold text-slate-800">{atsScore}%</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing Skills</span>
                  <p className="mt-0.5 text-base font-extrabold text-slate-800">{missingSkills.length}</p>
                </div>
              </div>

              {missingSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {missingSkills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                      {s}
                    </span>
                  ))}
                  {missingSkills.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{missingSkills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <Link
                to={`/resume/${resume._id}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700"
              >
                <span>View Full Diagnostic Report</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTable;
