import Document from "../models/Document.js"
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { analyzeDocument } from "../utils/aiService.js";
// upload
export const uploadDocument = async(req,res)=>{
    try {
        const doc = await Document.create({
            type:req.body.type,
            fileUrl: req.file.path,
        });
        res.json(doc);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};
// get Documents
export const getDocuments = async(req,res)=>{
    try {
        const docs = await Document.find();
        res.json(docs);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
//pdf analyze
export const analyzeDoc = async(req,res)=>{
    try {
        const filePath = req.file.path;
        const buffer = fs.readFileSync(filePath);
        const pdfData = await PDFParse(buffer);
        const aiResult = await analyzeDocument(pdfData.text);
        //Safe json parse**********************************
        
    } catch (error) {
        res.status(500).json({message:error.messaage});
        
    }
};