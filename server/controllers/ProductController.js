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

const getaProduct = asyncHandler (async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler (async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});

export default{
    createProduct,
    getaProduct,
    getAllProducts,
}