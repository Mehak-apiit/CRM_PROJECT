import mongoose from "mongoose";
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
// <<<<<<< HEAD
    CertificateIssued: {type: Boolean, default: false},
    
// =======
//     certificateIssued: {type: Boolean, default: false},
//     experienceLetterIssued: {type:Boolean, default: false},
//     joiningLetterIssued: {type: Boolean, default: false},
// >>>>>>> b5a1ed3e7473ff90081e28b9fb00861f15ccfd80

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
