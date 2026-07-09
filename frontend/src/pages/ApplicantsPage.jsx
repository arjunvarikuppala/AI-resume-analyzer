import { useEffect, useState } from "react";
import { getEmployerApplications, updateApplicationStatus } from "../services/applicationService";

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getEmployerApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status } : app
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading applicants...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="panel">
        <p className="section-title">Applicants</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Review Candidates</h1>
        <p className="mt-3 text-sm text-slate-600">Candidates are sorted by their AI semantic match score, highlighting the strongest potential fits.</p>
      </div>

      {applications.length === 0 ? (
        <div className="panel text-center py-12 text-slate-500">No applications received yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map(app => (
            <div key={app._id} className="panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink">{app.employeeId.email}</h3>
                <p className="text-sm font-medium text-slate-600 mt-1">Applied for: {app.jobId.title}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>Resume: {app.resumeId.fileName}</span>
                  <span>Overall AI Score: {app.resumeId.score}</span>
                </div>
                <p className="mt-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>AI Summary:</strong> {app.resumeId.aiSummary || "No summary available"}
                </p>
                <div className="mt-3">
                  <button 
                    onClick={() => setSelectedResume(app.resumeId)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-4"
                  >
                    View Full Resume
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Match Score</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    app.matchScore >= 80 ? "bg-emerald-100 text-emerald-700" :
                    app.matchScore >= 50 ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>
                    {app.matchScore}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`pill ${
                    app.status === 'shortlisted' ? '!bg-emerald-50 !text-emerald-700 !border-emerald-200' :
                    app.status === 'rejected' ? '!bg-rose-50 !text-rose-700 !border-rose-200' :
                    '!bg-blue-50 !text-blue-700 !border-blue-200'
                  }`}>
                    {app.status}
                  </span>
                </div>

                {app.status === 'applied' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="rounded-full px-4 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition">
                      Reject
                    </button>
                    <button onClick={() => handleUpdateStatus(app._id, 'shortlisted')} className="rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
                      Shortlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-ink">Resume Details</h2>
                <p className="text-slate-500 mt-1">{selectedResume.fileName}</p>
              </div>
              <button onClick={() => setSelectedResume(null)} className="text-slate-400 hover:text-ink">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-wrap font-mono text-sm text-slate-700">
                {selectedResume.resumeText || "No text could be extracted from this resume."}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedResume(null)} className="button-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;
