import express from "express";
import formidable from "express-formidable";
import checkId from "../middleware/checkId.js";
import {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
} from "../controllers/productController.js";

import { authenticate, authorizedAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizedAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router
  .route("/:id/reviews")
  .post(authenticate, authorizedAdmin, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizedAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizedAdmin, removeProduct);

export default router;
