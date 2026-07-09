import { Router } from "express";
import { applyToJob, getApplicationsForEmployer, getEmployeeApplications, updateApplicationStatus } from "./applicationController.js";
import authMiddleware from "../../middelWares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", applyToJob);
router.get("/employer", getApplicationsForEmployer);
router.get("/employee", getEmployeeApplications);
router.put("/:id/status", updateApplicationStatus);

export default router;
