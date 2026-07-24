import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Resume", "Offer Letter", "Contract", "Certificate", "Invoices", "Contracts", "Identity Proofs"],
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
