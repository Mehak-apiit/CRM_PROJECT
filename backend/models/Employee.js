import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "employee"
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    attendance: [
        {
            date: { type: Date, default: Date.now },
            status: {
                type: String,
                enum:["present","absent"]
            },
        },
    ],
    leaveBalance: {type:Number,default:10},
    performanceScore:{type:Number,default:0},
},{timestamps:true});
export default mongoose.model("Employee",employeeSchema);
