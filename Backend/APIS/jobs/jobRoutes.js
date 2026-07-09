import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "./jobController.js";
import authMiddleware from "../../middelWares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
