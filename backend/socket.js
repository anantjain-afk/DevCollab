// socket.js
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This function will initialize the socket server
const initSocketServer = (server) => {
  const io = new Server(server, {
    // We need to configure CORS for Socket.IO.
    // This allows our frontend (which will run on localhost:3000) to connect.
    cors: {
      origin: [process.env.FRONTEND_URL, "http://localhost:3000"], // Allow both env var and local default
      methods: ["GET", "POST"]
    }
  });

  // This is the main connection listener.
  io.on('connection', (socket) => {
    console.log(`✅ A user connected: ${socket.id}`);
    
    // Listen for a client joining a project room
    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project room: ${projectId}`);
    });

    socket.on('sendMessage', async ({ projectId, message }) => {
      try {
        // 1. Save to Database
        const savedMessage = await prisma.message.create({
          data: {
            content: message.text,
            projectId: projectId,
            userId: message.userId,
          },
          include: {
            user: { select: { username: true } }
          }
        });

        // 2. Construct the object to send back
        const messageToSend = {
          id: savedMessage.id,
          text: savedMessage.content,
          user: savedMessage.user.username,
          userId: savedMessage.userId,
          time: new Date(savedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // 3. Broadcast to Room
        io.to(projectId).emit('receiveMessage', messageToSend);

      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // This runs when a client disconnects.
    socket.on('disconnect', () => {
      console.log(`❌ A user disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initSocketServer };
