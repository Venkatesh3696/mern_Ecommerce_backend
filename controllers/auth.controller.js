import UserModel from "../models/User.model.js";
import { comparePassword, hashPassword } from "../helpers/auth.helper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name) {
      return res.status(406).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(406).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(406).send({ message: "Password is required" });
    }
    if (!address) {
      return res.status(406).send({ message: "Address is required" });
    }
    if (!phone) {
      return res.status(406).send({ message: "Phone is required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .send({ success: false, message: "User already exists. please Login" });
    }
    const hashedPassword = await hashPassword(password);

    const user = await new UserModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: fals,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res
        .status(406)
        .send({ error: "invalid Email email or password!" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }
    // token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "logged in Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error in login",
      error,
    });
  }
};

export const testController = async (req, res) => {
  res.send({ message: "Protected Route" });
};
