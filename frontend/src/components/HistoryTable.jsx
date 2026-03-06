import { Link } from "react-router-dom";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const HistoryTable = ({ history }) => {
  if (!history.length) {
    return (
      <div className="panel">
        <p className="section-title">Resume History</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">No analyses yet</h2>
        <p className="mt-3 text-sm text-slate-500">
          Upload your first resume from the dashboard to start tracking improvements over time.
        </p>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="mb-5">
        <p className="section-title">Resume History</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Previous analyses</h2>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.24em] text-slate-500">
            <tr>
              <th className="pb-4">File</th>
              <th className="pb-4">Created</th>
              <th className="pb-4">Score</th>
              <th className="pb-4">ATS</th>
              <th className="pb-4">Missing Skills</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((resume) => (
              <tr key={resume._id}>
                <td className="py-4 font-medium text-ink">{resume.fileName}</td>
                <td className="py-4 text-slate-600">{formatDate(resume.createdAt)}</td>
                <td className="py-4 font-semibold text-ink">{resume.score}</td>
                <td className="py-4 font-semibold text-ink">{resume.atsScore}</td>
                <td className="py-4 text-slate-600">{resume.missingSkills.length}</td>
                <td className="py-4 text-right">
                  <Link className="button-secondary" to={`/resume/${resume._id}`}>
                    View analysis
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {history.map((resume) => (
          <div key={resume._id} className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-ink">{resume.fileName}</h3>
                <p className="mt-1 text-sm text-slate-500">{formatDate(resume.createdAt)}</p>
              </div>
              <span className="pill">Score {resume.score}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>ATS {resume.atsScore}</span>
              <span>{resume.missingSkills.length} missing skills</span>
            </div>
            <Link className="button-secondary mt-4 w-full" to={`/resume/${resume._id}`}>
              View analysis
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTable;
