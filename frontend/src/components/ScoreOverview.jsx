import { useParams } from "react-router-dom";
import { useResumeStore } from "../stores/resumeStore";

const getScoreColor = (value) => {
  const num = Number(value);
  if (num >= 80) return "text-emerald-600";
  if (num >= 50) return "text-amber-500";
  return "text-rose-500";
};

const CheckIcon = () => (
  <svg className="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BulletIcon = () => (
  <svg className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const WarningIcon = () => (
  <svg className="h-5 w-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CircularProgress = ({ value, label }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  let colorClass = "stroke-rose-500";
  if (value >= 80) {
    colorClass = "stroke-emerald-500";
  } else if (value >= 50) {
    colorClass = "stroke-amber-500";
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`${colorClass} transition-all duration-500`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-800">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">{label}</span>
    </div>
  );
};

const ScoreOverview = () => {
  const { id } = useParams();
  const resume = useResumeStore((state) =>
    id ? state.selectedResume : state.latestResume
  );

  if (!resume) {
    return null;
  }

  // Handle old resume entries by mapping or defaulting values
  const atsScore = resume.atsScore ?? resume.score ?? 0;
  const aiSummary = resume.aiSummary || "This resume has been processed. Upgrade or analyze again to generate a full AI summary.";
  const strengths = resume.strengths || [];
  const weaknesses = resume.weaknesses || [];
  const missingKeywords = resume.missingKeywords || [];
  const recommendedSkills = resume.recommendedSkills || [];
  const projectImprovements = resume.projectImprovements || [];
  const experienceImprovements = resume.experienceImprovements || [];
  const grammarSuggestions = resume.grammarSuggestions || [];
  const overallRecommendation = resume.overallRecommendation || "";
  
  // Job Match variables
  const jobMatchScore = resume.jobMatchScore ?? 0;
  const jobMatchAnalysis = resume.jobMatchAnalysis || null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Top Section - Scores & AI Summary */}
      <div className="grid gap-6 md:grid-cols-[250px_1fr] rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        {/* Scores */}
        <div className="flex flex-col gap-4 items-center justify-center md:border-r md:border-slate-100 md:pr-6">
          <CircularProgress value={atsScore} label="ATS Score" />
          {jobMatchScore > 0 && (
            <CircularProgress value={jobMatchScore} label="Job Match" />
          )}
        </div>

        {/* AI Summary & Overall Rec */}
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-500">AI Profile Summary</span>
            <p className="mt-2 text-base leading-relaxed text-slate-600 font-medium">
              {aiSummary}
            </p>
          </div>
          {overallRecommendation && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">Overall Recommendation</span>
              <p className="mt-1 text-sm text-indigo-950 font-semibold">{overallRecommendation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Strengths & Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckIcon />
            </span>
            <h3 className="text-lg font-bold text-slate-800">Key Strengths</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {strengths.length > 0 ? (
              strengths.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 leading-relaxed font-medium">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 italic">No key strengths extracted.</li>
            )}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <WarningIcon />
            </span>
            <h3 className="text-lg font-bold text-slate-800">Areas for Improvement</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {weaknesses.length > 0 ? (
              weaknesses.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 leading-relaxed font-medium">
                  <span className="text-rose-500 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400 italic">No critical areas flagged.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Keywords & Skills */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Skills & Keyword Enhancements</h3>
          <p className="text-sm text-slate-500">Add these industry-relevant terms and keywords to increase search visibility and match percentage.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Missing Keywords */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.length > 0 ? (
                missingKeywords.map((item, idx) => (
                  <span key={idx} className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400 italic">No keywords flagged.</span>
              )}
            </div>
          </div>

          {/* Recommended Skills */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2">Recommended Skills</h4>
            <div className="flex flex-wrap gap-2">
              {recommendedSkills.length > 0 ? (
                recommendedSkills.map((item, idx) => (
                  <span key={idx} className="inline-flex rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400 italic">No recommended skills.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">Actionable Suggestions</h3>

        <div className="space-y-6">
          {/* Projects */}
          {projectImprovements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Projects Improvements</h4>
              <ul className="space-y-2">
                {projectImprovements.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-600 leading-relaxed font-medium">
                    <BulletIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience */}
          {experienceImprovements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Experience Improvements</h4>
              <ul className="space-y-2">
                {experienceImprovements.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-600 leading-relaxed font-medium">
                    <BulletIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Grammar */}
          {grammarSuggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Grammar & Formatting suggestions</h4>
              <ul className="space-y-2">
                {grammarSuggestions.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-600 leading-relaxed font-medium">
                    <BulletIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Job Description Match Analysis Section (Conditional) */}
      {jobMatchScore > 0 && jobMatchAnalysis && (
        <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/10 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col gap-2 pb-4 border-b border-indigo-100">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-600">Tailoring Assessment</span>
            <h3 className="text-2xl font-extrabold text-slate-900">Job Description Alignment Report</h3>
            <p className="text-sm text-slate-600 font-medium">
              Below is a tailored gap-analysis between your uploaded resume and target job description.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Missing Skills from JD */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-950 mb-3">Missing Job-Specific Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobMatchAnalysis.missingSkills?.length > 0 ? (
                  jobMatchAnalysis.missingSkills.map((item, idx) => (
                    <span key={idx} className="inline-flex rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 italic">No missing job-specific skills identified.</span>
                )}
              </div>
            </div>

            {/* Missing Keywords from JD */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-950 mb-3">Missing JD Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {jobMatchAnalysis.missingKeywords?.length > 0 ? (
                  jobMatchAnalysis.missingKeywords.map((item, idx) => (
                    <span key={idx} className="inline-flex rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 italic">No missing keywords identified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Improvements for Tailoring */}
          {jobMatchAnalysis.recommendedImprovements?.length > 0 && (
            <div className="pt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-950 mb-3">Recommended Enhancements for this Role</h4>
              <ul className="space-y-2 bg-white rounded-2xl p-5 border border-indigo-100">
                {jobMatchAnalysis.recommendedImprovements.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-700 leading-relaxed font-semibold">
                    <CheckIcon />
                    <span>{item}</span>
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
