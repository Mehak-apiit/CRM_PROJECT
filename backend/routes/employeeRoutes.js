import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getMyProfile
} from "../controllers/employee.controller.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


// Admin routes
router.post(
  "/",
  protect,
  authorizeRoles("admin", "superAdmin"),
  createEmployee
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "superAdmin"),
  getAllEmployees
);


// Employee route
router.get(
  "/me",
  protect,
  authorizeRoles("employee"),
  getMyProfile
);

export default router;