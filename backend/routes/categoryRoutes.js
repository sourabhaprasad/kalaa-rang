import express from "express";
import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").post(authenticate, authorizedAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizedAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizedAdmin, deleteCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
