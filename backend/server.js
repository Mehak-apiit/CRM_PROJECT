import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";


dotenv.config();
const app = express();
// middleware
app.use(express.json());
app.use(cors());
//DB connect
connectDB();
//routes
app.use("/api/auth",authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/invoices",invoiceRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});