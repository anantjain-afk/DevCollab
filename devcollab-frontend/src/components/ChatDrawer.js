// src/components/ChatDrawer.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import api from '../utils/api';
// We'll use a simple "Send" icon (you might need to import from @mui/icons-material if you have it, 
// but for now we'll use a text button or simple char to keep it dependency-free if icon not installed)
// If you have icons installed: import SendIcon from '@mui/icons-material/Send';

const ChatDrawer = ({ open, onClose, project }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
    
  
  
  const messagesEndRef = useRef(null);
  const socket = useSocket();
const { userInfo } = useSelector((state) => state.auth);
// Remove the mock 'messages' state default value, start with []

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log(project);
  if (!socket) return;

  // Join the project room
  socket.emit('joinProject', project.id);

  // Listen for incoming messages
  socket.on('receiveMessage', (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  // Cleanup listener on unmount/close
  return () => {
    socket.off('receiveMessage');
  };
}, [socket, project.id]);

 const handleSend = () => {
  if (message.trim() && socket) {
    const messageData = {
      id: Date.now(),
      user: userInfo.user.username, // Use real username
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      projectId: project.id, // Needed for the backend to know which room
      userId: userInfo.user.id,
    };

    // 1. Send to server
    socket.emit('sendMessage', { projectId: project.id, message: messageData });

    // 2. Add to my own list locally (Optimistic UI)
    // (Or you can wait for the server to broadcast it back, but local adds feel faster)
    // However, our backend broadcasts to *everyone* in the room including the sender usually.
    // If your backend code does `socket.to(room).emit`, it excludes the sender.
    // If it does `io.to(room).emit`, it includes the sender.
    // Check your socket.js! 

    // Let's assume we add it locally for instant feedback:
    // setMessages((prev) => [...prev, { ...messageData, user: 'Me' }]); // 'Me' logic needs updating

    // Actually, for simplicity, let's just rely on the server broadcast if your backend uses io.to().
    // If your backend uses io.to(projectId), you will receive your own message back via 'receiveMessage'.
    // Let's check your backend code logic from Phase 4. 
    // You wrote: io.to(messageData.projectId).emit('receiveMessage', messageData.message);
    // This means EVERYONE (including you) gets the message. So we DON'T need to setMessages here manually.

    setMessage('');
  }
  // old messages : 
};
useEffect(() => {
if (open && project) {
  // Fetch history
  const fetchHistory = async () => {
    try {
      // Use relative URL (proxy handles it)
      const { data } = await api.get(`/api/projects/${project.id}/messages`, {
         headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setMessages(data);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };
  fetchHistory();
}
}, [open, project]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 350, display: 'flex', flexDirection: 'column' }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">Team Chat</Typography>
        <Typography variant="caption">{project?.name}</Typography>
      </Box>

      {/* Messages Area (Scrollable) */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f4f7f9' }}>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id} sx={{ 
              flexDirection: 'column', 
              alignItems: msg.user === userInfo.user.username ? 'flex-end' : 'flex-start',
              mb: 1
            }}>
              <Paper sx={{ 
                p: 1.5, 
                bgcolor: msg.user === userInfo.user.username ? 'primary.light' : 'white',
                color: msg.user === userInfo.user.username ? 'white' : 'text.primary',
                borderRadius: 2,
                maxWidth: '80%'
              }}>
                {msg.user !== userInfo.user.username && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {msg.user}
                  </Typography>
                )}
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                {msg.time}
              </Typography>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Area */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}>
          {/* You can replace this with <SendIcon /> if you install icons */}
          ➤ 
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;