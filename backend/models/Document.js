import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    documentType: {
        type: String,
        enum: ["Aadhar","PAN","HighestQualification"],
        required: true
    },
    fileUrl: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "ownerModel",
        required: true
    },
    ownerModel: {
        type:String,
        enum: ["Employee","Intern"],
        required:true
    },
    ownerName: {
        type:String,
        required: true
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true});
documentSchema.index(
    {owner:1,documentType:1},
    {unique:true}
);
export default mongoose.model("Document",documentSchema);