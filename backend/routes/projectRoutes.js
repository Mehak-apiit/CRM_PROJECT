import express from "express";
const router = express.Router();
import {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
} from "../middleware/authMiddleware";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
router.post("/",protect,createProject);
router.get("/",protect,getProjects);
router.put("/:id",protect,updateProject);
router.post("/:id",protect,deleteProject);
export default router;