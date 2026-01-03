// src/components/AIModal.js
import React from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { clearAIResult } from '../features/snippets/snippetsSlice';

const AIModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { loading, result, error } = useSelector((state) => state.snippets.ai);

  const handleClose = () => {
    dispatch(clearAIResult());
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          border: '2px solid #aaa',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: 'auto' // Allow scrolling if explanation is long
        }}
      >
        <Typography variant="h6" gutterBottom>
          ✨ AI Code Assistant
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ my: 2 }}>
            Error: {error}
          </Typography>
        )}

        {result && (
          <Box sx={{ mt: 2, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            {/* Using pre-wrap to preserve formatting/newlines from the AI */}
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AIModal;