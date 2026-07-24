import Document from "../models/Document.js";
import Employee from "../models/Employee.js";
import Intern from "../models/intern.model.js";
import mongoose from "mongoose";

export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDocumentMetadata = async (req, res) => {
  try {
    const { name, category, linkedTo, uploader, documentname, documentType, ownerType, owner } = req.body;
    const doc = await Document.create({
      name: name || documentname || "Untitled Document",
      category: category || documentType || "Contract",
      linkedTo: linkedTo || owner || "",
      uploader: uploader || req.user?.name || "",
      uploadedBy: req.user?._id,
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { documentType, ownerId, ownerModel } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }
    let ownerData;
    if (ownerModel === "Employee") {
      ownerData = await Employee.findById(new mongoose.Types.ObjectId(ownerId));
    } else {
      ownerData = await Intern.findById(new mongoose.Types.ObjectId(ownerId));
    }
    if (!ownerData) {
      return res.status(400).json({ message: "Owner not found" });
    }
    const doc = await Document.create({
      name: req.file.originalname,
      category: documentType || "Contract",
      linkedTo: ownerData.name,
      uploader: req.user.name || "",
      fileUrl: req.file.path,
      owner: ownerId,
      ownerModel,
      uploadedBy: req.user._id,
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    let ownerId;
    let ownerModel;
    if (req.user.role === "employee") {
      const emp = await Employee.findOne({ userId: req.user._id });
      if (!emp) return res.status(404).json({ message: "Employee not found" });
      ownerId = emp._id;
      ownerModel = "Employee";
    }
    if (req.user.role === "intern") {
      const intern = await Intern.findOne({ userId: req.user._id });
      if (!intern) return res.status(404).json({ message: "Intern not found" });
      ownerId = intern._id;
      ownerModel = "Intern";
    }
    const docs = await Document.find({ owner: ownerId, ownerModel });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
