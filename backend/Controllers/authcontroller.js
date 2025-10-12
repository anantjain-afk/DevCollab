const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //

const prisma = new PrismaClient();

// Register User
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "A user with this email or username already exists.",
        });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return res
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.log("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    // comparing the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // generating JWT token :
    const token = jwt.sign(
      {
        userId: user.id, // payload
        email: user.email,
      },
      process.env.JWT_SECRET, //the secret key
      {
        expiresIn: "1h",
      }
    );

    // sending the token with response 
    res.status(200).json({
        message : "Login Successful",
        token,
        user : {
            id : user.id,
            username : user.username,
            email : user.email
        }
    })
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,login
};
