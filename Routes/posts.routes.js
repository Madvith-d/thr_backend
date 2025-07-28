import express from 'express';
const Router = express.Router();
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost, feedPosts, allPosts } from '../controllers/postsController.js';
import secureRoute from '../middleware/secureRoute.js';

Router.post('/create', secureRoute, createPost);
Router.get('/get/:id', secureRoute, getPost);
Router.delete('/delete/:id', secureRoute, deletePost);
Router.post('/like/:id', secureRoute, likeUnlikePost)
Router.post('/reply/:id', secureRoute, replyToPost)
Router.get('/feed', secureRoute, feedPosts);
Router.get('/all', secureRoute, allPosts);
export default Router;