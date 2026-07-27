import express from "express";

import { 
  getDashboardStats 
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();


router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin","superAdmin"),
  getDashboardStats
);


export default router;