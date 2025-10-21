const express = require("express");
const dotenv = require("dotenv");
const  http  = require( 'http'); // <-- Import the built-in 'http' module
const { initSocketServer } = require('./socket.js'); // <-- Import our new socket initializer
// importing Routes
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const projectRoutes = require("./Routes/projectRoutes");
const taskRoutes = require("./Routes/taskRoutes");

dotenv.config(); //load env variables
// basic setup :
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// Create an HTTP server from our Express app
const server = http.createServer(app);

// Initialize the Socket.IO server and pass it the HTTP server
initSocketServer(server);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

// --- Start the Server ---
// We now call listen() on the 'server' object, not the 'app' object.
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});