import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const analyzeDocument = async (text) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        const prompt = `Extract the following details from this document:
        1)Client Name
        2)Expiry Date
        3)Amount
        5)Important Clause 
        Return only valid json like:
        {
            "clinet":"",
            "expiry":"",
            "value":"",
            "clause":"",
        }
        Document:${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        return response;
    } catch (error) {
        console.error(error);
        throw error;

    }
};