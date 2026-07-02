import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("superAdmin"), getUsers);
router.post("/", protect, authorizeRoles("superAdmin"), createUser);
router.put("/:id", protect, authorizeRoles("superAdmin"), updateUser);
router.delete("/:id", protect, authorizeRoles("superAdmin"), deleteUser);

export default router;
