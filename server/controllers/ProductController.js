import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";


const createProduct = asyncHandler (async (req, res) => {
    try {

        const newProduct = await Product.create(req.body);
        res.json({
            message: "Product created",
            newProduct: newProduct,
        })
        
    } catch (error) {
        throw new Error(error);
    }
    
});

export default{
    createProduct,
}