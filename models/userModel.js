import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLenght: 8,
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ''
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;