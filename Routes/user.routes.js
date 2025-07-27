import express from 'express';
const Router = express.Router();

Router.get('/signup', (req, res) => {
    // Handle user signup
    res.send('User signed up');
});

export default Router;