import asyncHandler from "express-async-handler";
import User from "../models/User.js";

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

export default {
    createUser
}