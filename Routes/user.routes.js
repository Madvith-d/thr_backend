import express from 'express';
const Router = express.Router();
import { signupUser , loginUser, logoutUser} from '../controllers/userController.js';

Router.post('/signup', signupUser);
Router.post('/login', loginUser);
Router.post('/logout', logoutUser)

export default Router;