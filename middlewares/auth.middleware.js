import JWT from "jsonwebtoken";
import UserModel from "../models/User.model.js";

// protected routes token base

export const requireSignIn = async (req, res, next) => {
  try {
    const decoded = await JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    console.log("decoded=>>", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    console.log("in isAdmin");
    const user = await UserModel.findById(req.user._id);
    if (user.role !== 1) {
      console.log("is admin");
      return res.send({
        success: false,
        message: "Admin resource access denied",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
    });
  }
};
