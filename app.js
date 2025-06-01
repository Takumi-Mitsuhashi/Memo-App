import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
import itemsRoute from './routes/items.js'; 


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB接続成功"))
.catch((err) => console.error('MongoDB connection error:', err));



app.use('/items', itemsRoute);

export default app;

