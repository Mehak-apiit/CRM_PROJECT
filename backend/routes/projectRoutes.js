import express from "express";
const router = express.Router();

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

router.post("/", protect, authorizeRoles("admin", "superAdmin"), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), updateProject);
router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteProject);

export default router;