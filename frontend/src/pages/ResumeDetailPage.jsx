import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AnalysisListCard from "../components/AnalysisListCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ScoreOverview from "../components/ScoreOverview";
import { getResumeById } from "../services/resumeService";

const ResumeDetailPage = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getResumeById(id);
        setResume(response.resume);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading analysis..." />;
  }

  if (error) {
    return (
      <div className="panel">
        <p className="section-title">Analysis</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Unable to load resume</h1>
        <p className="mt-3 text-sm text-rose-600">{error}</p>
        <Link className="button-secondary mt-5" to="/history">
          Back to history
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="section-title">Resume Detail</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Full analysis</h1>
        </div>
        <Link className="button-secondary" to="/history">
          Back to history
        </Link>
      </div>

      <ScoreOverview resume={resume} />

      <div className="grid gap-5 xl:grid-cols-2">
        <AnalysisListCard
          title="Suggestions"
          subtitle="Improvement"
          items={resume.suggestions}
          emptyMessage="No suggestions available."
        />
        <AnalysisListCard
          title="Detected Skills"
          subtitle="Keywords"
          items={resume.detectedSkills}
          emptyMessage="No tracked skills were detected."
        />
        <AnalysisListCard
          title="Missing Skills"
          subtitle="Gaps"
          items={resume.missingSkills}
          emptyMessage="No missing tracked skills."
        />
        <AnalysisListCard
          title="Missing Sections"
          subtitle="Structure"
          items={resume.missingSections}
          emptyMessage="No sections are missing."
        />
        <AnalysisListCard
          title="Spelling Mistakes"
          subtitle="Language"
          items={resume.spellingErrors}
          emptyMessage="No spelling issues detected."
          renderItem={(item) => (
            <div className="space-y-2 text-sm text-slate-700">
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
          items={resume.grammarErrors}
          emptyMessage="No grammar issues detected."
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

      <AnalysisListCard
        title="Formatting Issues"
        subtitle="Presentation"
        items={resume.formattingIssues}
        emptyMessage="No formatting inconsistencies detected."
      />

      {resume.analysisWarnings?.length ? (
        <AnalysisListCard
          title="Analysis Warnings"
          subtitle="System Notes"
          items={resume.analysisWarnings}
          emptyMessage="No warnings."
        />
      ) : null}

      <section className="panel">
        <p className="section-title">Extracted Resume Text</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Parsed content</h2>
        <pre className="mt-5 max-h-[420px] overflow-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
          {resume.resumeText}
        </pre>
      </section>
    </div>
  );
};

export default ResumeDetailPage;

