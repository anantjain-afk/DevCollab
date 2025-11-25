// src/pages/ProjectPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import KanbanBoard from "../components/KanbanBoard";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjectById,
  clearCurrentProject,
  addMember,
  clearMemberError
} from "../features/projects/projectsSlice";
import { createTask, clearCreateTaskError } from "../features/tasks/tasksSlice";
import TaskDetailsModal from '../components/TaskDetailsModal';
import ChatDrawer from '../components/ChatDrawer';
import {
  Box,
  Paper,
  CircularProgress,
  Alert,
  Container,
  Typography,
  Button,
  Modal,
  TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { error, loading, currentProject } = useSelector(
    (state) => state.projects
  );
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = currentProject?.tasks.find(t => t.id === selectedTaskId) || null;
  
  const { loading: creating, error: createError } = useSelector(
    (state) => state.tasks.create
  );
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, projectId]);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const { loading: memberLoading, error: memberError } = useSelector(
    (state) => state.projects.memberModal
  );
  
  // Contributor badge colors (light, vibrant palette)
  const contributorColors = [
    { bg: '#e3f2fd', text: '#1976d2' }, // light blue
    { bg: '#f3e5f5', text: '#7b1fa2' }, // light purple
    { bg: '#e8f5e9', text: '#388e3c' }, // light green
    { bg: '#fff3e0', text: '#f57c00' }, // light orange
    { bg: '#fce4ec', text: '#c2185b' }, // light pink
    { bg: '#e0f2f1', text: '#00796b' }, // light teal
  ];

  function handleOpen() {
    setOpen(true);
    dispatch(clearCreateTaskError());
  }
  
  function handleClose() {
    setOpen(false);
    setTitle("");
    dispatch(clearCreateTaskError());
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTask({ title, projectId })).unwrap();
      handleClose();
    } catch (error) {
      // error handled in slice
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTaskId(task.id);
    setIsTaskModalOpen(true);
  };
  
  const handleTaskModalClose = () => {
    setSelectedTaskId(null);
    setIsTaskModalOpen(false);
  };

  const handleInviteOpen = () => {
    dispatch(clearMemberError());
    setIsInviteOpen(true);
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail) return;

    const result = await dispatch(addMember({ projectId, email: inviteEmail }));

    if (!result.error) {
      setIsInviteOpen(false);
      setInviteEmail('');
      dispatch(fetchProjectById(projectId));
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <Header />
      <Container sx={{ mt: 4, pb: 4 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: '#2c3e50',
            }}
          >
            Project Workspace
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={() => setIsChatOpen(true)}
              sx={{ 
                color: '#fff',
                background: '#000',
                textTransform: 'none',
                px: 3,
                py: 1,
                borderRadius: '10px',
                boxShadow: 'none',
                '&:hover': {
                  background: '#333',
                  boxShadow: 'none',
                },
              }}
            >
              Chat
            </Button>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button 
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderColor: '#000',
                  color: '#000',
                  px: 3,
                  py: 1,
                  borderRadius: '10px',
                  '&:hover': {
                    borderColor: '#333',
                    background: 'rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                ← Back to Dashboard
              </Button>
            </Link>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: '#667eea' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        ) : currentProject ? (
          <Box>
            {/* Project Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 3,
                background: '#ffffff',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: '#2c3e50',
                  mb: 1,
                }}
              >
                {currentProject.name}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#7f8c8d',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {currentProject.description}
              </Typography>

              {/* Contributors Section */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#2c3e50',
                      fontSize: '1.1rem',
                    }}
                  >
                    Contributors
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleInviteOpen}
                    startIcon={<AddIcon />}
                    sx={{
                      background: '#000',
                      textTransform: 'none',
                      px: 2,
                      borderRadius: '10px',
                      '&:hover': {
                        background: '#333',
                      },
                    }}
                  >
                    Invite
                  </Button>
                </Box>
                
                {/* Tech Badge Style Contributors */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1.5,
                  }}
                >
                  {currentProject.members.map((member, index) => {
                    const colorScheme = contributorColors[index % contributorColors.length];
                    return (
                      <Chip
                        key={member.userId}
                        icon={<PersonIcon sx={{ color: `${colorScheme.text} !important` }} />}
                        label={member.user.username}
                        sx={{
                          background: colorScheme.bg,
                          color: colorScheme.text,
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          px: 1,
                          py: 2.5,
                          borderRadius: 2,
                          border: `1px solid ${colorScheme.text}20`,
                          '& .MuiChip-label': {
                            px: 1,
                          }
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Paper>

            {/* Tasks Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: '#ffffff',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#2c3e50',
                  }}
                >
                  Tasks
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                  sx={{
                    background: '#000',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: '10px',
                    '&:hover': {
                      background: '#333',
                    },
                  }}
                >
                  Add New Task
                </Button>
              </Box>
              <KanbanBoard tasks={currentProject.tasks} onTaskClick={handleTaskClick} />
            </Paper>
          </Box>
        ) : (
          <Typography sx={{ color: '#7f8c8d' }}>No project found.</Typography>
        )}
      </Container>

      {/* Create Task Modal */}
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            p: 4,
          }}
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: '#2c3e50',
              mb: 2,
            }}
          >
            Add a New Task
          </Typography>
          <Box component="form" onSubmit={handleSubmitTask} sx={{ mt: 2 }}>
            {createError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {createError}
              </Alert>
            )}
            <TextField
              label="Task Title"
              margin="normal"
              required
              fullWidth
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                background: '#000',
                textTransform: 'none',
                py: 1.2,
                borderRadius: '10px',
                '&:hover': {
                  background: '#333',
                }
              }}
              disabled={creating}
            >
              {creating ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Create Task"}
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Task Details Modal */}
      <TaskDetailsModal 
        open={isTaskModalOpen} 
        onClose={handleTaskModalClose} 
        task={selectedTask} 
      />

      {/* Invite Member Dialog */}
      <Dialog 
        open={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#2c3e50' }}>
          Invite a Member
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {memberError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {memberError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="User Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsInviteOpen(false)}
            sx={{ 
              textTransform: 'none',
              color: '#7f8c8d',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleInviteSubmit} 
            variant="contained" 
            disabled={memberLoading}
            sx={{
              background: '#000',
              textTransform: 'none',
              borderRadius: '10px',
              '&:hover': {
                background: '#333',
              }
            }}
          >
            {memberLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Send Invite'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat Drawer */}
      {currentProject && (
        <ChatDrawer 
          open={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          project={currentProject} 
        />
      )}
    </Box>
  );
};

export default ProjectPage;
