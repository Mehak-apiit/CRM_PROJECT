import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Invoices", "Identity Proofs", "Contracts"],
        default: "Contracts"
    },
    linkedTo: String,
    uploader: String,
    fileUrl: String,
},{timestamps:true});
export default mongoose.model("Document",documentSchema);
