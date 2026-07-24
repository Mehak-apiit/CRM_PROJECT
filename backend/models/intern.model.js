import mongoose from "mongoose";
const internSchema = new mongoose.Schema({
    //Basic Infor
    name: {type:String, required: true},
    email: {type: String,required:true,unique:true},
    phone: String,
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    // Internship Status
    internshipStatus: {
        type: String,
        enum: ["Ongoing","Dropped","Completed"],
        default: "Ongoing"
    },
   
    certificateIssued: {type: Boolean, default: false},
    certificateUrl: {type: String, default: null},
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
