import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/jwtAuth.js';

dotenv.config();

const app = express();

app.use(cors({
    origin : "http://localhost:3000", //only this frontend is allowed
    credentials : true // allows cookies
}));
app.use(express.json());
app.use(cookieParser());

// app.get('/dashboard',authMiddleware , (req, res) =>{
//     res.status(200).json({message : 'Welcome to Noseberry'});
// });

app.use('/api',router);

// app.get('/debug-auth',authMiddleware, (req, res) => {
//     res.json({
//         cookies: req.cookies,
//         user: req.user || null
//     });
// });

const PORT = process.env.PORT || 3000;
const startServer = async() => {
    try{
        await connectDB();

        app.listen(PORT, () =>{
            console.log(`Server started on port ${PORT}`);
        });
    }catch(err){
        console.log('Failed to start Server : ', err);
        process.exit(1);
    }
}

startServer();
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
