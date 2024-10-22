// src/app.ts
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { uploadExcel } from "./controller/candidateController";
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/candidates", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), uploadExcel);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
