import express from "express";
const router = express.Router();
import {
    createTask,
    getTasks,
    updateTasks,
    deleteTask
} from "../controllers/taskController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
router.post("/",protect,createTask);
router.get("/",protect,getTasks);
router.put("/:id",protect,updateTask);
router.post("/:id",protect,deleteTask);
export default router;