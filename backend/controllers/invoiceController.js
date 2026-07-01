import Invoice from "../models/Invoice.js";
//Create Invoice
export const createInvoice = async(req,res)=>{
    try {
        const invoice = await Invoice.create(req.body);
        res.json(invoice);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
//Get all Invoices
export const getInvoices = async(req,res)=>{
    try {
        const invoices = await invoice.find();
        res.json(invoices);
    } catch (error) {
        
    }
};
//update invoices
export const updateInvoice =async(req,res)=>{
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
};