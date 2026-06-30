import mongoose from "mongoose";
export const documentSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:["contract","invoice","nda","agreement"],
    },
    fileUrl: String,
    clientName: String,
    expiryDate: Date,
    amount:Number,
    importantClause: String,
},{timestamps:true});
export default mongoose.model("Document",documentSchema);