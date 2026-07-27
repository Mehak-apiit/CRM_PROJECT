import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel"
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ["Intern", "Employee"]
    },
    documentType: {
      type: String,
      required: true,
      enum: ["aadhaar", "pan", "qualification"]
    },
    documentUrl: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);