import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT
import connectDB from './db/connectdb.js';
import cookieParser from 'cookie-parser';
connectDB();
import userRouter from './Routes/user.routes.js';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userRouter)

app.get('/',(req,res)=>{
    res.send('Hello World')
})




app.listen(PORT,()=>{
    console.log('server is running on port ',PORT);
})