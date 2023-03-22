import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect.js';
import authRouter from './routes/UserRoutes.js';
import bodyParser from 'body-parser';

dotenv.config();

const PORT = process.env.PORT || 4000;
dbConnect();

const app = express();
app.use(bodyParser.json)
app.use(express.json());
app.use(cors());


app.use('/api/user', authRouter);

const port = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${port} 🔥`));
