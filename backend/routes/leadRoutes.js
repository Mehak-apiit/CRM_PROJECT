import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
} from "../controllers/leadController.js";

const router = express.Router();

router.post("/", protect, createLead);
router.get("/", protect, authorizeRoles("admin"), getLeads);
router.get("/:id", protect, getLeadById);
router.put("/:id", protect, authorizeRoles("admin"), updateLead);
router.delete("/:id", protect, authorizeRoles("admin"), deleteLead);
router.put("/:id/assign", protect, authorizeRoles("admin"), assignLead);

export default router;