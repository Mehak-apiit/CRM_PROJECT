import express from "expres";
const router = express.Router();
import {
    createInvoice,
    getInvoices,
    updateInvoice
} from "../controllers/invoiceController";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
router.post("/",protect,createInvoice);
router.get("/",protect,getInvoices);
router.put("/:id",protect,updateInvoice);
