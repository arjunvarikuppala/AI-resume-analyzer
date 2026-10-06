import { useEffect, useState, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  MapPin,
  Search,
  Sparkles,
  Target,
  Upload,
  X,
  XCircle,
} from "lucide-react";

import AnalyzingOverlay from "../components/AnalyzingOverlay";
import { applyToJob, getEmployeeApplications } from "../services/applicationService";
import { getJobs } from "../services/jobService";
import { useResumeStore } from "../stores/resumeStore";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [applicationStatusMap, setApplicationStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal State for Apply & ATS Check
  const [selectedJob, setSelectedJob] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [tempResume, setTempResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const fileInputRef = useRef(null);

  const latestResume = useResumeStore((state) => state.latestResume);
  const uploadResume = useResumeStore((state) => state.uploadResume);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [jobsData, applicationsData] = await Promise.all([
        getJobs(),
        getEmployeeApplications().catch(() => []),
      ]);
      setJobs(jobsData);

      const statusMap = {};
      applicationsData.forEach((app) => {
        if (app.jobId) {
          const id = app.jobId._id || app.jobId;
          statusMap[id] = app.status;
        }
      });
      setApplicationStatusMap(statusMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setNewFile(null);
    setTempResume(null);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setNewFile(null);
    setTempResume(null);
  };

  const handleUploadAndAnalyze = async () => {
    if (!newFile) return;
    setAnalyzingResume(true);
    try {
      const analyzed = await uploadResume(newFile, selectedJob?.description || "");
      if (analyzed) {
        setTempResume(analyzed);
      } else {
        alert("Failed to analyze resume. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume file.");
    } finally {
      setAnalyzingResume(false);
    }
  };

  const handleConfirmApply = async (resumeToUse) => {
    const targetResume = resumeToUse || tempResume || latestResume;
    if (!targetResume) {
      alert("Please upload or select a resume to apply.");
      return;
    }

    setApplying(true);
    try {
      await applyToJob(selectedJob._id, targetResume._id);
      setApplicationStatusMap((prev) => ({ ...prev, [selectedJob._id]: "applied" }));
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (job.title || "").toLowerCase().includes(q);
    const locationMatch = (job.location || "").toLowerCase().includes(q);
    const descMatch = (job.description || "").toLowerCase().includes(q);
    const skillsMatch =
      Array.isArray(job.requiredSkills) &&
      job.requiredSkills.some((s) => s.toLowerCase().includes(q));
    return titleMatch || locationMatch || descMatch || skillsMatch;
  });

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm font-semibold text-slate-500">Discovering open positions...</p>
      </div>
    );
  }

  const activeResumeToUse = tempResume || latestResume;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <AnalyzingOverlay />

      {/* Header Banner */}
      <div className="panel flex flex-col justify-between gap-5 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="pill-indigo">
              <Briefcase className="h-3.5 w-3.5" />
              Career Board
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {jobs.length} Available {jobs.length === 1 ? "Role" : "Roles"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Opportunities & Check ATS Fit
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 max-w-2xl">
            Upload your resume or apply directly with your active resume. Our AI automatically evaluates your ATS compatibility score and semantic fit for every role.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="field pl-11"
            placeholder="Search by job title, skill (e.g. React, Python), or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Active Resume Quick Bar */}
        {latestResume ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2.5">
              <FileCheck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                Active Resume: <strong className="text-slate-900">{latestResume.fileName}</strong>
              </span>
              <span className="pill !text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                ATS Score: {latestResume.atsScore || latestResume.score}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs font-medium text-amber-900">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>No active resume uploaded yet. You can upload a resume right when applying to test your ATS score!</span>
            </div>
          </div>
        )}
      </div>

      {/* Job Grid */}
      {filteredJobs.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Briefcase className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {searchQuery ? "No Matching Roles Found" : "No Job Postings Yet"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {searchQuery
              ? "Try broadening your search query or check back soon."
              : "Check back soon as new employers post opportunities."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="panel flex flex-col justify-between shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="capitalize">{job.employmentType}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  <span className="pill !text-[10px] uppercase tracking-wider font-bold">
                    {job.employerId?.companyName || "Employer"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {job.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {Array.isArray(job.requiredSkills) &&
                    job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                {(() => {
                  const status = applicationStatusMap[job._id];
                  if (status === "shortlisted") {
                    return (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Shortlisted for Interview 🎉</span>
                      </div>
                    );
                  }
                  if (status === "rejected") {
                    return (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-500">
                        <XCircle className="h-4 w-4" />
                        <span>Application Not Selected</span>
                      </div>
                    );
                  }
                  if (status === "applied") {
                    return (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 py-2.5 text-xs font-bold text-indigo-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Application Submitted</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => handleOpenApplyModal(job)}
                      className="button-primary w-full flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Check ATS Fit & Apply</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply & Check ATS Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-5 md:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="pill-indigo !text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  ATS Match & Job Application
                </span>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {selectedJob.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                  <span>{selectedJob.employerId?.companyName || "Employer"}</span>
                  <span>•</span>
                  <span>{selectedJob.location}</span>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Option A: Current Active Resume */}
              {latestResume && !tempResume && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{latestResume.fileName}</p>
                        <p className="text-[11px] text-slate-500">Your currently active resume</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        ATS: {latestResume.atsScore || latestResume.score}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConfirmApply(latestResume)}
                    disabled={applying}
                    className="button-primary w-full mt-4"
                  >
                    {applying ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Apply with Active Resume</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Temp Analyzed Resume Feedback */}
              {tempResume && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-900">
                        Resume Analyzed & Matched!
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{tempResume.fileName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="rounded-xl bg-white p-3 border border-emerald-100 text-center">
                      <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-bold">
                        <Award className="h-3.5 w-3.5" />
                        <span>ATS Score</span>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1">
                        {tempResume.atsScore || tempResume.score}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3 border border-emerald-100 text-center">
                      <div className="flex items-center justify-center gap-1 text-indigo-600 text-xs font-bold">
                        <Target className="h-3.5 w-3.5" />
                        <span>Job Match</span>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1">
                        {tempResume.jobMatchScore}%
                      </p>
                    </div>
                  </div>

                  {tempResume.aiSummary && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-emerald-100">
                      {tempResume.aiSummary}
                    </p>
                  )}

                  <button
                    onClick={() => handleConfirmApply(tempResume)}
                    disabled={applying}
                    className="button-primary w-full mt-2"
                  >
                    {applying ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Submit Application with Checked Resume</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Option B: Upload New Resume for ATS Check */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:border-indigo-300 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  ref={fileInputRef}
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="modal-resume-upload"
                />

                <label htmlFor="modal-resume-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-2 border border-indigo-100">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {newFile ? newFile.name : "Upload a New Resume to Check ATS Score"}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    Upload PDF or DOCX file to test fit for this specific job description
                  </span>
                </label>

                {newFile && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleUploadAndAnalyze}
                      disabled={analyzingResume}
                      className="button-secondary !py-2 !px-4 !text-xs font-bold"
                    >
                      {analyzingResume ? (
                        <span>Evaluating ATS Score...</span>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Check ATS Score & Job Fit</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-5 mt-6 border-t border-slate-100">
              <button onClick={handleCloseModal} className="button-secondary !py-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
