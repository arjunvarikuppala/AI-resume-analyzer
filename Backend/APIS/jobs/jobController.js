import Job from "../../Models/Job.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";

export const createJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can create jobs.");
  }

  const { title, description, requiredSkills, location, employmentType } = req.body;

  const job = await Job.create({
    employerId: req.user._id,
    title,
    description,
    requiredSkills: requiredSkills || [],
    location,
    employmentType,
  });

  res.status(201).json({ message: "Job created successfully.", job });
});

export const getJobs = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role === "employer") {
    query.employerId = req.user._id;
  }

  const jobs = await Job.find(query).sort({ createdAt: -1 });
  res.status(200).json({ jobs });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found.");
  }
  res.status(200).json({ job });
});

export const updateJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can update jobs.");
  }

  let job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own jobs.");
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ message: "Job updated successfully.", job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can delete jobs.");
  }

  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  if (job.employerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own jobs.");
  }

  await Job.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Job deleted successfully." });
});
