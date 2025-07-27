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
export { signupUser , loginUser ,logoutUser};