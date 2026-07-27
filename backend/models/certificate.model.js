import mongoose from "mongoose";
const certificateSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intern",
        required: true
    },
    certificateUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ["Issued", "Revoked"],
        default: "Issued"
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});
export default mongoose.model("Certificate", certificateSchema);