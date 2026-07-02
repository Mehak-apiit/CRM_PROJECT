import express from "express";
const router = express.Router();

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  updatePerformance,
  markAttendance,
} from "../controllers/employeeController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

router.post("/", protect, authorizeRoles("admin", "superAdmin"), createEmployee);
router.get("/", protect, getEmployees);
router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), updateEmployee);
router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteEmployee);
router.put("/:id/performance", protect, authorizeRoles("admin", "superAdmin"), updatePerformance);
router.post("/:id/attendance", protect, markAttendance);

export default router;
