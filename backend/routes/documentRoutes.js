import express from "express";
const router = express.Router();

import {
  uploadDocument,
  uploadMetadata,
  getDocuments,
  deleteDocument,
  analyzeDoc,
} from "../controllers/documentController.js";

import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post("/upload", protect, upload.single("file"), uploadDocument);
router.post("/upload-metadata", protect, uploadMetadata);
router.get("/", protect, getDocuments);
router.delete("/:id", protect, deleteDocument);
router.post("/analyze", protect, upload.single("file"), analyzeDoc);

export default router;
