// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      // Connect to the server
      // If you are in production, use your Render URL. 
      // If local, use localhost:3001 (or whatever your proxy points to)
      // The socket.io client automatically handles the connection URL based on window.location if not specified,
      // but since our backend is on a different port/domain, we specify it.

      const backendUrl = process.env.REACT_APP_BACKEND_URL;

      const newSocket = io(backendUrl);

      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};