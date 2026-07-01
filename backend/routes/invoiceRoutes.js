import express from "express";
const router = express.Router();

import {
  createInvoice,
  getInvoices,
  updateInvoice
} from "../controllers/invoiceController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

router.post("/", protect, authorizeRoles("admin"), createInvoice);
router.get("/", protect, getInvoices);
router.put("/:id", protect, authorizeRoles("admin"), updateInvoice);

export default router;