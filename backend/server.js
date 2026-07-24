import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import seedUsers from "./utils/seed.js";
import internRoutes from "./routes/intern.routes.js";
import documentRoutes from "./routes/documentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts, please try again later." },
});
app.use("/api/auth/login", authLimiter);

// Body parser with size limit
app.use(express.json({ limit: "5mb" }));

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5000",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
const certsDir = path.join(uploadsDir, "certificates");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// DB connect + seed
const start = async () => {
  await connectDB();
  await seedUsers();
};
start();

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve uploads
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interns", internRoutes);

// 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// SPA fallback - serve index.html for non-API routes
app.use((req, res) => {
  if (req.method === "GET") {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
