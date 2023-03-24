import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwtToken.js";
import validateMongoDbId from "../utils/validateMongoDbId.js";

const createUser = asyncHandler( async (req, res) => {
    const {firstName, lastName, email, mobile, password} = req.body;
    const findUser = await User.findOne({email});

    if(!findUser){
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            mobile,
            password
        });
        res.json(newUser);
    }else{
        throw new Error("User already exists");
    }
});

const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error("Please enter email and password");
    }

    const user = await User.findOne({ email });

    if (!user){
        res.status(400);
        throw new Error("User not found, Please SignUp");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (user && passwordIsCorrect){
        const {_id, firstName, email, mobile } = user
        res.status(200).json({
            _id, 
            firstName,
            email,
            mobile,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }

});

const getAllUsers = asyncHandler (async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

const getUser = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(id);
    res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteUser = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id);
    try {
        const user = await User.findByIdAndDelete(id);
    res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const updateUser = asyncHandler (async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    const { firstName, lastName, email, mobile } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstName,
            lastName,
            email,
            mobile
        }, {
            new: true
        });
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        },{
            new: true,
        });
        res.json({
            message: "User Blocked",
        })
    } catch (error) {
        throw new Error(error);
    }
});

const unBlockUser = asyncHandler (async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(_id);
    try {
        const unBlock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        },{
            new: true,
        });
        res.json({
            message: "User Unblocked",
        })
    } catch (error) {
        throw new Error(error);
    }
});

export default {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser
}