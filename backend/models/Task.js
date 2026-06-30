import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    assignedTo: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending",
    },
    dueDate:Date,


},{timestamps:true});
export default mongoose.model("Task",taskSchema);