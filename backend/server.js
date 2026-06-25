import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();
// middleware
app.use(express.json());
app.use(cors());
//DB connect
connectDB();
//test route
app.get("/",(req,res)=>{
    res.send("CRM Backend Running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});