import { useEffect, useState } from "react";

import HistoryTable from "../components/HistoryTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { getResumeHistory } from "../services/resumeService";

const formatInsightDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getResumeHistory();
        setHistory(response.resumes);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading history..." />;
  }

  const totalAnalyses = history.length;
  const latestResume = history[0] ?? null;
  const averageScore = totalAnalyses
    ? Math.round(
        history.reduce((sum, resume) => sum + (Number(resume.score) || 0), 0) / totalAnalyses,
      )
    : null;
  const bestAtsScore = totalAnalyses
    ? Math.max(...history.map((resume) => Number(resume.atsScore) || 0))
    : null;
  const totalMissingSkills = history.reduce(
    (sum, resume) => sum + (resume.missingSkills?.length ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="panel relative overflow-hidden">
        <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-mint/25 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <p className="section-title">History Workspace</p>
            <h1 className="max-w-3xl text-4xl font-semibold text-ink sm:text-5xl">
              Review every resume pass from a cleaner analysis board.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Compare scores, reopen detailed reports, and spot recurring ATS or skill gaps across
              previous uploads without digging through separate screens.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="pill">{totalAnalyses} analyses logged</span>
              <span className="pill">
                {averageScore !== null ? `${averageScore} average score` : "Waiting for data"}
              </span>
              <span className="pill">{totalMissingSkills} skill gaps flagged</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-white shadow-soft">
            <div className="absolute inset-x-6 top-0 h-px bg-white/10" />
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-coral/30 blur-3xl" />

            <p className="section-title !text-white/60">Latest Snapshot</p>
            {latestResume ? (
              <>
                <h2 className="mt-3 max-w-sm text-3xl font-semibold text-white">
                  {latestResume.fileName}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Most recent review captured on {formatInsightDate(latestResume.createdAt)}.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                      Resume score
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">{latestResume.score}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">ATS score</p>
                    <p className="mt-2 text-3xl font-bold text-white">{latestResume.atsScore}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                      Missing skills
                    </p>
                    <p className="mt-2 text-3xl font-bold text-white">
                      {latestResume.missingSkills?.length ?? 0}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-[24px] border border-dashed border-white/20 bg-white/5 px-5 py-6 text-sm leading-7 text-white/70">
                Upload a resume from the dashboard to start building a history trail here.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="pill !border-white/10 !bg-white/10 !text-white/75">
                {bestAtsScore !== null ? `Best ATS ${bestAtsScore}` : "No ATS record yet"}
              </span>
              <span className="pill !border-white/10 !bg-white/10 !text-white/75">
                Reopen any run in one click
              </span>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[28px] border border-rose-200/80 bg-rose-50/90 px-5 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <HistoryTable history={history} />
    </div>
  );
};

export default HistoryPage;
