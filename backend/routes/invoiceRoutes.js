import express from "express";
const router = express.Router();

import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

router.post("/", protect, authorizeRoles("admin", "superAdmin"), createInvoice);
router.get("/", protect, getInvoices);
router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), updateInvoice);
router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteInvoice);

export default router;
