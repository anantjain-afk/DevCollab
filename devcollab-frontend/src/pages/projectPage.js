// src/pages/ProjectPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import KanbanBoard from "../components/KanbanBoard";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjectById,
  clearCurrentProject,
  addMember,
  clearMemberError,
  taskCreatedFromSocket,
  taskUpdatedFromSocket,
  taskDeletedFromSocket,
} from "../features/projects/projectsSlice";
import { useSocket } from "../context/SocketContext";
import { createTask, clearCreateTaskError } from "../features/tasks/tasksSlice";
import { deleteProject } from "../features/projects/projectsSlice";
import TaskDetailsModal from "../components/TaskDetailsModal";
import ChatDrawer from "../components/ChatDrawer";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import EditProject from "../components/EditProjectCard";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { error, loading, currentProject } = useSelector(
    (state) => state.projects
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { loading: deleteLoading, error: deleteError } = useSelector(
    (state) => state.projects.delete || { loading: false, error: null }
  );
  const navigate = useNavigate();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask =
    currentProject?.tasks.find((t) => t.id === selectedTaskId) || null;

  const { loading: creating, error: createError } = useSelector(
    (state) => state.tasks.create
  );

  const dispatch = useDispatch();
  const socket = useSocket();

  // Track recently created/updated/deleted task IDs to prevent socket duplicates
  const recentTaskActionsRef = React.useRef(new Set());

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, projectId]);

  // Socket event listeners for real-time task updates
  useEffect(() => {
    if (!socket || !projectId) return;

    // Join the project room
    socket.emit("joinProject", projectId);

    // Get current user ID (works with payload shaped as { user, token } or { id, token })
    const currentUserId =
      userInfo?.user?.id || userInfo?.id || userInfo?.userId;

    // Listen for task events
    const handleTaskCreated = (data) => {
      const taskId = data.task?.id;

      // Skip if we just created this task (within last 2 seconds)
      if (taskId && recentTaskActionsRef.current.has(taskId)) {
        console.log("Ignoring duplicate taskCreated from socket:", taskId);
        return;
      }

      // Ignore if this event was triggered by the current user (use == to handle string/number)
      if (data.userId == currentUserId) {
        return;
      }
      dispatch(taskCreatedFromSocket(data.task));
    };

    const handleTaskUpdated = (data) => {
      const taskId = data.task?.id;

      // Skip if we just updated this task
      if (taskId && recentTaskActionsRef.current.has(taskId)) {
        return;
      }

      // Ignore if this event was triggered by the current user
      if (data.userId == currentUserId) return;
      dispatch(taskUpdatedFromSocket(data.task));
    };

    const handleTaskDeleted = (data) => {
      const taskId = data.taskId;

      // Skip if we just deleted this task
      if (taskId && recentTaskActionsRef.current.has(taskId)) {
        return;
      }

      // Ignore if this event was triggered by the current user
      if (data.userId == currentUserId) return;
      dispatch(taskDeletedFromSocket({ taskId: data.taskId }));
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);

    // Cleanup listeners on unmount
    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
    };
  }, [socket, projectId, dispatch, userInfo]);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editOpen , setEditOpen] = useState(false);


  const { loading: memberLoading, error: memberError } = useSelector(
    (state) => state.projects.memberModal
  );

  // Contributor badge colors (light, vibrant palette)
  const contributorColors = [
    { bg: "#e3f2fd", text: "#1976d2" }, // light blue
    { bg: "#f3e5f5", text: "#7b1fa2" }, // light purple
    { bg: "#e8f5e9", text: "#388e3c" }, // light green
    { bg: "#fff3e0", text: "#f57c00" }, // light orange
    { bg: "#fce4ec", text: "#c2185b" }, // light pink
    { bg: "#e0f2f1", text: "#00796b" }, // light teal
  ];

  function handleOpen() {
    setOpen(true);
    dispatch(clearCreateTaskError());
  }

  function handleClose() {
    setOpen(false);
    setTitle("");
    setAssigneeId("");
    dispatch(clearCreateTaskError());
  }

  const currentUserId = userInfo?.user?.id || userInfo?.id || userInfo?.userId;
  const isAdmin = currentProject?.members?.some(
    (m) => m.userId === currentUserId && m.role === "ADMIN"
  );

  const handleOpenDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const confirmDeleteProject = async () => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      // on success navigate back to dashboard
      navigate("/dashboard");
    } catch (err) {
      // error saved in slice; optionally log
      console.error("Delete failed", err);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        createTask({ title, projectId, assigneeId: assigneeId || null })
      ).unwrap();

      // Track this task ID to prevent duplicate from socket
      if (result?.id) {
        recentTaskActionsRef.current.add(result.id);
        // Remove from tracking after 2 seconds
        setTimeout(() => {
          recentTaskActionsRef.current.delete(result.id);
        }, 2000);
      }

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
      setInviteEmail("");
      dispatch(fetchProjectById(projectId));
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
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
              color: "#000",
              mb: 1,
              display: "inline-block",
              borderBottom: "3px solid #000",
              pb: 0.5,
            }}
          >
            Project Workspace
          
          </Typography>


          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#000",
                  color: "#000",
                  px: 3,
                  py: 1,
                  borderRadius: "0px",
                  "&:hover": {
                    borderColor: "#333",
                    background: "rgba(0, 0, 0, 0.05)",
                  },
                }}
                onClick={() => {
                  setEditOpen(true)
                }}
              >
                edit
              </Button>
            <Button
              variant="contained"
              onClick={() => setIsChatOpen(true)}
              sx={{
                color: "#fff",
                background: "#000",
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: "0px",
                boxShadow: "none",
                "&:hover": {
                  background: "#333",
                  boxShadow: "none",
                },
              }}
            >
              Chat
            </Button>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#000",
                  color: "#000",
                  px: 3,
                  py: 1,
                  borderRadius: "0px",
                  "&:hover": {
                    borderColor: "#333",
                    background: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                ← Back to Dashboard
              </Button>
            </Link>
            {isAdmin && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleOpenDelete}
                sx={{ textTransform: "none", borderRadius: "0px" }}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <CircularProgress size={18} />
                ) : (
                  "Delete Project"
                )}
              </Button>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: "#667eea" }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        ) : currentProject ? (
          <Box>
            {/* Project Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 3,
                background: "#f5f5f5ff",
                border: "2px solid #070707ff",

                boxShadow: "4px 4px rgba(0,0,0)",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "#000000ff",
                  border: "2px solid #070707ff",
                  padding: "4px",
                  boxShadow: "4px 4px rgba(0,0,0)",
                  borderBottom: "1px solid #000000ff",
                  pb: 0.5,
                  width: "fit-content",
                }}
              >
                {currentProject.name}
                
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: "#586162ff",

                  pb: 0.5,
                  width: "fit-content",
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {currentProject.description}
              </Typography>

              {/* Contributors Section */}
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#2c3e50",
                      fontSize: "1.1rem",
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
                      background: "#000",
                      textTransform: "none",
                      px: 2,
                      borderRadius: "0px",
                      "&:hover": {
                        background: "#333",
                      },
                    }}
                  >
                    Invite
                  </Button>
                </Box>

                {/* Tech Badge Style Contributors */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  {currentProject.members.map((member, index) => {
                    const colorScheme =
                      contributorColors[index % contributorColors.length];
                    return (
                      <Chip
                        key={member.userId}
                        icon={
                          <PersonIcon
                            sx={{ color: `${colorScheme.text} !important` }}
                          />
                        }
                        label={member.user.username}
                        sx={{
                          background: colorScheme.bg,
                          color: colorScheme.text,
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          px: 1,
                          py: 2.5,
                          borderRadius: 0,

                          boxShadow: `4px 4px ${colorScheme.text}90`,
                          border: `1px solid ${colorScheme.text}20`,
                          "& .MuiChip-label": {
                            px: 1,
                          },
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
                background: "#f5f5f5ff",
                border: "2px solid #070707ff",

                boxShadow: "4px 4px rgba(0,0,0)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    borderBottom: "1px solid #2c3e50",
                    border: "2px solid #070707ff",
                    padding: "4px",
                    boxShadow: "4px 4px rgba(0,0,0)",
                  }}
                >
                  Tasks
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                  sx={{
                    background: "#000",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    borderRadius: "00px",
                    "&:hover": {
                      background: "#333",
                    },
                  }}
                >
                  Add New Task
                </Button>
              </Box>
              <KanbanBoard
                tasks={currentProject.tasks}
                onTaskClick={handleTaskClick}
              />
            </Paper>
          </Box>
        ) : (
          <Typography sx={{ color: "#7f8c8d" }}>No project found.</Typography>
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
            borderRadius: 0,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Assignee</InputLabel>
              <Select
                value={assigneeId}
                label="Assignee"
                onChange={(e) => setAssigneeId(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {currentProject?.members?.map((member) => (
                  <MenuItem key={member.userId} value={member.userId}>
                    {member.user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "#000",
                textTransform: "none",
                py: 1.2,
                borderRadius: "0px",
                "&:hover": {
                  background: "#333",
                },
              }}
              disabled={creating}
            >
              {creating ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Create Task"
              )}
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Task Details Modal */}
      <TaskDetailsModal
        open={isTaskModalOpen}
        onClose={handleTaskModalClose}
        task={selectedTask}
        currentProject={currentProject}
      />

      {/* Invite Member Dialog */}
      <Dialog
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#2c3e50" }}>
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
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsInviteOpen(false)}
            sx={{
              textTransform: "none",
              color: "#7f8c8d",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInviteSubmit}
            variant="contained"
            disabled={memberLoading}
            sx={{
              background: "#000",
              textTransform: "none",
              borderRadius: "0px",
              "&:hover": {
                background: "#333",
              },
            }}
          >
            {memberLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Send Invite"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={handleCloseDelete}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#2c3e50" }}>
          Delete Project
        </DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to permanently delete this project? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDelete}
            sx={{ textTransform: "none", color: "#7f8c8d" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteProject}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            sx={{ textTransform: "none" }}
          >
            {deleteLoading ? <CircularProgress size={18} /> : "Delete Project"}
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
    
      <EditProject
        open = {editOpen}
        onClose = {() => setEditOpen(false)}
      ></EditProject>

    </Box>
  );
};

export default ProjectPage;
