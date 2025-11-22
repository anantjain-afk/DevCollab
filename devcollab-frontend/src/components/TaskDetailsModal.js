// src/components/TaskDetailsModal.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { updateTask, deleteTask, clearTaskDetailsError } from '../features/tasks/tasksSlice';

const TaskDetailsModal = ({ open, onClose, task }) => {
  const dispatch = useDispatch();
  
  // Get loading/error state from our tasksSlice
  const { loading, error } = useSelector((state) => state.tasks.details);

  // Local state for the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // When the modal opens or the task changes, reset the form
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setIsEditing(false); // Always start in "View" mode
      dispatch(clearTaskDetailsError());
    }
  }, [task, open, dispatch]);

  const handleSave = async () => {
    // Dispatch the update action
    const result = await dispatch(updateTask({ 
      taskId: task.id, 
      title, 
      description 
    }));
    
    // If successful (no error payload), switch back to view mode
    if (!result.error) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await dispatch(deleteTask(task.id));
      if (!result.error) {
        onClose(); // Close the modal on success
      }
    }
  };

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          border: '2px solid #aaa',
          boxShadow: '8px 8px rgba(64, 59, 59, 1)',
          borderRadius: '10px',
          p: 4,
          outline: 'none', // Remove the blue focus outline
        }}
      >
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Task Details</Typography>
          <Box>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>
                Edit
              </Button>
            )}
            <Button color="error" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Content Section */}
        <Box>
          {isEditing ? (
            // --- EDIT MODE ---
            <>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </Box>
            </>
          ) : (
            // --- VIEW MODE ---
            <>
              <Typography variant="h5" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status: {task.status.replace('_', ' ')}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {task.description || <em>No description provided.</em>}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default TaskDetailsModal;