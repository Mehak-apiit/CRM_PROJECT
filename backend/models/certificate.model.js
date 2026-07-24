import mongoose from "mongoose";
const certificateSchema = new mongoose.Schema({
    internId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Inern",
        required: true
    },
    certificateUrl:{
        type:String
    },
    issuedAt:{
        type:Date,
        default:Date.now
    },
    issuedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
export default mongoose.model("Certificate",certificateSchema);