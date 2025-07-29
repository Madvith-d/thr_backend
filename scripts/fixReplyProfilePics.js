import mongoose from 'mongoose';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

// Migration script to fix existing reply profile pictures
async function fixReplyProfilePics() {
    try {
        console.log('Starting migration to fix reply profile pictures...');
        
        // Get all posts with replies
        const postsWithReplies = await postModel.find({
            'replies.0': { $exists: true }
        });
        
        console.log(`Found ${postsWithReplies.length} posts with replies`);
        
        let updatedCount = 0;
        
        for (const post of postsWithReplies) {
            let postUpdated = false;
            
            for (const reply of post.replies) {
                // Check if reply has missing or default profile pic
                const hasDefaultPic = !reply.userProfilePic || 
                    reply.userProfilePic === 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                
                if (hasDefaultPic) {
                    // Get the actual user to fetch their current profile pic
                    const user = await userModel.findById(reply.userID);
                    if (user && user.profilepic) {
                        console.log(`Updating reply from ${user.username}: ${reply.userProfilePic} -> ${user.profilepic}`);
                        reply.userProfilePic = user.profilepic;
                        postUpdated = true;
                    }
                }
            }
            
            if (postUpdated) {
                await post.save();
                updatedCount++;
            }
        }
        
        console.log(`Migration completed! Updated ${updatedCount} posts with fixed reply profile pictures.`);
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Export for use as a module or run directly
export default fixReplyProfilePics;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // Connect to database (adjust connection string as needed)
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thr_backend')
        .then(() => {
            console.log('Connected to MongoDB');
            return fixReplyProfilePics();
        })
        .then(() => {
            console.log('Migration script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}
