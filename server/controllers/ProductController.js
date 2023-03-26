import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";
import slugify from "slugify";

const createProduct = asyncHandler (async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
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
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        const query = Product.find(JSON.parse(queryStr));

        const products = await query; 
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const product = await Product.findByIdAndUpdate(id, req.body,{new:true});
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler (async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

export default{
    createProduct,
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
}