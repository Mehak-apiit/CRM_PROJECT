import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Aadhar Card", "PAN Card", "Highest Qualification", "Internship Certificate"],
        required: true,
    },
    linkedTo: {
        type: String,
        default: "",
    },
    uploader: {
        type: String,
        default: "",
    },
    fileUrl: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "ownerModel",
    },
    ownerModel: {
        type: String,
        enum: ["Employee", "Intern"],
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
