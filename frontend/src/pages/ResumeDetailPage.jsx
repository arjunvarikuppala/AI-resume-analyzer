import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import ScoreOverview from "../components/ScoreOverview";
import { useResumeStore } from "../stores/resumeStore";

const ResumeDetailPage = () => {
  const { id } = useParams();
  const resume = useResumeStore((state) => state.selectedResume);
  const loading = useResumeStore((state) => state.detailLoading);
  const error = useResumeStore((state) => state.detailError);
  const loadResume = useResumeStore((state) => state.loadResume);

  useEffect(() => {
    loadResume(id);
  }, [id, loadResume]);

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

      <ScoreOverview />
    </div>
  );
};

export default ResumeDetailPage;
