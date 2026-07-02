import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    source: String,

    status: {
      type: String,
      enum: ["New", "In-Progress", "Converted", "Rejected"],
      default: "New",
    },

    assignedTo: String,

    notes: String,

    score: {
      type: Number,
      default: 0,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
