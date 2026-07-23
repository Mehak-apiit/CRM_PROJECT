import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Create Employee
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      position
    } = req.body;
    // create user for login
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee"
    });
    // create employee profile
    const employee = await Employee.create({
      name,
      email,
      position,
      userId:user._id
    });
    res.status(201).json({
      message:"Employee created successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update performance
export const updatePerformance = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      { performanceScore: req.body.performanceScore },
      { new: true }
    );
    res.json(emp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);

    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    emp.attendance.push({
      status: req.body.status,
    });

    await emp.save();

    res.json({ message: "Attendance marked", emp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
