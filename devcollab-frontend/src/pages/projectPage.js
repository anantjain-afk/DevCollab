// src/pages/ProjectPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import KanbanBoard from "../components/KanbanBoard";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjectById,
  clearCurrentProject,
  addMember,        // <-- Add
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
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Typography,
  Button,
  Modal,
  TextField,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
const ProjectPage = () => {
  // 1. This hook reads the "parameters" from the URL
  // We'll tell our router to call the parameter "projectId"
  const { projectId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { error, loading, currentProject } = useSelector(
    (state) => state.projects
  );
  // taskDetails edit and delete  : 
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = currentProject?.tasks.find(t => t.id === selectedTaskId) || null;
  
  // Add: get create state from tasks slice
  const { loading: creating, error: createError } = useSelector(
    (state) => state.tasks.create
  );
  // console.log(currentProject)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, projectId]);

  // state for createTask window
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  // Add: state for member modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
const [inviteEmail, setInviteEmail] = useState('');
  const { loading: memberLoading, error: memberError } = useSelector(
  (state) => state.projects.memberModal
);
  // helper functions :
  function handleOpen() {
    setOpen(true);
    dispatch(clearCreateTaskError()); // clear error on open
  }
  function handleClose() {
    setOpen(false);
    setTitle(""); // Clear the form
    dispatch(clearCreateTaskError()); // clear error on close
  };

  // handleSubmit :
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTask({ title, projectId })).unwrap();
      handleClose();
    } catch (error) {
      // error handled in slice
    }
  };

  // handle task click : 
  const handleTaskClick = (task) => {
  setSelectedTaskId(task.id); // <-- Store the ID
  setIsTaskModalOpen(true);
};
const handleTaskModalClose = () => {
  setSelectedTaskId(null); // <-- Clear the ID
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
    // Refresh the project to see the new member in the list!
    dispatch(fetchProjectById(projectId));
  }
};
  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Project Workspace</Typography>
          {/* new chat button */}
          <Button 
    variant="contained" 
    color="secondary" 
    onClick={() => setIsChatOpen(true)}
    sx={{ mr: 1 }}
  >
    Chat
  </Button>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <Button variant="outlined">&larr; Back to Dashboard</Button>
          </Link>
        </Box>

        {/* --- This is the new conditional rendering logic --- */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : currentProject ? (
          // This is the "Success" state
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mt: 2,
              border: "1px solid #ddd",
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {currentProject.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentProject.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* --- Render the Members List --- */}
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <Button variant="outlined" size="small" onClick={handleInviteOpen}>
    + Invite
  </Button>
            <List dense>
              {currentProject.members.map((member) => (
                <ListItem key={member.userId}>
                  <ListItemText
                    primary={member.user.username}
                    secondary={member.user.email}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
              Add New Task
            </Button>
            <Typography variant="h6" gutterBottom>
              Tasks
            </Typography>
            {/* --- Render the Tasks Kanban Board --- */}
            <KanbanBoard tasks={currentProject.tasks} onTaskClick={handleTaskClick} />
          </Paper>
        ) : (
          <Typography>No project found.</Typography>
        )}
      </Container>
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            // Same style as your other modals
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #aaa",
            boxShadow: "8px 8px rgba(64, 59, 59, 1)",
            borderRadius: "10px",
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Add a New Task
          </Typography>
          <Box component="form" onSubmit={handleSubmitTask} sx={{ mt: 2 }}>
            {/* Show create error from tasks slice, not project error */}
            {createError && (
              <Alert severity="error" sx={{ mb: 2 }}>
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={creating}
            >
              {creating ? <CircularProgress size={24} /> : "Create Task"}
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
<Dialog open={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
  <DialogTitle>Invite a Member</DialogTitle>
  <DialogContent sx={{ pt: 2, minWidth: 300 }}>
    {memberError && <Alert severity="error" sx={{ mb: 2 }}>{memberError}</Alert>}
    <TextField
      autoFocus
      margin="dense"
      label="User Email Address"
      type="email"
      fullWidth
      variant="outlined"
      value={inviteEmail}
      onChange={(e) => setInviteEmail(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsInviteOpen(false)}>Cancel</Button>
    <Button onClick={handleInviteSubmit} variant="contained" disabled={memberLoading}>
      {memberLoading ? <CircularProgress size={24} /> : 'Send Invite'}
    </Button>
  </DialogActions>
</Dialog>
{currentProject && (
        <ChatDrawer 
          open={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          project={currentProject} 
        />
      )}
    </div>
  );
};

export default ProjectPage;
