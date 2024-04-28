import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();

connectDB();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to e commerce app!" });
});

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
