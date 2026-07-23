import Document from "../models/Document.js";
import Employee from "../models/Employee.js";
import Intern from "../models/intern.model.js";
import mongoose from "mongoose";
export const uploadDocument = async (req,res) =>{
    try {
        const {documentType,ownerId,ownerModel} = req.body;
        if(!req.file){
            return res.status(400).json({
                message:"Please upload a PDF file"
            });
        }
        let ownerData;
        
        if (ownerModel === "Employee"){
            ownerData = await Employee.findById(new mongoose.Types.ObjectId(ownerId));
            
        }
        else{
            ownerData = await Intern.findById(new mongoose.Types.ObjectId(ownerId));;
        }
        if(!ownerData){
            return res.status(400).json({message:"Owner not found"});
        }
        const doc = await Document.create({
            documentType,
            fileUrl:req.file.path,
            owner:ownerId,
            ownerModel,
            ownerName: ownerData.name,
            uploadedBy: req.user._id
        });
        res.status(201).json(doc);
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({
                message: "Document already uploaded"
            });
        }
        res.status(500).json({message:error.message});
    }
};
// Get My documents controller
export const getMyDocuments = async(req,res) =>{
    try{
        let ownerId;
        let ownerModel;
        if(req.user.role === "employee"){
            const emp = await Employee.findOne({userId:req.user._id});
            if(!emp) return res.status(404).json({message:"Employee not found"});
            ownerId = emp._id;
            ownerModel = "Employee";
        }
        if(req.user.role === "intern")
        {
            const intern = await Intern.findOne({userId:req.user._id});
            if(!intern) return res.status(404).json({message:"Intern not found"});
            ownerId = intern._id;
            ownerModel = "Intern";
        }
        const docs = await Document.find({
            owner: ownerId,
            ownerModel
        });
        res.json(docs);
    } catch(error){
        res.status(500).json({message:error.message});
    }
};