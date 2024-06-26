import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCategoryController,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategoryController,
} from "../controllers/category.controller.js";

const router = express();

//routes
// create catrgory
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// all categories
router.get("/categories", getAllCategories);

// single categories
router.get("/single-category/:slug", getSingleCategory);

// delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

export default router;
