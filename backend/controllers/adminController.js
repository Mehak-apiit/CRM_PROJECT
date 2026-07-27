import Intern from "../models/intern.model.js";
import Employee from "../models/Employee.js";
import Document from "../models/Document.js";
import Certificate from "../models/certificate.model.js";


export const getDashboardStats = async (req, res) => {
  try {

    const totalInterns = await Intern.countDocuments();

    const totalEmployees = await Employee.countDocuments();

    const totalDocuments = await Document.countDocuments();

    const totalCertificates = await Certificate.countDocuments();


    res.status(200).json({
      success: true,
      data: {
        totalInterns,
        totalEmployees,
        totalDocuments,
        totalCertificates
      }
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};