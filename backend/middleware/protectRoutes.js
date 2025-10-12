const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const protectRoutes = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unautherized : No token provided" });
        }

        // verify token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unautherized : Invalid token" });
        }
        
        // find user by id from token
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, email: true } // select only necessary fields
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // attach user to request object so out controllers can access it/
        req.user = user;
        next(); // proceed to the next middleware or route handler



    } catch (error) {
        console.log("error in protectRoute middleware", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized. token expired." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Unauthorized. Invalid token" });
        }
        res.status(500).json({ error: "Internal Server error" });
    }
}

module.exports = protectRoutes;