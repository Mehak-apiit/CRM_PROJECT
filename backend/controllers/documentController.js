import Document from "../models/Document.js";
import Employee from "../models/Employee.js";
import Intern from "../models/intern.model.js";
import fs from "fs";
import path from "path";


// 🔐 ADMIN ONLY — Get all documents
export const getAllDocuments = async (req, res) => {
  try {
    if (!["admin", "superAdmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const docs = await Document.find().sort({ createdAt: -1 }).populate("owner");

    res.status(200).json({
      count: docs.length,
      documents: docs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📤 ADMIN UPLOAD DOCUMENT
export const uploadDocument = async (req, res) => {
  try {
    const { owner, ownerModel, category } = req.body;

    // Validate ownerModel
    if (!["Intern", "Employee"].includes(ownerModel)) {
      return res.status(400).json({ message: "Invalid ownerModel" });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Check owner exists
    let existingOwner;
    if (ownerModel === "Intern") {
      existingOwner = await Intern.findById(owner);
    } else {
      existingOwner = await Employee.findById(owner);
    }

    if (!existingOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const doc = await Document.create({
      documentType: category || "qualification",
      documentUrl: req.file.path,
      owner,
      ownerModel,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document: doc
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🧑‍💼 INTERN / EMPLOYEE — GET OWN DOCUMENTS
export const getMyDocuments = async (req, res) => {
  try {
    let ownerId;
    let ownerModel;

    if (req.user.role === "employee") {
      const emp = await Employee.findOne({ userId: req.user._id });

      if (!emp) {
        return res.status(404).json({ message: "Employee not found" });
      }

      ownerId = emp._id;
      ownerModel = "Employee";

    } else if (req.user.role === "intern") {
      const intern = await Intern.findOne({ userId: req.user._id });

      if (!intern) {
        return res.status(404).json({ message: "Intern not found" });
      }

      ownerId = intern._id;
      ownerModel = "Intern";

    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const docs = await Document.find({
      owner: ownerId,
      ownerModel: ownerModel
    }).sort({ createdAt: -1 }).populate("owner");

    res.status(200).json({
      count: docs.length,
      documents: docs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📥 DOWNLOAD DOCUMENT (SECURE)
export const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    let allowed = false;

    // ✅ Admin can download anything
    if (["admin", "superAdmin"].includes(req.user.role)) {
      allowed = true;
    }

    // ✅ Intern access check
    if (req.user.role === "intern") {
      const intern = await Intern.findOne({ userId: req.user._id });
      if (intern && doc.owner.equals(intern._id)) {
        allowed = true;
      }
    }

    // ✅ Employee access check
    if (req.user.role === "employee") {
      const emp = await Employee.findOne({ userId: req.user._id });
      if (emp && doc.owner.equals(emp._id)) {
        allowed = true;
      }
    }

    if (!allowed) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const filePath = path.resolve(doc.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🗑️ DELETE DOCUMENT (ADMIN ONLY)
export const deleteDocument = async (req, res) => {
  try {
    if (!["admin", "superAdmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // delete file from server
    if (doc.fileUrl) {
      const filePath = path.resolve(doc.fileUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Document deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};