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
        const hashedPassword = await bcrypt.hash(password || "intern123", 10);
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
            password: hashedPassword,
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
        res.status(500).json({ message: err.message });

    }
};
//Issue Certificate 
export const issueCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a PDF certificate file" });
        }
        const intern = await Intern.findById(req.params.id);
        if (!intern) {
            return res.status(404).json({ message: "Intern not found" });
        }
        const certPath = `/uploads/certificates/${req.file.filename}`;

        const certificate = await Certificate.create({
            internId: intern._id,
            issuedBy: req.user._id,
            certificateUrl: certPath
        });

        await Document.create({
            name: `Internship Certificate - ${intern.name}`,
            category: "Internship Certificate",
            fileUrl: certPath,
            owner: intern._id,
            ownerModel: "Intern",
            uploadedBy: req.user._id,
        });

        res.status(200).json({
            message: "Certificate issued successfully",
            certificate,
            certificateUrl: certPath
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Download Certificate
export const downloadMyCertificate = async(req,res)=>{
    try {

        // Find logged in intern
        const intern = await Intern.findOne({
            userId:req.user._id
        });


        if(!intern){
            return res.status(404).json({
                message:"Intern profile not found"
            });
        }


        // Find certificate
        const certificate = await Certificate.findOne({
            internId:intern._id
        });


        if(!certificate){
            return res.status(404).json({
                message:"Certificate not issued yet"
            });
        }


        const filePath = path.join(
            process.cwd(),
            certificate.certificateUrl
        );


        if(!fs.existsSync(filePath)){
            return res.status(404).json({
                message:"Certificate file not found"
            });
        }


        res.download(
            filePath,
            `Internship-Certificate-${intern.name}.pdf`
        );


    } catch(error){

        res.status(500).json({
            message:error.message
        });

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



export const getMyCertificate = async (req, res) => {
  try {
    // 1. Find intern
    const intern = await Intern.findOne({
      userId: req.user._id
    });

    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // 2. Find certificate
    const certificate = await Certificate.findOne({
      internId: intern._id
    });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // 3. File path
    const filePath = path.resolve(certificate.certificateUrl);

    // 4. Check file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // 5. Force download
    res.download(filePath, "certificate.pdf");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};