import express from "express";
import {
    createIntern,
    getAllInterns,
    updateIntern,
    updateInternsStatus,
    issueCertificate,
    downloadMyCertificate,
    getMyCertificate,
    deleteIntern
} from "../controllers/intern.controller.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import uploadCertificate from "../middleware/certUploadMiddleware.js";

const router = express.Router();

router.get(
"/my-certificate",
protect,
authorizeRoles("intern"),
getMyCertificate
);
router.post("/", protect, authorizeRoles("admin", "superAdmin"), createIntern);
router.get("/", protect, getAllInterns);
router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), updateIntern);
router.patch("/:id/status", protect, authorizeRoles("admin", "superAdmin"), updateInternsStatus);
router.patch("/:id/certificate", protect, authorizeRoles("admin", "superAdmin"), uploadCertificate.single("certificate"), issueCertificate);

router.get(
    "/my-certificate/download",
    protect,
    authorizeRoles("intern"),
    downloadMyCertificate
);

router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteIntern);

export default router;
