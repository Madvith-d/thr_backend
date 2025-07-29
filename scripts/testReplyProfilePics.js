import mongoose from 'mongoose';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

// Test script to check reply profile pictures
async function testReplyProfilePics() {
    try {
        console.log('Testing reply profile pictures...');
        
        // Get a few posts with replies to examine
        const postsWithReplies = await postModel.find({
            'replies.0': { $exists: true }
        }).limit(3);
        
        console.log(`Found ${postsWithReplies.length} posts with replies to examine:`);
        
        for (const post of postsWithReplies) {
            console.log(`\n--- Post ID: ${post._id} ---`);
            
            for (let i = 0; i < post.replies.length; i++) {
                const reply = post.replies[i];
                console.log(`Reply ${i + 1}:`);
                console.log(`  Username: ${reply.username}`);
                console.log(`  UserID: ${reply.userID}`);
                console.log(`  UserProfilePic: ${reply.userProfilePic}`);
                
                // Cross-check with actual user data
                const user = await userModel.findById(reply.userID);
                if (user) {
                    console.log(`  Actual User ProfilePic: ${user.profilepic}`);
                    console.log(`  Match: ${reply.userProfilePic === user.profilepic ? '✅' : '❌'}`);
                } else {
                    console.log(`  User not found: ❌`);
                }
            }
        }
        
        // Also check some users
        console.log('\n--- Sample Users ---');
        const sampleUsers = await userModel.find({}).limit(3);
        for (const user of sampleUsers) {
            console.log(`User: ${user.username} | ProfilePic: ${user.profilepic}`);
        }
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Export for use as a module or run directly
export default testReplyProfilePics;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // Connect to database using environment variables
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';
    
    mongoose.connect(mongoUri)
        .then(() => {
            console.log('Connected to MongoDB');
            return testReplyProfilePics();
        })
        .then(() => {
            console.log('Test completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Test failed:', error);
            process.exit(1);
        });
}
