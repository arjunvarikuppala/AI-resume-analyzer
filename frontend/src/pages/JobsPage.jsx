import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import { applyToJob, getEmployeeApplications } from "../services/applicationService";
import { useResumeStore } from "../stores/resumeStore";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
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
        getEmployeeApplications().catch(() => []) // Catch in case they aren't logged in as employee or error
      ]);
      setJobs(jobsData);
      
      const statusMap = {};
      applicationsData.forEach(app => {
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
      alert("Applied successfully!");
      setApplicationStatusMap(prev => ({ ...prev, [jobId]: "applied" }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading open jobs...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="panel">
        <p className="section-title">Open Opportunities</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Browse Jobs</h1>
        <p className="mt-3 text-sm text-slate-600">Find the right role for your skills. When you apply, the employer will see how well your resume matches the job description.</p>
        
        {!latestResume && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            <strong>Note:</strong> You need to upload a resume on your dashboard before you can apply to jobs.
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="panel text-center py-12 text-slate-500">No jobs posted yet. Check back later!</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map(job => (
            <div key={job._id} className="panel flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-ink">{job.title}</h3>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {job.employmentType}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 mt-1">{job.location}</p>
                <p className="mt-4 text-sm text-slate-600 line-clamp-3">{job.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="pill">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                {(() => {
                  const status = applicationStatusMap[job._id];
                  if (status === 'shortlisted') {
                    return (
                      <div className="w-full text-center py-2 px-4 rounded-full font-bold text-sm bg-emerald-100 text-emerald-800">
                        Shortlisted 🎉
                      </div>
                    );
                  }
                  if (status === 'rejected') {
                    return (
                      <div className="w-full text-center py-2 px-4 rounded-full font-bold text-sm bg-rose-100 text-rose-800">
                        Not Selected
                      </div>
                    );
                  }
                  if (status === 'applied') {
                    return (
                      <button disabled className="w-full button-secondary opacity-70 cursor-not-allowed">
                        Applied
                      </button>
                    );
                  }
                  
                  return (
                    <button 
                      onClick={() => handleApply(job._id)} 
                      disabled={applyingId === job._id}
                      className="button-primary w-full"
                    >
                      {applyingId === job._id ? "Applying..." : "Apply Now"}
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
