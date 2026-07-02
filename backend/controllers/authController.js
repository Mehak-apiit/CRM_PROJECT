import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate the token
const generateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
};

//Register
export const registerUser = async(req,res)=>{
    try {
        const {name,email,password,role}=req.body;
        //check if user exist or not
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "admin"
        });
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};
// Login
export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:generateToken(user._id)
            });
        }else{
            res.status(401).json({message: "Invalid credentials"});
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};