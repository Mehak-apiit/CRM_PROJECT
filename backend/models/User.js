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
            requierd:true,
            minlength:6
        },
        role:{
            type:String,
            enum:["admin","employee"],
            default:"employee"
        }
    },
    {timestamps:true}

);
export default mongoose.model("User",userSchema);