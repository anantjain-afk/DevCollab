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
  io.on('connection', (socket) => {
    console.log(`✅ A user connected: ${socket.id}`);

    // This runs when a client disconnects.
    socket.on('disconnect', () => {
      console.log(`❌ A user disconnected: ${socket.id}`);
    });
  });

  return io;
};
