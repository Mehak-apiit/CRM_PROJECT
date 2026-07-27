import Document from "../models/Document.js";
import Employee from "../models/Employee.js";
import Intern from "../models/intern.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

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
    const {
      name,
      category,
      owner,
      ownerModel
    } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }
    const doc = await Document.create({

      name: name || req.file.originalname,

      category,

      owner,

      ownerModel,

      fileUrl: req.file.path,

      uploadedBy: req.user._id

    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (doc.category === "Internship Certificate" && doc.linkedTo) {
      const intern = await Intern.findOne({ name: doc.linkedTo });
      if (intern) {
        intern.certificateIssued = false;
        intern.certificateUrl = null;
        intern.issueDate = null;
        await intern.save();
      }
    }

    if (doc.fileUrl) {
      const filePath = path.join(process.cwd(), doc.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

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
    const docs = await Document.find({
      owner: ownerId,
      ownerModel: ownerModel
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
