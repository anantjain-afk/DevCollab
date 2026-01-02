const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); // <-- Import the built-in 'http' module
const { initSocketServer } = require("./socket.js"); // <-- Import our new socket initializer
// importing Routes
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const projectRoutes = require("./Routes/projectRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const snippetRoutes = require('./Routes/snippetRoutes.js');
dotenv.config(); //load env variables
// basic setup :
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Handle preflight requests

const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// Create an HTTP server from our Express app
const server = http.createServer(app);

// Initialize the Socket.IO server and pass it the HTTP server
const io = initSocketServer(server);

// Store io instance on the app so controllers can access it
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/snippets", snippetRoutes)

// --- Start the Server ---
// We now call listen() on the 'server' object, not the 'app' object.
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
