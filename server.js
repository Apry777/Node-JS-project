import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/welcome' , (req, res) =>{
    res.status(200).json({message : 'Welcome to Noseberry'});
});

app.use('/api',router);
app.use(router);

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
