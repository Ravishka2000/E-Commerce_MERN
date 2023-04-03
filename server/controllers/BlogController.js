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

const getAllBlogs = asyncHandler (async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler (async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByIdAndDelete(id);
        res.json(blog);
    } catch (error) {
        throw new Error(error);
    }
});

const likeBlog = asyncHandler (async (req, res) => {
    const { blogId } = req.body
    try {
        const blog  = await Blog.findById(blogId);
        const loginUserId = req?.user?._id;
        console.log(loginUserId);
        const isLiked = blog?.isLiked;
        const alreadyDisliked = blog?.disLikes?.find(
            (userId => userId?.toString() === loginUserId?.toString())
        );
        if(alreadyDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { disLikes: loginUserId },
                isDisliked: false,
            },{
                new: true,
            });
            res.json(blog);
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            },{
                new: true,
            });
            res.json(blog);
        }else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId },
                isLiked: true,
            },{
                new: true,
            });
            res.json(blog);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const disLikeBlog = asyncHandler (async (req, res) => {
    const { blogId } = req.body
    try {
        const blog  = await Blog.findById(blogId);
        const loginUserId = req?.user?._id;
        console.log(loginUserId);
        const isDisLiked = blog?.isDisLiked;
        const alreadyLiked = blog?.likes?.find(
            (userId => userId?.toString() === loginUserId?.toString())
        );
        if(alreadyLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            },{
                new: true,
            });
            res.json(blog);
        }
        if(isDisLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { disLikes: loginUserId },
                isDisLiked: false,
            },{
                new: true,
            });
            res.json(blog);
        }else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { disLikes: loginUserId },
                isDisLiked: true,
            },{
                new: true,
            });
            res.json(blog);
        }
    } catch (error) {
        throw new Error(error);
    }
});

export default {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    disLikeBlog,
}