import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// ➕ CREATE EMPLOYEE (ADMIN)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash("employee123", 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "employee"
      });
    }

    const employee = await Employee.create({
      userId: user._id,
      name,
      email,
      phone,
      department,
      designation
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
      loginCredentials: { email, password: "employee123" }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📋 GET ALL EMPLOYEES (ADMIN)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: employees.length,
      employees
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👤 GET MY PROFILE (EMPLOYEE)
export const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      userId: req.user._id
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};