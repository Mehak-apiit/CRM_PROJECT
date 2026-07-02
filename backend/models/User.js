import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        role:{
            type:String,
            enum:["superAdmin","admin"],
            default:"admin"
        },
        status:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active"
        }
    },
    {timestamps:true}

);
export default mongoose.model("User",userSchema);
