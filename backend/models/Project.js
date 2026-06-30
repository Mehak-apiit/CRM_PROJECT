import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    clientName:{
        type:String,
        required:true
    },
    team: [{
        type:mongoose.Schema.Types.ObjectId,ref:"User"

    }],
    status:{
        type:String,
        enum:["active","completed"],
        default:"active",
    },
    deadline:Date,
},{timestamps:true});
export default mongoose.model("Project", projectSchema);