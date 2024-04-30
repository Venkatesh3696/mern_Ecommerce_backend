import express from "express";
import {
  registerController,
  loginController,
  testController,
} from "../controllers/auth.controller.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

//register || POST
router.post("/register", registerController);

// login || POST
router.post("/login", loginController);

// test route
router.get("/test", requireSignIn, isAdmin, testController);

// protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
