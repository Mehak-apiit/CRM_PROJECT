import Intern from "../models/intern.model.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Certificate from "../models/certificate.model.js";
import Document from "../models/Document.js";
import path from "path";
import fs from "fs";
//Create Intern
export const createIntern = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            college,
            phone,
            department,
            highestQualification,
            graduationYear,
            internshipStatus,
        } = req.body;
        const hashedPassword = await bcrypt.hash(password || "intern123",10);
         const intern = await Intern.create({
            name,
            email,
            phone,
            college,
            department,
            highestQualification,
            graduationYear,
            internshipStatus,
        });
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role: "intern"
        })
        intern.userId = user._id;
        await intern.save();
       
        
        res.status(201).json({
            message: "Intern created successfully",
            intern
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//update intern
export const updateIntern = async (req, res) => {
    try {
        const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!intern) return res.status(404).json({ message: "Intern not found" });
        res.json(intern);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
//Get all interns
export const getAllInterns = async (req, res) => {
    try {
        const interns = await Intern.find()
            .populate("assignedProjects")
            .populate("assignedTasks");
        res.json(interns);
    } catch (err) {
        res.status(500).json({ message: err.message });

    }
};
// Update Internship Status
export const updateInternsStatus = async (req, res) => {
    try {
        const intern = await Intern.findByIdAndUpdate(
            req.params.id,
            { internshipStatus: req.body.status },
            { new: true }
        );
        if (!intern) return res.status(404).json({ message: "Intern not found" });
        res.json(intern);
    } catch (err) {
        res.status(500).json({message:err.message});

    }
};
//Issue Certificate 
export const issueCertificate = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({message:"Please upload a PDF certificate file"});
        }
        const intern = await Intern.findById(req.params.id);
        if(!intern){
            return res.status(404).json({message:"Intern not found"});
        }
        const certPath = `/uploads/certificates/${req.file.filename}`;
        intern.certificateIssued = true;
        intern.certificateUrl = certPath;
        intern.issueDate = new Date();
        await intern.save();
        const certificate = await Certificate.create({
            internId: intern._id,
            issuedBy: req.user._id,
            certificateUrl: certPath
        });

        await Document.create({
            name: `Internship Certificate - ${intern.name}`,
            category: "Internship Certificate",
            linkedTo: intern.name,
            uploader: req.user.name || "",
            fileUrl: certPath,
            owner: intern._id,
            ownerModel: "Intern",
            uploadedBy: req.user._id,
        });

        res.status(200).json({
            message:"Certificate issued successfully",
            certificate,
            certificateUrl: certPath
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

// Download Certificate
export const downloadCertificate = async(req,res)=>{
    try {
        const intern = await Intern.findById(req.params.id);
        if(!intern){
            return res.status(404).json({message:"Intern not found"});
        }
        if(!intern.certificateIssued || !intern.certificateUrl){
            return res.status(404).json({message:"No certificate issued for this intern"});
        }
        const filePath = path.join(process.cwd(), intern.certificateUrl);
        if(!fs.existsSync(filePath)){
            return res.status(404).json({message:"Certificate file not found on server"});
        }
        res.download(filePath, `certificate-${intern.name}.pdf`);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

export const deleteIntern = async (req, res) => {
    try {
        const intern = await Intern.findByIdAndDelete(req.params.id);
        if (!intern) return res.status(404).json({ message: "Intern not found" });
        res.json({ message: "Intern deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get my certificate
export const getMyCertificate = async(req,res)=>{
    try {
        const intern = await Intern.findOne({ userId: req.user._id });
        if(!intern){
            return res.status(404).json({message:"Intern profile not found"});
        }
        const certificate = await Certificate.find({
            internId: intern._id
        });
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};