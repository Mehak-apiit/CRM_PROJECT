import Intern from "../models/intern.model.js";
//Create Intern
export const createIntern = async (req, res) => {
    try {
        const intern = await Intern.create(req.body);
        res.status(201).json(intern);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

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
//Issue Certificate and letters
export const issueCertificate = async(req,res)=>{
    try {
        const intern = await Intern.findByIdAndUpdate(
            req.params.id,
            {
                certificateIssued: true,
                issueDate: new Date()
            },
            {new: true}
        );
        if (!intern) return res.status(404).json({ message: "Intern not found" });
        res.json(intern)

    } catch (err) {
        res.status(500).json({message:err.message});
    }
//     catch (error) {
//         res.status(500).json({message: error.message});
// >>>>>>> b5a1ed3e7473ff90081e28b9fb00861f15ccfd80
        
//     }
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

