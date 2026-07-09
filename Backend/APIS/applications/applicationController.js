import Application from "../../Models/Application.js";
import Job from "../../Models/Job.js";
import Resume from "../../Models/Resume.js";
import { calculateSemanticMatch } from "../../Services/geminiService.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

export const applyToJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "employee") {
    throw new ApiError(403, "Only employees can apply for jobs.");
  }

  const { jobId, resumeId } = req.body;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found.");

  const resume = await Resume.findById(resumeId);
  if (!resume) throw new ApiError(404, "Resume not found.");
  
  if (resume.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only apply with your own resume.");
  }

  const existingApp = await Application.findOne({ jobId, employeeId: req.user._id });
  if (existingApp) {
    throw new ApiError(400, "You have already applied for this job.");
  }

  const matchScore = await calculateSemanticMatch(resume.resumeText, job.description);

  const application = await Application.create({
    jobId,
    resumeId,
    employeeId: req.user._id,
    matchScore,
    status: "applied"
  });

  res.status(201).json({ message: "Applied successfully.", application });
});

export const getApplicationsForEmployer = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can view job applicants.");
  }

  const jobs = await Job.find({ employerId: req.user._id }).select("_id");
  const jobIds = jobs.map(j => j._id);

  const applications = await Application.find({ jobId: { $in: jobIds } })
    .populate("jobId", "title location employmentType")
    .populate("employeeId", "email")
    .populate("resumeId", "fileName score atsScore aiSummary resumeText jobMatchScore")
    .sort({ matchScore: -1 });

  res.status(200).json({ applications });
});

export const getEmployeeApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "employee") {
    throw new ApiError(403, "Only employees can view their applications.");
  }

  const applications = await Application.find({ employeeId: req.user._id })
    .populate("jobId", "title description location employmentType")
    .sort({ createdAt: -1 });

  res.status(200).json({ applications });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can update application status.");
  }

  const { status } = req.body;
  if (!["applied", "shortlisted", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status.");
  }

  const application = await Application.findById(req.params.id).populate("jobId");
  if (!application) throw new ApiError(404, "Application not found.");

  if (application.jobId.employerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update applications for your own jobs.");
  }

  application.status = status;
  await application.save();

  res.status(200).json({ message: "Application status updated.", application });
});
