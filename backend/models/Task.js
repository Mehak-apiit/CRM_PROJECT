import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    assignedTo: {
        type: String,
        default: ""
    },
    project:{
        type: String,
        default: ""
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending",
    },
    dueDate:Date,


},{timestamps:true});
export default mongoose.model("Task",taskSchema);