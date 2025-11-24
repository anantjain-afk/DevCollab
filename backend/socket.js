// socket.js
import { Server } from 'socket.io';

// This function will initialize the socket server
export const initSocketServer = (server) => {
  const io = new Server(server, {
    // We need to configure CORS for Socket.IO.
    // This allows our frontend (which will run on localhost:3000) to connect.
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // This is the main connection listener.
  // It runs whenever a new client connects to our server.
  // connection is a predefined event name in socket.io
  // socket is the connection object
  // socket.id is the unique identifier for the connection
  io.on('connection', (socket) => {
    console.log(`✅ A user connected: ${socket.id}`);
 // Listen for a client joining a project room
    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project room: ${projectId}`);
    });

    socket.on('sendMessage', (messageData) => {
      // messageData will be an object like: { projectId: '...', message: { ... } }
    
      // We broadcast the received message to all other clients in that specific project room.
      // The 'to(projectId)' is the crucial part that targets the right room.
      io.to(messageData.projectId).emit('receiveMessage', messageData.message);

      console.log(`Message sent to room ${messageData.projectId}`);
    });
    // This runs when a client disconnects.
    socket.on('disconnect', () => {
      console.log(`❌ A user disconnected: ${socket.id}`);
    });
  });

  return io;
};
