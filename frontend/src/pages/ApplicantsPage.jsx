import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Sparkles,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { getEmployerApplications, updateApplicationStatus } from "../services/applicationService";

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      setApplications(
        applications.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update applicant status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm font-semibold text-slate-500">Loading candidate applications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="panel flex flex-col justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="pill-indigo">
            <Users className="h-3.5 w-3.5" />
            Candidate Pipeline
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {applications.length} Total {applications.length === 1 ? "Applicant" : "Applicants"}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Candidate Review & Semantic Match Ranking
        </h1>
        <p className="text-sm leading-relaxed text-slate-600 max-w-2xl">
          Candidates are automatically ordered by semantic compatibility with your job requirements.
        </p>
      </div>

      {/* Candidate List */}
      {applications.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Applicants Yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            When job seekers apply to your postings, their profiles and AI fit scores will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="panel flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm hover:border-indigo-300 transition-all"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs uppercase border border-indigo-100">
                    {app.employeeId?.email?.[0] || "C"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.employeeId?.email}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Applied for:{" "}
                      <span className="text-indigo-600">{app.jobId?.title || "Job Posting"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    {app.resumeId?.fileName || "Resume"}
                  </span>
                  <span>•</span>
                  <span>
                    ATS Score:{" "}
                    <strong className="text-slate-700">{app.resumeId?.score || app.resumeId?.atsScore}%</strong>
                  </span>
                </div>

                {app.resumeId?.aiSummary && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                    <strong className="text-slate-800">AI Profile:</strong> {app.resumeId.aiSummary}
                  </p>
                )}

                <div>
                  <button
                    onClick={() => setSelectedResume(app.resumeId)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Extracted Resume Text</span>
                  </button>
                </div>
              </div>

              {/* Match Score & Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 shrink-0 min-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      AI Match Fit
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {app.matchScore >= 80 ? "Top Candidate" : app.matchScore >= 50 ? "Solid Fit" : "Low Match"}
                    </span>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-extrabold shadow-sm ${
                      app.matchScore >= 80
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : app.matchScore >= 50
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {app.matchScore}%
                  </div>
                </div>

                {/* Status Indicator */}
                <div>
                  <span
                    className={`pill !text-[11px] font-bold capitalize ${
                      app.status === "shortlisted"
                        ? "!bg-emerald-50 !text-emerald-700 !border-emerald-200"
                        : app.status === "rejected"
                        ? "!bg-rose-50 !text-rose-700 !border-rose-200"
                        : "!bg-indigo-50 !text-indigo-700 !border-indigo-200"
                    }`}
                  >
                    {app.status === "shortlisted" && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {app.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                    {app.status === "applied" && <Clock className="h-3.5 w-3.5" />}
                    <span>{app.status}</span>
                  </span>
                </div>

                {/* Actions */}
                {app.status === "applied" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(app._id, "rejected")}
                      disabled={updatingId === app._id}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/80 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, "shortlisted")}
                      disabled={updatingId === app._id}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Shortlist</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resume Text Drawer / Modal */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-[28px] bg-white p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="pill-indigo !text-[10px]">Resume Inspector</span>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {selectedResume.fileName || "Candidate Resume"}
                </h2>
              </div>
              <button
                onClick={() => setSelectedResume(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-5 flex-1 overflow-y-auto pr-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-6">
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 leading-relaxed">
                {selectedResume.resumeText || "No text content could be extracted from this document."}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setSelectedResume(null)} className="button-primary">
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;

