import { Link } from "react-router-dom";

import { useResumeStore } from "../stores/resumeStore";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getScoreBadge = (score) => {
  const value = Number(score) || 0;

  if (value >= 85) {
    return {
      label: "Strong",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (value >= 70) {
    return {
      label: "Solid",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    };
  }

  if (value >= 55) {
    return {
      label: "Needs work",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Critical",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  };
};

const summarizeMissingSkills = (skills = []) => {
  if (!skills.length) {
    return "No tracked skill gaps";
  }

  if (skills.length <= 2) {
    return skills.join(", ");
  }

  return `${skills.slice(0, 2).join(", ")} +${skills.length - 2} more`;
};

const getFileBadge = (fileName = "") => {
  const extension = fileName.split(".").pop();

  if (extension && extension !== fileName) {
    return extension.slice(0, 3).toUpperCase();
  }

  return "CV";
};

const HistoryTable = () => {
  const history = useResumeStore((state) => state.history);

  if (!history.length) {
    return (
      <div className="panel relative overflow-hidden">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <p className="section-title">Resume History</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">No analyses yet</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Upload your first resume from the dashboard to start tracking improvements, ATS
            changes, and recurring skill gaps over time.
          </p>
        </div>
      </div>
    );
  }

  const atsReadyCount = history.filter((resume) => Number(resume.atsScore) >= 80).length;

  return (
    <div className="panel relative overflow-hidden">
      <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-mist/70 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-title">Resume History</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Previous analyses</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Open any saved report to revisit the exact suggestions, issues, and ATS results tied
              to that upload.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="pill">{history.length} saved reports</span>
            <span className="pill">{atsReadyCount} ATS-ready passes</span>
          </div>
        </div>

        <div className="mt-8 hidden lg:flex lg:flex-col lg:gap-4">
          <div className="grid grid-cols-[minmax(0,1.7fr)_1fr_0.95fr_0.95fr_auto] gap-4 px-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <span>Resume</span>
            <span>Analyzed</span>
            <span>Score</span>
            <span>ATS + gaps</span>
            <span className="text-right">Action</span>
          </div>

          {history.map((resume) => {
            const scoreBadge = getScoreBadge(resume.score);

            return (
              <article
                key={resume._id}
                className="grid items-center gap-4 rounded-[28px] border border-white/80 bg-white/[0.82] p-4 shadow-[0_20px_55px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[minmax(0,1.7fr)_1fr_0.95fr_0.95fr_auto]"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-ink text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    {getFileBadge(resume.fileName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-ink">{resume.fileName}</h3>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {summarizeMissingSkills(resume.missingSkills)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Analyzed</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{formatDate(resume.createdAt)}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Score</p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-2xl font-bold text-ink">{resume.score}</p>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${scoreBadge.className}`}
                    >
                      {scoreBadge.label}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ATS + gaps</p>
                  <p className="mt-2 text-lg font-bold text-ink">{resume.atsScore} ATS</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {resume.missingSkills?.length ?? 0} missing skills
                  </p>
                </div>

                <div className="flex justify-end">
                  <Link className="button-secondary whitespace-nowrap" to={`/resume/${resume._id}`}>
                    Open report
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4 lg:hidden">
        {history.map((resume) => {
          const scoreBadge = getScoreBadge(resume.score);

          return (
            <article
              key={resume._id}
              className="rounded-[28px] border border-white/80 bg-white/[0.86] p-5 shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-ink text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    {getFileBadge(resume.fileName)}
                  </div>
                  <h3 className="truncate text-xl font-semibold text-ink">{resume.fileName}</h3>
                  <p className="mt-2 text-sm text-slate-500">{formatDate(resume.createdAt)}</p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${scoreBadge.className}`}
                >
                  {resume.score}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ATS</p>
                  <p className="mt-2 text-lg font-bold text-ink">{resume.atsScore}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Skill gaps</p>
                  <p className="mt-2 text-lg font-bold text-ink">
                    {resume.missingSkills?.length ?? 0}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {summarizeMissingSkills(resume.missingSkills)}
              </p>

              <Link className="button-secondary mt-5 w-full" to={`/resume/${resume._id}`}>
                Open report
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTable;
