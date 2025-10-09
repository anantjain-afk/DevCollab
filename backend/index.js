const express = require("express");
const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const authRoutes = require('./Routes/authRoutes');


// basic setup :
dotenv.config(); //load env variables
const app = express(); 
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// middlewares 
app.use(express.json());


// Routes 
app.use('/api/auth', authRoutes );

// start server 
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})  