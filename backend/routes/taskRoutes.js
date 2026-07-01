import express from "express";
const router = express.Router();

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTask);

export default router;