import multer from "multer";
import path from "path";
import fs from "fs";

const certDir = path.join(process.cwd(), "uploads", "certificates");
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

const certStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cert-${req.params.id}-${Date.now()}${ext}`);
  },
});

const certFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" && file.originalname.toLowerCase().endsWith(".pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for certificates"), false);
  }
};

const uploadCertificate = multer({
  storage: certStorage,
  fileFilter: certFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadCertificate;
