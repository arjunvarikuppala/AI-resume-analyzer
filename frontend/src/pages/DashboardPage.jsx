import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AnalysisListCard from "../components/AnalysisListCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ResumeUploadPanel from "../components/ResumeUploadPanel";
import ScoreOverview from "../components/ScoreOverview";
import { useAuth } from "../context/AuthContext";
import { getResumeById, getResumeHistory, uploadResume } from "../services/resumeService";

const DashboardPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [latestResume, setLatestResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const historyResponse = await getResumeHistory();
      setHistory(historyResponse.resumes);

      if (historyResponse.resumes.length) {
        const latestResponse = await getResumeById(historyResponse.resumes[0]._id);
        setLatestResume(latestResponse.resume);
      } else {
        setLatestResume(null);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setError("");

    try {
      const response = await uploadResume(file);
      setLatestResume(response.resume);
      const historyResponse = await getResumeHistory();
      setHistory(historyResponse.resumes);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="flex flex-col gap-6">
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

      <ResumeUploadPanel onUpload={handleUpload} loading={uploading} />

      {latestResume ? (
        <>
          <ScoreOverview resume={latestResume} />
          <div className="grid gap-5 xl:grid-cols-2">
            <AnalysisListCard
              title="Improvement Suggestions"
              subtitle="Action Plan"
              items={latestResume.suggestions}
              emptyMessage="No suggestions were generated for this resume."
            />
            <AnalysisListCard
              title="Missing Skills"
              subtitle="Keyword Gaps"
              items={latestResume.missingSkills}
              emptyMessage="All tracked technical skills were detected."
            />
            <AnalysisListCard
              title="Missing Sections"
              subtitle="Structure"
              items={latestResume.missingSections}
              emptyMessage="All required resume sections were detected."
            />
            <AnalysisListCard
              title="Formatting Issues"
              subtitle="Presentation"
              items={latestResume.formattingIssues}
              emptyMessage="No formatting inconsistencies were detected."
            />
            <AnalysisListCard
              title="Spelling Mistakes"
              subtitle="Language"
              items={latestResume.spellingErrors}
              emptyMessage="No spelling issues were detected."
              renderItem={(item) => (
                <div className="flex flex-col gap-2 text-sm text-slate-700">
                  <p className="font-semibold text-ink">
                    {item.word} <span className="font-normal text-slate-500">({item.count})</span>
                  </p>
                  <p>Suggestions: {item.suggestions.length ? item.suggestions.join(", ") : "None"}</p>
                </div>
              )}
            />
            <AnalysisListCard
              title="Grammar Issues"
              subtitle="Readability"
              items={latestResume.grammarErrors}
              emptyMessage="No grammar issues were detected."
              renderItem={(item) => (
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="font-semibold text-ink">{item.message}</p>
                  {item.sentence ? <p className="text-slate-500">Context: {item.sentence}</p> : null}
                  {item.replacements.length ? (
                    <p>Suggestions: {item.replacements.join(", ")}</p>
                  ) : null}
                </div>
              )}
            />
          </div>

          {latestResume.analysisWarnings?.length ? (
            <AnalysisListCard
              title="Analysis Warnings"
              subtitle="System Notes"
              items={latestResume.analysisWarnings}
              emptyMessage="No warnings."
            />
          ) : null}
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

