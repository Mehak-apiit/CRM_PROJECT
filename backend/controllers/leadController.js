import Lead from "../models/Lead.js";

// CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL LEADS
export const getLeads = async (req, res) => {
  try {
    let leads;

    if (req.user.role === "admin") {
      leads = await Lead.find().populate("assignedTo", "name email");
    } else {
      leads = await Lead.find({ assignedTo: req.user._id });
    }

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE LEAD
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ASSIGN LEAD
export const assignLead = async (req, res) => {
  try {
    const { userId } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId },
      { new: true }
    );

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};