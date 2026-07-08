import express from "express";
import {
    createIntern,
    getAllInterns,
    updateInternsStatus,
    issueCertificate
} from "../controllers/intern.controller.js";
 const router = express.Router();
 router.post("/",createIntern);
 router.get("/",getAllInterns);
 router.patch("/:id/status",updateInternsStatus);
 router.patch("/:id/certificate",issueCertificate);
 export default router;