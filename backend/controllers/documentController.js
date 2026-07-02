import Document from "../models/Document.js";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { analyzeDocument } from "../utils/aiService.js";

// upload metadata (JSON, no file)
export const uploadMetadata = async(req,res)=>{
    try {
        const doc = await Document.create({
            name: req.body.name,
            category: req.body.category || "Contracts",
            linkedTo: req.body.linkedTo || "",
            uploader: req.body.uploader || "",
        });
        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

// upload
export const uploadDocument = async(req,res)=>{
    try {
        const doc = await Document.create({
            name: req.body.name || req.file.originalname,
            category: req.body.category || "Contracts",
            linkedTo: req.body.linkedTo || "",
            uploader: req.body.uploader || "",
            fileUrl: req.file.path,
        });
        res.status(201).json(doc);
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

// delete Document
export const deleteDocument = async(req,res)=>{
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({message:"Document deleted"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//pdf analyze
export const analyzeDoc = async(req,res)=>{
    try {
        const filePath = req.file.path;
        const buffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(buffer);
        const aiResult = await analyzeDocument(pdfData.text);
        let parsed;
        try {
            parsed = JSON.parse(aiResult);
        } catch {
            parsed = { raw: aiResult };
        }
        res.json({ analysis: parsed, text: pdfData.text.substring(0, 500) });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
