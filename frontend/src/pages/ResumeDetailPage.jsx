import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

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
    return <LoadingSpinner label="Loading full analysis..." />;
  }

  if (error) {
    return (
      <div className="panel my-8 max-w-xl mx-auto text-center space-y-4 shadow-sm">
        <span className="pill !bg-rose-50 !text-rose-700 !border-rose-200">Analysis Error</span>
        <h1 className="text-2xl font-bold text-slate-900">Unable to load resume report</h1>
        <p className="text-sm text-rose-600">{error}</p>
        <div className="pt-2">
          <Link className="button-secondary" to="/history">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to history</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="pill-indigo">
              <FileText className="h-3.5 w-3.5" />
              Saved Report
            </span>
            <span className="text-xs text-slate-400 font-medium">{resume?.fileName}</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            Detailed Resume Breakdown
          </h1>
        </div>

        <Link className="button-secondary" to="/history">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to History</span>
        </Link>
      </div>

      <ScoreOverview />
    </div>
  );
};

export default ResumeDetailPage;
