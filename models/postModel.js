const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type: String,
        required: true,
        maxLength: 500
    },
    image: {
        type: String,
        default: ''
    },
    likes: {
        type:Number,
        default: 0
    },
    replies:[{
        userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content:{
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ''
        },
        likes: {
            type:Number,
            default: 0
        },
        userProfilePic: {
            type: String,
            default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        username: {
            type: String,
            required: true
        }
    }]
},{ timestamps: true });
const Post = mongoose.model('Post', postSchema);

module.exports = Post;