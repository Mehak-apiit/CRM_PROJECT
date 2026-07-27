import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getMyProfile
} from "../controllers/employee.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Admin routes
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  createEmployee
);

router.get(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  getAllEmployees
);


// Employee route
router.get(
  "/me",
  protect,
  authorize("employee"),
  getMyProfile
);

export default router;