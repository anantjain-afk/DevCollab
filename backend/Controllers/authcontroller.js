const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Register User 
const register = async (req,res) => {
    try {
        const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({message: "Please provide all required fields"});
    }

    // check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if(existingUser){
        return res.status(400).json({message: 'A user with this email or username already exists.'});
    }
    // hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data : {
            username,
            email,
            password: hashedPassword
        }
    })
    res.status(201).json({message: 'User registered successfully', user: {id: newUser.id, username: newUser.username, email: newUser.email}});    
    } catch (error) {
        console.log("Registration Error:", error);
        res.status(500).json({message: 'Server error'});
    }
    
}

module.exports = {
    register
}