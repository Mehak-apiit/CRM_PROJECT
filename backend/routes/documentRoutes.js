import express from "express";
import {
  getAllDocuments,
  createDocumentMetadata,
  uploadDocument,
  deleteDocument,
  getMyDocuments,
} from "../controllers/documentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllDocuments);
router.post("/", protect, authorizeRoles("admin", "superAdmin"), createDocumentMetadata);
router.post("/upload", protect, authorizeRoles("admin", "superAdmin"), upload.single("file"), uploadDocument);
router.post("/upload-metadata", protect, authorizeRoles("admin", "superAdmin"), createDocumentMetadata);
router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteDocument);
router.get("/my", protect, getMyDocuments);

export default router;
