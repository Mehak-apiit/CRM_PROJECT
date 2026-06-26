import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
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
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});