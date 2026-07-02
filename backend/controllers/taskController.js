import  Task from "../models/Task.js";
//Create Task
export const createTask = async (req,res)=>{
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};
//Get Tasks
export const getTasks = async(req,res)=>{
    try {
        const tasks = await Task.find()
        .populate("assignedTo")
        .populate("project")
        res.json(tasks);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};
//Update Task Status
export const updateTask = async(req,res)=>{
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(task);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
//Delete Task

export const deleteTask = async(req,res)=>{
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({message:"Task deleted"});
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};