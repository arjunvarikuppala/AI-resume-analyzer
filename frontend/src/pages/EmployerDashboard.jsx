import { useEffect, useState } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "../services/jobService";
import { useAuthStore } from "../stores/authStore";
import { uploadBulkResumes } from "../services/resumeService";

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
    employmentType: "full-time"
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
        requiredSkills: typeof newJob.requiredSkills === 'string' 
          ? newJob.requiredSkills.split(",").map(s => s.trim()).filter(Boolean)
          : newJob.requiredSkills
      };
      
      if (editingJobId) {
        await updateJob(editingJobId, jobData);
      } else {
        await createJob(jobData);
      }
      
      setShowModal(false);
      setEditingJobId(null);
      setNewJob({ title: "", description: "", requiredSkills: "", location: "", employmentType: "full-time" });
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
      requiredSkills: job.requiredSkills.join(", "),
      location: job.location,
      employmentType: job.employmentType
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
      
      // Sort successful results by Job Match score descending
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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading jobs...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="panel flex items-center justify-between">
        <div>
          <p className="section-title">Employer Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Your Job Postings</h1>
        </div>
        <button onClick={() => {
          setEditingJobId(null);
          setNewJob({ title: "", description: "", requiredSkills: "", location: "", employmentType: "full-time" });
          setShowModal(true);
        }} className="button-primary">
          Create New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="panel text-center py-12">
          <p className="text-slate-500">You haven't posted any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job._id} className="panel flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{job.title}</h3>
                    <p className="text-sm tracking-wide text-slate-500 uppercase mt-1">{job.employmentType} &bull; {job.location}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEditClick(job)} className="text-slate-400 hover:text-blue-600 p-1" title="Edit Job">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onClick={() => handleDeleteJob(job._id)} className="text-slate-400 hover:text-red-600 p-1" title="Delete Job">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 line-clamp-3">{job.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {job.requiredSkills.map(skill => (
                  <span key={skill} className="pill">{skill}</span>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <button 
                  onClick={() => {
                    setSelectedJob(job);
                    setShowBulkModal(true);
                    setBulkResults(null);
                    setBulkFiles([]);
                  }}
                  className="button-secondary w-full"
                >
                  Bulk Analyze Resumes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-ink mb-6">{editingJobId ? "Edit Job" : "Create New Job"}</h2>
            <form onSubmit={handleSaveJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Job Title</label>
                <input type="text" className="field mt-1" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input type="text" className="field mt-1" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Required Skills (comma separated)</label>
                <input type="text" className="field mt-1" placeholder="React, Node.js, MongoDB" required value={newJob.requiredSkills} onChange={e => setNewJob({...newJob, requiredSkills: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Employment Type</label>
                <select className="field mt-1" value={newJob.employmentType} onChange={e => setNewJob({...newJob, employmentType: e.target.value})}>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea className="field mt-1 min-h-[100px]" required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="button-secondary">Cancel</button>
                <button type="submit" className="button-primary">{editingJobId ? "Save Changes" : "Create Job"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-[32px] bg-white p-8 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-ink">Bulk Resume Analyzer</h2>
                <p className="text-slate-500 mt-1">Analyzing for: {selectedJob?.title}</p>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-ink">
                ✕
              </button>
            </div>

            {!bulkResults ? (
              <form onSubmit={handleBulkUpload} className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-50">
                  <input 
                    type="file" 
                    multiple 
                    accept=".pdf,.docx" 
                    onChange={e => setBulkFiles(e.target.files)} 
                    className="hidden" 
                    id="bulk-upload" 
                  />
                  <label htmlFor="bulk-upload" className="cursor-pointer flex flex-col items-center">
                    <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <span className="text-lg font-medium text-ink">Click to select resumes</span>
                    <span className="text-sm text-slate-500 mt-1">PDF or DOCX (Max 20 files)</span>
                  </label>
                  {bulkFiles && bulkFiles.length > 0 && (
                    <div className="mt-6 text-left border-t border-slate-200 pt-6">
                      <p className="font-medium text-ink mb-2">Selected ({bulkFiles.length} files):</p>
                      <ul className="text-sm text-slate-600 max-h-32 overflow-y-auto list-disc pl-5">
                        {Array.from(bulkFiles).map(f => (
                          <li key={f.name}>{f.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowBulkModal(false)} className="button-secondary" disabled={bulkUploading}>Cancel</button>
                  <button type="submit" className="button-primary flex items-center gap-2" disabled={bulkUploading || !bulkFiles.length}>
                    {bulkUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : "Analyze Resumes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {bulkResults.failed?.length > 0 && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                    <h3 className="font-semibold mb-2">Failed Files ({bulkResults.failed.length})</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {bulkResults.failed.map((f, i) => (
                        <li key={i}>{f.fileName}: {f.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {bulkResults.successful?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-ink mb-4">Ranked Candidates ({bulkResults.successful.length})</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500 tracking-wider">
                            <th className="p-4 font-medium">Rank</th>
                            <th className="p-4 font-medium">File Name</th>
                            <th className="p-4 font-medium">ATS Score</th>
                            <th className="p-4 font-medium">Job Match</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bulkResults.successful.map((result, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-semibold text-ink">#{index + 1}</td>
                              <td className="p-4 font-medium text-ink">{result.fileName}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                  result.resume.atsScore >= 80 ? "bg-green-100 text-green-800" :
                                  result.resume.atsScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {result.resume.atsScore}%
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                  result.resume.jobMatchScore >= 80 ? "bg-green-100 text-green-800" :
                                  result.resume.jobMatchScore >= 60 ? "bg-blue-100 text-blue-800" :
                                  result.resume.jobMatchScore >= 40 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
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
                  <button onClick={() => {
                    setBulkResults(null);
                    setBulkFiles([]);
                  }} className="button-secondary">
                    Analyze More
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
