import { useEffect, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CheckCircle2,
  Edit3,
  FileCheck2,
  FileText,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

import { createJob, deleteJob, getJobs, updateJob } from "../services/jobService";
import { uploadBulkResumes } from "../services/resumeService";
import { useAuthStore } from "../stores/authStore";

const EmployerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Bulk upload state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    location: "",
    employmentType: "full-time",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...newJob,
        requiredSkills:
          typeof newJob.requiredSkills === "string"
            ? newJob.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
            : newJob.requiredSkills,
      };

      if (editingJobId) {
        await updateJob(editingJobId, jobData);
      } else {
        await createJob(jobData);
      }

      setShowModal(false);
      setEditingJobId(null);
      setNewJob({
        title: "",
        description: "",
        requiredSkills: "",
        location: "",
        employmentType: "full-time",
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(editingJobId ? "Failed to update job" : "Failed to create job");
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job._id);
    setNewJob({
      title: job.title,
      description: job.description,
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(", ") : "",
      location: job.location,
      employmentType: job.employmentType,
    });
    setShowModal(true);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFiles || bulkFiles.length === 0) return alert("Please select files first");
    if (!selectedJob) return alert("Please select a job description");

    setBulkUploading(true);
    try {
      const data = await uploadBulkResumes(bulkFiles, selectedJob.description);

      if (data.results && data.results.successful) {
        data.results.successful.sort((a, b) => b.resume.jobMatchScore - a.resume.jobMatchScore);
      }

      setBulkResults(data.results);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze resumes");
    } finally {
      setBulkUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm font-semibold text-slate-500">Loading employer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="pill-indigo">
              <Building2 className="h-3.5 w-3.5" />
              {user?.companyName || "Employer Portal"}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {jobs.length} Active {jobs.length === 1 ? "Posting" : "Postings"}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Postings & Candidate Pipeline
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingJobId(null);
            setNewJob({
              title: "",
              description: "",
              requiredSkills: "",
              location: "",
              employmentType: "full-time",
            });
            setShowModal(true);
          }}
          className="button-primary shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
            <Briefcase className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Job Postings Yet</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Create your first job listing to start receiving candidates and running bulk ATS matching.
          </p>
          <button
            onClick={() => {
              setEditingJobId(null);
              setNewJob({
                title: "",
                description: "",
                requiredSkills: "",
                location: "",
                employmentType: "full-time",
              });
              setShowModal(true);
            }}
            className="button-primary mt-5"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First Job</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
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

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleEditClick(job)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      title="Edit Job"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(job.requiredSkills) &&
                    job.requiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 4 && (
                    <span className="inline-flex rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-400">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowBulkModal(true);
                    setBulkResults(null);
                    setBulkFiles([]);
                  }}
                  className="button-secondary w-full !text-xs font-bold"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Bulk Match Resumes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="pill-indigo !text-[10px]">Job Management</span>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {editingJobId ? "Edit Job Posting" : "Create New Job Posting"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Job Title
                </label>
                <input
                  type="text"
                  className="field mt-1.5"
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Location
                  </label>
                  <input
                    type="text"
                    className="field mt-1.5"
                    placeholder="e.g. Remote / New York"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Employment Type
                  </label>
                  <select
                    className="field mt-1.5"
                    value={newJob.employmentType}
                    onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  className="field mt-1.5"
                  placeholder="React, TypeScript, Node.js, GraphQL"
                  required
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Job Description & Qualifications
                </label>
                <textarea
                  className="field mt-1.5 min-h-[110px] text-xs font-mono"
                  placeholder="Paste responsibilities, experience criteria, and project expectations..."
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  {editingJobId ? "Save Changes" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Resume Analyzer Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 md:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="pill-indigo !text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  AI Bulk Candidate Screening
                </span>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  Bulk Resume Matching
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Screening for role:{" "}
                  <strong className="text-slate-800">{selectedJob?.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!bulkResults ? (
              <form onSubmit={handleBulkUpload} className="mt-6 space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center bg-slate-50/70 hover:border-indigo-300 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx"
                    onChange={(e) => setBulkFiles(e.target.files)}
                    className="hidden"
                    id="bulk-upload"
                  />
                  <label htmlFor="bulk-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-base font-bold text-slate-900">
                      Click to choose candidate resumes
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Upload multiple PDF or DOCX files (Up to 20 resumes)
                    </span>
                  </label>

                  {bulkFiles && bulkFiles.length > 0 && (
                    <div className="mt-5 text-left border-t border-slate-200 pt-4">
                      <p className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                        Selected Files ({bulkFiles.length}):
                      </p>
                      <div className="max-h-36 overflow-y-auto space-y-1 pr-2">
                        {Array.from(bulkFiles).map((f) => (
                          <div
                            key={f.name}
                            className="flex items-center gap-2 rounded-lg bg-white p-2 text-xs font-medium text-slate-700 border border-slate-200/80"
                          >
                            <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                            <span className="truncate">{f.name}</span>
                            <span className="ml-auto text-[10px] text-slate-400">
                              {(f.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="button-secondary"
                    disabled={bulkUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={bulkUploading || !bulkFiles.length}
                  >
                    {bulkUploading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>Screening {bulkFiles.length} Candidates...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Run AI Ranking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-6">
                {bulkResults.failed?.length > 0 && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-xs">
                    <p className="font-bold mb-1">
                      Failed Files ({bulkResults.failed.length}):
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {bulkResults.failed.map((f, i) => (
                        <li key={i}>
                          {f.fileName}: {f.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {bulkResults.successful?.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      Ranked Candidates ({bulkResults.successful.length})
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 uppercase text-slate-500 font-bold tracking-wider">
                            <th className="p-3">Rank</th>
                            <th className="p-3">File Name</th>
                            <th className="p-3">ATS Score</th>
                            <th className="p-3">JD Match Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bulkResults.successful.map((result, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-extrabold text-slate-900">#{index + 1}</td>
                              <td className="p-3 font-medium text-slate-800">{result.fileName}</td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                                    result.resume.atsScore >= 80
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : result.resume.atsScore >= 60
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  {result.resume.atsScore}%
                                </span>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold ${
                                    result.resume.jobMatchScore >= 80
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : result.resume.jobMatchScore >= 60
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  {result.resume.jobMatchScore}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setBulkResults(null);
                      setBulkFiles([]);
                    }}
                    className="button-secondary"
                  >
                    Analyze Another Batch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;

