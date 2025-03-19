import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import path from "path";
import { fileURLToPath } from "url"; // For ES module path handling

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection setup
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
};

// API routes
app.use("/api/user", UserRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Serve React build folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello developers from GFG" });
});

// For any route that's not an API, serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Start server
const startServer = async () => {
  try {
    connectDB();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
    console.log("JWT secret:", process.env.JWT);
  } catch (error) {
    console.log(error);
  }
};

startServer();
