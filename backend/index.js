// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

// utils
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// register routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
