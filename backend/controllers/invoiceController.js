import Invoice from "../models/Invoice.js";

//Create Invoice
export const createInvoice = async(req,res)=>{
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//Get all Invoices
export const getInvoices = async(req,res)=>{
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//update invoices
export const updateInvoice = async(req,res)=>{
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(invoice);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//delete invoice
export const deleteInvoice = async(req,res)=>{
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({message:"Invoice deleted"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
