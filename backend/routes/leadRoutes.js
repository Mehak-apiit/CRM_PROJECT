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

// Only logged in users
router.post("/", protect, createLead);

// Only admin can see all leads
router.get("/", protect, authorizeRoles("admin"), getLeads);

// Logged in users can view single lead
router.get("/:id", protect, getLeadById);

// Only admin can update/delete
router.put("/:id", protect, authorizeRoles("admin"), updateLead);
router.delete("/:id", protect, authorizeRoles("admin"), deleteLead);

// Only admin can assign
router.put("/:id/assign", protect, authorizeRoles("admin"), assignLead);

export default router;