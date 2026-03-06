import { useEffect, useState } from "react";

import HistoryTable from "../components/HistoryTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { getResumeHistory } from "../services/resumeService";

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

  return (
    <div className="flex flex-col gap-6">
      <section className="panel">
        <p className="section-title">Timeline</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Resume analysis history</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Review prior uploads, track score changes, and reopen any analysis for detailed
          suggestions and issue lists.
        </p>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <HistoryTable history={history} />
    </div>
  );
};

export default HistoryPage;

