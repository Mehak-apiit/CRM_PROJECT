import express from "express";
import {uploadDocument,getMyDocuments} from "../controllers/documentController.js";
import {protect,authorizeRoles} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();
// ADMIN UPLOAD
router.post(
  "/upload",
  protect,
  authorizeRoles("admin","superAdmin"),
  upload.single("file"),
  uploadDocument

);
// EMPLOYEE/INTERN VIEW
router.get(
  "/my",
  protect,
  authorizeRoles("employee","intern"),
  getMyDocuments
);
export default router;