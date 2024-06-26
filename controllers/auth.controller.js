import UserModel from "../models/User.model.js";
import { comparePassword, hashPassword } from "../helpers/auth.helper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
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
    if (!answer) {
      return res.status(406).send({ message: "Answer is required" });
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
      answer,
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
    // console.log(email, password);
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
        address: user.address,
        role: user.role,
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

// forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }

    //check
    const user = await UserModel.findOneAndUpdate({ email, answer });
    debugger;

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await UserModel.findOneAndUpdate({ email }, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset Sucessfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
      error,
    });
  }
};

export const testController = async (req, res) => {
  try {
    res.send({ message: "Protected Route" });
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
