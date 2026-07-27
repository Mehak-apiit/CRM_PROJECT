import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },


    category:{
        type:String,
        enum:[
            "Aadhar Card",
            "PAN Card",
            "Highest Qualification",
            "Internship Certificate"
        ],
        required:true,
    },


    fileUrl:{
        type:String,
        required:true,
    },


    owner:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"ownerModel",
        required:true
    },


    ownerModel:{
        type:String,
        enum:[
            "Employee",
            "Intern"
        ],
        required:true
    },


    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }


},{timestamps:true});

export default mongoose.model("Document", documentSchema);
