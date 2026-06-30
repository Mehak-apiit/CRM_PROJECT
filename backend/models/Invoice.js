import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema({
    invoiceNumber:{
        type:String,
        unique:true
    },
    clientName:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    dueDate:{
        type:Date,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["paid","pending","overdue"],
        default:"pending"
    }
},{timestamps:true});

//Update the overdue automatically...........................................................
export default mongoose.model("Invoice",invoiceSchema);