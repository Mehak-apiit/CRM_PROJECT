import express from "express";
const router = express.Router();
import{
    createEmployee,
    getEmployees,
    updatePerformance,
    markAttendance
} from "../controllers/employeeController";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
router.post("/",protect,createEmployee);
router.get("/",protect,getEmployees);
router.put("/:id/performance",protect,updatePerformance);
router.post("/:id/attendance",protect,markAttendance);
export default router;
