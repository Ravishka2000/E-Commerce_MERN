import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisLiked:{
        type:Boolean,
        default:false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    disLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    image: {
        type: String,
        default: "https://img.freepik.com/free-photo/online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg?w=2000&t=st=1680514441~exp=1680515041~hmac=2e3aa9fcb17808445aff670837d3fc7d6342eb61aa3f742b571295eb0de2b9c0"
    },
    author:{
        type:String,
        default:"Admin",
    },
}, {
    toJSON:{
        virtuals: true,
    },
    toObject:{
        virtuals: true,
    },
    timestamps: true,
});

//Export the model
const Blog = mongoose.model('Blog', blogSchema);
export default Blog;