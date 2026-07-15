import Intern from "../models/intern.model.js";
//Create Intern
export const createIntern = async (req, res) => {
    try {
        const intern = await Intern.create(req.body);
        res.status(201).json(intern);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    } catch (err) {
        res.status(500).json({message:err.message});

    }
};
//Issue Certificate and letters
export const issueCertificate = async(req,res)=>{
    try {
        const intern = await intern.findByIdAndUpdate(
            req.params.id,
            {
                certificateIssued: true,
                issueDate: new Date()
            },
            {new: true}
        );
        res.json(intern)
    } catch (err) {
        res.status(500).json({message:err.message});
        
    }
};

