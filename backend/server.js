import express from 'express';
import dotenv from 'dotenv';
// routes
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app =express();
const port = process.env.PORT || 5000;

// authentication
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("api/products",productRoutes);

connectDB();
app.listen((port),()=>{
    console.log(`Listening at port ${port}`);
})



// Qkm5IF4p40mqdnEU