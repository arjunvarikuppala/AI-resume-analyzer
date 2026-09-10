import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  MapPin,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import { applyToJob, getEmployeeApplications } from "../services/applicationService";
import { getJobs } from "../services/jobService";
import { useResumeStore } from "../stores/resumeStore";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [applicationStatusMap, setApplicationStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const latestResume = useResumeStore((state) => state.latestResume);

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

  const handleApply = async (jobId) => {
    if (!latestResume) {
      alert("Please upload a resume in the Dashboard first to apply.");
      return;
    }

    setApplyingId(jobId);
    try {
      await applyToJob(jobId, latestResume._id);
      setApplicationStatusMap((prev) => ({ ...prev, [jobId]: "applied" }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (job.title || "").toLowerCase().includes(q);
    const locationMatch = (job.location || "").toLowerCase().includes(q);
    const descMatch = (job.description || "").toLowerCase().includes(q);
    const skillsMatch = Array.isArray(job.requiredSkills) && job.requiredSkills.some((s) => s.toLowerCase().includes(q));
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

  return (
    <div className="flex flex-col gap-8 pb-12">
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
            Browse Opportunities & Match Fit
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 max-w-2xl">
            When you apply with your active resume, our AI automatically calculates a semantic match score for the hiring manager.
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

        {!latestResume && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs font-medium text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Note:</strong> Please upload a resume from your Dashboard first before applying to roles.
            </span>
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
                      onClick={() => handleApply(job._id)}
                      disabled={applyingId === job._id || !latestResume}
                      className="button-primary w-full"
                    >
                      {applyingId === job._id ? (
                        <>
                          <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Apply with Active Resume</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;

