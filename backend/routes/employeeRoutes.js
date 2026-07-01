import express from "express";
const router = express.Router();

import {
  createEmployee,
  getEmployees,
  updatePerformance,
  markAttendance
} from "../controllers/employeeController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

router.post("/", protect, authorizeRoles("admin"), createEmployee);
router.get("/", protect, authorizeRoles("admin"), getEmployees);
router.put("/:id/performance", protect, authorizeRoles("admin"), updatePerformance);
router.post("/:id/attendance", protect, markAttendance);

export default router;