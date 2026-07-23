import multer from "multer";
const storage = multer.diskStorage({
    destination:"uploads/",
    filename:(req,file,cb) =>{
        cb(null,Date.now()+"-"+file.originalname);
    },
});
const fileFilter = (req,file,cb)=>{
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfExt = file.originalname.toLowerCase().endsWith(".pdf");
    if(isPdfMime && isPdfExt) {
        cb(null,true);

    } else{
        cb(new Error("Only PDF files are allowed"),false);
    }

};
const upload = multer({storage,fileFilter});
export default upload;