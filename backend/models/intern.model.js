import mongoose from "mongoose";
import { Certificates } from "openai/resources/admin/organization/certificates.js";
const internSchema = new mongoose.Schema({
    //Basic Infor
    name: {type:String, required: true},
    email: {type: String,required:true,unique:true},
    phone: String,
    // Internship Status
    internshipStatus: {
        type: String,
        enum: ["Ongoing","Dropped","Completed"],
        default: "Ongoing"
    },
    // Letters & Certificates
    CertificateIssued: {type: Boolean, default: false},
    experienceLetterIssued: {type:Boolean, default: false},
    joiningLetterIssued: {type: Boolean, default: false},

    issueDate: Date,
    //Qualification
    highestQualification: String,
    college: String,
    graduationYear: Number,
    department: String,

    //Tech Stack
    techStack: [String],

    //Relations
    assignedProjects: [
        {type: mongoose.Schema.Types.ObjectId,ref: "Project"}
    ],
    assignedTasks: [
        {type: mongoose.Schema.Types.ObjectId,ref: "Task"}
    ],

},{timestamps: true});
export default mongoose.model("Intern",internSchema);