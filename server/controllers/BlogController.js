import Blog from "../models/BlogModel.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const createBlog = asyncHandler (async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch (error) {
        throw new Error(error);
    }
});


export default {
    createBlog,
}