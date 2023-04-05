import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwtToken.js";
import generateRefreshToken from "../config/refreshToken.js";
import sendEmail from "./EmailController.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
        const refreshToken = generateRefreshToken(user?._id);
        const {_id, firstName, email, mobile } = user;
        const updateUser = await User.findOneAndUpdate(
            user._id, 
                {
                    refreshToken: refreshToken
                },
                {
                    new: true
                }
            )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 72 * 1000,
        })
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

const loginAdmin = asyncHandler (async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error("Please enter email and password");
    }

    const admin = await User.findOne({ email });
    if (admin.role !== 'admin'){
        throw new Error("Not Authorized");
    }

    if (!admin){
        res.status(400);
        throw new Error("User not found, Please SignUp");
    }

    const passwordIsCorrect = await bcrypt.compare(password, admin.password);

    if (admin && passwordIsCorrect){
        const refreshToken = generateRefreshToken(admin?._id);
        const {_id, firstName, email, mobile } = admin;
        const updateUser = await User.findOneAndUpdate(
            admin._id, 
                {
                    refreshToken: refreshToken
                },
                {
                    new: true
                }
            )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 72 * 1000,
        })
        res.status(200).json({
            _id, 
            firstName,
            email,
            mobile,
            token: generateToken(admin._id),
        })
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }

});

const saveAddress = asyncHandler (async (req, res) => {
    const { _id } = req.user;
    const { address } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address
        }, {
            new: true
        });
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
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
    try {
        const user = await User.findById(id);
    res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteUser = asyncHandler (async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
    res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

const updateUser = asyncHandler (async (req, res) => {
    const { _id } = req.user;
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

const handleRefreshToken = asyncHandler (async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) {
        throw new Error("No refresh token");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new Error("No Refresh Token present in db or not matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken});
    })
});

const logout = asyncHandler (async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) {
        throw new Error("No refresh token");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
});

const updatePassword = asyncHandler (async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPasword = await user.save();
        res.json(updatedPasword);
    }else{
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler (async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        throw new Error("User not found");
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:7002/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to: email,
            subject: "Forgot Password Link",
            text: "Hey user",
            htm: resetURL,
        }
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler (async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });
    if(!user){
        throw new Error("Token expired, please try again");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

const getWishlist = asyncHandler (async (req, res) => {
    const { _id } = req.user;
    try {
        const user = await User.findById(_id).populate("wishlist");
        res.json(user);
    } catch (error) {
        throw new Error(error);
    }
});

export default {
    createUser,
    loginUser,
    loginAdmin,
    saveAddress,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getWishlist,
}