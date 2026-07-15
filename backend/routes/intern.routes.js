import express from "express";
import {
    createIntern,
    getAllInterns,
    updateIntern,
    updateInternsStatus,
    issueCertificate,
    deleteIntern
} from "../controllers/intern.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
 const router = express.Router();
 router.post("/", protect, authorizeRoles("admin", "superAdmin"), createIntern);
 router.get("/", protect, getAllInterns);
 router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), updateIntern);
 router.patch("/:id/status", protect, authorizeRoles("admin", "superAdmin"), updateInternsStatus);
 router.patch("/:id/certificate", protect, authorizeRoles("admin", "superAdmin"), issueCertificate);
 router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteIntern);
 export default router;
