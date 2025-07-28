import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateToken.js';

const signupUser = async (req, res) => {
    try{
        const {name, username, email, password } = req.body;
        const user = await userModel.findOne({ $or: [ { username }, { email } ] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, username, email, password: hashedPassword });
        await newUser.save();
        if (!newUser) {
            return res.status(500).json({ message: 'Error creating user' });
        }
        generateTokenAndSetCookie(newUser._id, res);
        res.status(201).json({ message: 'User created successfully' , user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({ message: 'Login successful',user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const logoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const followUser = async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user;
    if (userId === currentUser._id.toString()) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.followers.includes(currentUser._id)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }
        // user.followers.push(currentUser._id);
        await user.updateOne({ $push: { followers: currentUser._id } });
        await currentUser.updateOne({ $push: { following: userId } });
        await user.save();
        await currentUser.save();
        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const unfollowUser = async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user;
    if (userId === currentUser._id.toString()) {
        return res.status(400).json({ message: 'You cannot Unfollow yourself' });
    }
    try {
        const userToUnfollow = await userModel.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!userToUnfollow.followers.includes(currentUser._id)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }
        await userToUnfollow.updateOne({ $pull: { followers: currentUser._id } });
        await currentUser.updateOne({ $pull: { following: userId } });
        await userToUnfollow.save();
        await currentUser.save();
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProfile = async (req, res) => {
    const user = req.user;
    const { name , email,password, profilepic,bio,username }= req.body;
    try {
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilepic = profilepic || user.profilepic;
        user.bio = bio || user.bio;
        user.username = username || user.username;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user: user });
    }catch (error) {
        
    }
}

const getProfile = async (req, res) => {
    const {username}=req.params;

    try{
        const user = await userModel.findOne({username}).select('-password').select('-__v').select('-createdAt').select('-updatedAt');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);

    }catch(error){
        res.status(500).json({ message: error.message });
        console.log(error.message)
    }
}
export { signupUser , loginUser ,logoutUser,followUser,unfollowUser, updateProfile,getProfile};