import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGODB_URL;

const dbConnect = () => {
    try {
        const conn = mongoose.connect(URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database error");        
    }
};

export default dbConnect;
