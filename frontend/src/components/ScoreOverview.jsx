import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
  FileCheck,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";

import { useResumeStore } from "../stores/resumeStore";

const CircularProgress = ({ value, label, subtitle }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const numValue = Math.min(100, Math.max(0, Number(value) || 0));
  const strokeDashoffset = circumference - (numValue / 100) * circumference;

  let colorClass = "stroke-rose-500 text-rose-600 bg-rose-50 border-rose-200";
  let statusBadge = "Needs Attention";

  if (numValue >= 80) {
    colorClass = "stroke-emerald-500 text-emerald-600 bg-emerald-50 border-emerald-200";
    statusBadge = "Excellent Match";
  } else if (numValue >= 60) {
    colorClass = "stroke-indigo-500 text-indigo-600 bg-indigo-50 border-indigo-200";
    statusBadge = "Competitive";
  } else if (numValue >= 45) {
    colorClass = "stroke-amber-500 text-amber-600 bg-amber-50 border-amber-200";
    statusBadge = "Average";
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-sm text-center">
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="9"
            fill="transparent"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            className={`${colorClass.split(" ")[0]} transition-all duration-1000 ease-out`}
            strokeWidth="9"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-900 leading-none">{numValue}%</span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Score</span>
        </div>
      </div>

      <p className="mt-2.5 text-xs font-bold uppercase tracking-wider text-slate-700">{label}</p>
      <span className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${colorClass.split(" ").slice(1).join(" ")}`}>
        {statusBadge}
      </span>
      {subtitle && <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>}
    </div>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors p-1"
      title="Copy to clipboard"
    >
      {copied ? <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Clipboard className="h-3.5 w-3.5" />}
      <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

const ScoreOverview = () => {
  const { id } = useParams();
  const resume = useResumeStore((state) =>
    id ? state.selectedResume : state.latestResume
  );
  const [activeTab, setActiveTab] = useState("all");

  if (!resume) {
    return null;
  }

  const atsScore = resume.atsScore ?? resume.score ?? 0;
  const aiSummary =
    resume.aiSummary ||
    "This resume has been processed. Upload again with a target job description to generate a full tailored AI summary.";
  const strengths = resume.strengths || [];
  const weaknesses = resume.weaknesses || [];
  const missingKeywords = resume.missingKeywords || [];
  const recommendedSkills = resume.recommendedSkills || [];
  const projectImprovements = resume.projectImprovements || [];
  const experienceImprovements = resume.experienceImprovements || [];
  const grammarSuggestions = resume.grammarSuggestions || [];
  const overallRecommendation = resume.overallRecommendation || "";

  const jobMatchScore = resume.jobMatchScore ?? 0;
  const jobMatchAnalysis = resume.jobMatchAnalysis || null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Circular Gauges & Executive AI Summary */}
      <section className="panel grid gap-6 md:grid-cols-[280px_1fr] shadow-sm">
        <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:border-r md:border-slate-100 md:pr-6">
          <CircularProgress value={atsScore} label="ATS Score" subtitle="Algorithmic Fit" />
          {jobMatchScore > 0 && (
            <CircularProgress value={jobMatchScore} label="Job Match" subtitle="JD Alignment" />
          )}
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="pill-indigo">
                <Sparkles className="h-3.5 w-3.5" />
                Executive AI Diagnostic
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {resume.fileName || "Uploaded Resume"}
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">Analysis Summary</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
              {aiSummary}
            </p>
          </div>

          {overallRecommendation && (
            <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Primary Recommendation</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-indigo-950 leading-relaxed">
                {overallRecommendation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "all", label: "All Insights" },
          { id: "strengths", label: `Strengths & Weaknesses (${strengths.length + weaknesses.length})` },
          { id: "keywords", label: `Keywords & Skills (${missingKeywords.length + recommendedSkills.length})` },
          { id: "improvements", label: "Bullet Rewrites & Tips" },
          ...(jobMatchScore > 0 ? [{ id: "jobmatch", label: "Target JD Match Report" }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid: Strengths & Weaknesses */}
      {(activeTab === "all" || activeTab === "strengths") && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Strengths Card */}
          <div className="panel shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Key Strengths ({strengths.length})</h3>
              </div>
              <span className="pill-emerald !text-[10px]">Positive Signals</span>
            </div>

            <ul className="mt-4 space-y-3">
              {strengths.length > 0 ? (
                strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 text-sm text-slate-700 font-medium leading-relaxed group">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </div>
                    <CopyButton text={item} />
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 italic">No strengths flagged.</li>
              )}
            </ul>
          </div>

          {/* Weaknesses Card */}
          <div className="panel shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Areas to Improve ({weaknesses.length})</h3>
              </div>
              <span className="pill !bg-rose-50 !text-rose-700 !border-rose-200 !text-[10px]">Critical</span>
            </div>

            <ul className="mt-4 space-y-3">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 text-sm text-slate-700 font-medium leading-relaxed group">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      <span>{item}</span>
                    </div>
                    <CopyButton text={item} />
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-400 italic">No critical weak points identified.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Keywords & Recommended Skills */}
      {(activeTab === "all" || activeTab === "keywords") && (
        <div className="panel shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Keywords & Industry Terminology</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Integrating these keywords into your experience bullet points significantly enhances ATS ranking.
              </p>
            </div>
            <span className="pill-indigo">SEO & ATS</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Missing Keywords */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Missing Keywords ({missingKeywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.length > 0 ? (
                  missingKeywords.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-xl bg-white border border-slate-200/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                    >
                      + {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No missing keywords flagged.</span>
                )}
              </div>
            </div>

            {/* Recommended Skills */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  High-Impact Skills ({recommendedSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendedSkills.length > 0 ? (
                  recommendedSkills.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-xs font-bold shadow-sm shadow-indigo-500/20"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No specific skills suggested.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Suggestions */}
      {(activeTab === "all" || activeTab === "improvements") && (
        <div className="panel shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Actionable Rewrite & Enhancement Suggestions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Concrete phrasing recommendations to boost impact, add metrics, and polish tone.
            </p>
          </div>

          <div className="space-y-6">
            {/* Project Improvements */}
            {projectImprovements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Projects & Technical Portfolio
                </h4>
                <div className="space-y-2.5">
                  {projectImprovements.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-700 leading-relaxed group">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                      <CopyButton text={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Improvements */}
            {experienceImprovements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Experience & Quantifiable Metrics
                </h4>
                <div className="space-y-2.5">
                  {experienceImprovements.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-700 leading-relaxed group">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                      <CopyButton text={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar & Formatting */}
            {grammarSuggestions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Grammar, Syntax & Tone Corrections
                </h4>
                <div className="space-y-2.5">
                  {grammarSuggestions.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs font-medium text-slate-700 leading-relaxed group">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                      <CopyButton text={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Target Job Description Match Report (Conditional) */}
      {jobMatchScore > 0 && jobMatchAnalysis && (activeTab === "all" || activeTab === "jobmatch") && (
        <div className="panel !border-indigo-300 !bg-gradient-to-br !from-white !to-indigo-50/30 shadow-md space-y-6">
          <div className="flex flex-col gap-2 pb-4 border-b border-indigo-100">
            <span className="pill-indigo !w-fit">
              <Target className="h-3.5 w-3.5" />
              Target Job Tailoring
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900">Job Description Alignment Report</h3>
            <p className="text-xs text-slate-600 font-medium">
              A specialized gap audit comparing your uploaded resume with the provided job description requirements.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Missing Skills from JD */}
            <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-3">
                Missing Job-Specific Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {jobMatchAnalysis.missingSkills?.length > 0 ? (
                  jobMatchAnalysis.missingSkills.map((item, idx) => (
                    <span key={idx} className="inline-flex rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No missing skills flagged.</span>
                )}
              </div>
            </div>

            {/* Missing Keywords from JD */}
            <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                Missing JD Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {jobMatchAnalysis.missingKeywords?.length > 0 ? (
                  jobMatchAnalysis.missingKeywords.map((item, idx) => (
                    <span key={idx} className="inline-flex rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No missing keywords identified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Improvements for Tailoring */}
          {jobMatchAnalysis.recommendedImprovements?.length > 0 && (
            <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 mb-3">
                Recommended Enhancements for this Role
              </h4>
              <ul className="space-y-2.5">
                {jobMatchAnalysis.recommendedImprovements.map((item, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 text-xs font-medium text-slate-700 leading-relaxed group">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                    <CopyButton text={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreOverview;

