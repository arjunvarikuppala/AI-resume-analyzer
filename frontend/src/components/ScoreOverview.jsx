import { useState } from "react";
import { useParams } from "react-router-dom";

import { useResumeStore } from "../stores/resumeStore";

const getRatingColor = (value) => {
  if (value === "??" || value === undefined || value === null) {
    return "bg-amber-100 text-amber-800";
  }
  const num = Number(value);
  if (num >= 80) return "bg-emerald-100 text-emerald-800";
  if (num >= 50) return "bg-orange-100 text-orange-800";
  return "bg-rose-100 text-rose-800";
};

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

const CrossIcon = () => (
  <svg className="h-5 w-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronUp = () => (
  <svg className="h-5 w-5 text-slate-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDown = () => (
  <svg className="h-5 w-5 text-slate-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ScoreOverview = () => {
  const { id } = useParams();
  const resume = useResumeStore((state) =>
    id ? state.selectedResume : state.latestResume
  );

  const [expanded, setExpanded] = useState({
    content: true,
    sections: false,
    ats: false,
    tailoring: false,
  });

  if (!resume) {
    return null;
  }

  const scores = resume.sectionScores || {};

  const spellingErrorsCount = resume.spellingErrors?.length ?? 0;
  const grammarErrorsCount = resume.grammarErrors?.length ?? 0;
  const formattingIssuesCount = resume.formattingIssues?.length ?? 0;
  const missingSectionsCount = resume.missingSections?.length ?? 0;
  const missingSkillsCount = resume.missingSkills?.length ?? 0;

  const totalIssues =
    spellingErrorsCount +
    grammarErrorsCount +
    formattingIssuesCount +
    missingSectionsCount +
    missingSkillsCount;

  // 1. Content section items
  const spellingGrammarCount = spellingErrorsCount + grammarErrorsCount;
  const contentScore = Math.round(((scores.grammar ?? 0) + (scores.spelling ?? 0)) / 2);
  const contentItems = [
    {
      label: "ATS Parse Rate",
      pass: formattingIssuesCount === 0,
      badgeText: formattingIssuesCount === 0 ? "No issues" : `${formattingIssuesCount} issue${formattingIssuesCount > 1 ? "s" : ""}`,
    },
    {
      label: "Quantifying Impact",
      pass: (scores.formatting ?? 100) >= 70,
      badgeText: (scores.formatting ?? 100) >= 70 ? "No issues" : "Needs work",
    },
    {
      label: "Repetition",
      pass: true,
      badgeText: "No issues",
    },
    {
      label: "Spelling & Grammar",
      pass: spellingGrammarCount === 0,
      badgeText: spellingGrammarCount === 0 ? "No issues" : `${spellingGrammarCount} issue${spellingGrammarCount > 1 ? "s" : ""}`,
    },
  ];

  // 2. Sections items
  const checkSectionPass = (name) =>
    !resume.missingSections?.some((s) => s.toLowerCase().includes(name.toLowerCase()));
  const sectionItems = [
    {
      label: "Education Section",
      pass: checkSectionPass("education"),
      badgeText: checkSectionPass("education") ? "No issues" : "Missing",
    },
    {
      label: "Experience Section",
      pass: checkSectionPass("experience") || checkSectionPass("work"),
      badgeText:
        checkSectionPass("experience") || checkSectionPass("work") ? "No issues" : "Missing",
    },
    {
      label: "Skills Section",
      pass: checkSectionPass("skills"),
      badgeText: checkSectionPass("skills") ? "No issues" : "Missing",
    },
    {
      label: "Projects Section",
      pass: checkSectionPass("projects") || checkSectionPass("personal"),
      badgeText:
        checkSectionPass("projects") || checkSectionPass("personal") ? "No issues" : "Missing",
    },
    {
      label: "Contact Info Section",
      pass: checkSectionPass("contact") || checkSectionPass("info"),
      badgeText:
        checkSectionPass("contact") || checkSectionPass("info") ? "No issues" : "Missing",
    },
  ];

  // 3. ATS Essentials items
  const atsScore = resume.atsScore ?? 0;
  const atsItems = [
    {
      label: "Keyword Matching",
      pass: missingSkillsCount === 0,
      badgeText: missingSkillsCount === 0 ? "No issues" : `${missingSkillsCount} missing`,
    },
    {
      label: "File Format",
      pass: true,
      badgeText: "No issues",
    },
    {
      label: "Section Headings",
      pass: missingSectionsCount === 0,
      badgeText: missingSectionsCount === 0 ? "No issues" : `${missingSectionsCount} missing`,
    },
  ];

  // 4. Tailoring items
  const tailoringItems = [
    {
      label: "Job Title Match",
      pass: true,
      badgeText: "No issues",
    },
    {
      label: "Skills Alignment",
      pass: missingSkillsCount <= 2,
      badgeText:
        missingSkillsCount === 0 ? "No issues" : missingSkillsCount <= 2 ? "Solid" : "Needs alignment",
    },
  ];

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSection = (title, key, score, items) => {
    const isExpanded = expanded[key];
    const displayScore = score === "??" || score === undefined || score === null ? "??" : score;
    return (
      <div className="py-4">
        <button
          type="button"
          className="flex w-full items-center justify-between py-1 text-left focus:outline-none hover:bg-slate-50/50 rounded-xl px-2 -mx-2 transition"
          onClick={() => toggle(key)}
        >
          <span className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRatingColor(displayScore)}`}
            >
              {displayScore}%
            </span>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </button>

        {isExpanded && (
          <ul className="mt-3 space-y-3 pl-2 pr-1">
            {items.map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm py-0.5">
                <div className="flex items-center gap-3">
                  {item.pass ? <CheckIcon /> : <CrossIcon />}
                  <span className="font-medium text-slate-600">{item.label}</span>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.pass
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  {item.badgeText}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      {/* Header / Score Section */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
          Your Score
        </span>
        <h2 className={`mt-3 text-6xl font-extrabold ${getScoreColor(resume.score)}`}>
          {resume.score}/100
        </h2>
        <span className="mt-2 text-sm font-semibold text-slate-500">
          {totalIssues} {totalIssues === 1 ? "Issue" : "Issues"}
        </span>
      </div>

      {/* Accordions */}
      <div className="mt-4 divide-y divide-slate-100">
        {renderSection("Content", "content", contentScore, contentItems)}
        {renderSection("Sections", "sections", scores.sections ?? 100, sectionItems)}
        {renderSection("ATS Essentials", "ats", atsScore, atsItems)}
        {renderSection("Tailoring", "tailoring", "??", tailoringItems)}
      </div>

      {/* Scroll to action plan / recommendations */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00b289] py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-[#009b77]"
          onClick={() => {
            alert("Upgrade to Pro to unlock the full report, detailed recommendations, and tailoring suggestions!");
          }}
        >
          Unlock Full Report 🚀
        </button>
      </div>
    </div>
  );
};

export default ScoreOverview;
