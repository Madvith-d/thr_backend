import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

export const createPost = async (req, res) => {
    try {
        let { content, image } = req.body;
        const postedBy = req.user._id; // Assuming user is authenticated
        if (!image) {
            image = ''
        }
        const maxLength = 500;
        if (content.length > maxLength) {
            return res.status(400).json({ message: 'Content should not exceed 500 characters' });
        }
        const newPost = new postModel({
            content,
            image: image || '',
            postedBy
        });

        await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate('postedBy');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const user = req.user;
    try {

        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.postedBy.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await post.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likeUnlikePost = async (req, res) => {
    const user = req.user;
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.likes.includes(user._id)) {
            post.likes.pull(user._id);
        } else {
            post.likes.push(user._id);
        }
        await post.save();
        res.status(200).json({ message: 'Post liked/unliked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const replyToPost = async (req, res) => {
    const userID = req.user._id;
    try {
        const post = await postModel.findById(req.params.id);
        const user = await userModel.findById(userID);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        let { content, image } = req.body;
        if (!image) {
            image = ''
        }
        
        // Debug log to verify profile picture is being retrieved
        console.log(`Reply from user ${user.username}: profilepic = ${user.profilepic}`);
        
        const newReply = {
            userID: userID,
            content,
            image,
            userProfilePic: user.profilepic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
            username: user.username
        };
        
        post.replies.push(newReply);
        await post.save();
        
        res.status(200).json({ 
            message: 'Reply added successfully',
            reply: newReply
        });
    } catch (error) {
        console.error('Error in replyToPost:', error);
        res.status(500).json({ message: error.message });
    }
}

export const feedPosts = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const followingIds = user.following || [];
        // Include the user's own posts as well
        const feedUserIds = [...followingIds, user._id];
        const posts = await postModel.find({ postedBy: { $in: feedUserIds } })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'username profilepic')
            .populate('replies.userID', 'username profilepic');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const allPosts = async (req, res) => {
    try {
        const posts = await postModel.find({})
            .sort({ createdAt: -1 })
            .populate('postedBy', 'username profilepic')
            .populate('replies.userID', 'username profilepic');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};