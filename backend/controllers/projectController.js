import Project from "../models/Project.js";
//Create Project
export const createProject = async(req,res)=>{
    try {
        const project = await Project.create(req.body);
        res.json(project);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};
//Get all projects
export const getProjects = async(req,res)=>{
    try{
        const projects = await Project.find().populate("team");
        res.json(projects);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};
//Update the project
export const updateProject = async(req,res)=>{
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(project);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }

};
//Delete the project
export const deleteProject = async(req,res)=>{
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({message:"Project deleted"});
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};