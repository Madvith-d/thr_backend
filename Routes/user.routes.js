import express from 'express';
const Router = express.Router();
import { signupUser , loginUser, logoutUser ,followUser,unfollowUser, updateProfile, getProfile} from '../controllers/userController.js';
import secureRoute from '../middleware/secureRoute.js';

Router.post('/signup', signupUser);
Router.post('/login', loginUser);
Router.post('/logout', logoutUser)
Router.post('/follow/:id',secureRoute, followUser);
Router.post('/unfollow/:id',secureRoute, unfollowUser);
Router.post('/update',secureRoute,updateProfile);
Router.get('/profile/:username',getProfile)

export default Router;