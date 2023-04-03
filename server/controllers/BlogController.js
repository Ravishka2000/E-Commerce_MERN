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

const updateBlog = asyncHandler (async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(blog);
    } catch (error) {
        throw new Error(error);
    }
});

const getBlog = asyncHandler (async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        await Blog.findByIdAndUpdate(id, {
            $inc:{numViews:1}
        }, {
            new: true
        })
        res.json(blog);
    } catch (error) {
        throw new Error(error);
    }
});

export default {
    createBlog,
    updateBlog,
    getBlog,
}