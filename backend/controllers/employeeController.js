import Employee from "../models/Employee";
//Create Employee
export const createEmployee = async(req,re)=>{
    try {
        const emp = await Employee.create(req.body);
        res.json(emp);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
// Get all employees
export const getEmployees = async(req,res)=>{
    try {
        const employees = await Employee.find();
        res.json(employess);
    } catch (error) {
        res.status(500).json({message:error.Employee});
    }
};
//update performane
export const updatePerformance = async(req,res)=>{
    try {
        const emp = await Employee.findByIdAndUpdate(req.params.id,
            {performanceScore:req.body.performanceScore},
            {new:true}

        );
        res.json(emp);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};
//Mark attendence
export const markAttendence =async(req,res)=>{
    try {
        const emp = await Employee.findById(req.pramans.id);
        emp.attendance.push({
            status:req.body.status,
        });
        await emp.save();
    } catch (error) {
        res.status(500).json({message:error.message});
        
    } 
};