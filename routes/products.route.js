import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getSingleProductsController,
  productPhotoController,
  updatePdoductController,
} from "../controllers/products.controller.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

// routes

// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
);

// update product
router.post(
  "/update-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updatePdoductController
);

// get products
router.get("/get-products", getAllProductsController);

// single product
router.get("/get-products/:slug", getSingleProductsController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

// delete product
router.delete("/product", deleteProductController);

export default router;
