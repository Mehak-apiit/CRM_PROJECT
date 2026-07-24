import Intern from "../models/intern.model.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Certificate from "../models/certificate.model.js";
//Create Intern
export const createIntern = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            college,
            phone,
            department
        } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
         const intern = await Intern.create({
            name,
            email,
            phone,
            college,
            department,
            phone
            

        });
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            phone,
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
        const {internId} = req.body;
        const intern = await Intern.findById(internId);
        if(!intern){
            return res.status(404).json({message:"Intern not found"});
            // dummy test certificate
            const certificate = await Certificate.create({
                internId,
                issuedBy: req.user.id,
                certificateUrl:`Certificate_for_${intern.name}.pdf`
            });
            res.status(200).json({
                message:"Certificate issued successfully",certificate
            });
        }
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
        const certificate = await Certificate.find({
            internId:req.user.id
        });
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};