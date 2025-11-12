// src/pages/ProjectPage.js
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjectById,
  clearCurrentProject,
} from "../features/projects/projectsSlice";
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
  Button
} from "@mui/material";
const ProjectPage = () => {
  // 1. This hook reads the "parameters" from the URL
  // We'll tell our router to call the parameter "projectId"
  const { projectId } = useParams();

  const { error, loading, currentProject } = useSelector(
    (state) => state.projects
  );
  console.log(currentProject)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProjectById(projectId));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, projectId]);

  // src/pages/ProjectPage.js

  // ... (all the logic from Part 1)

  // VVV REPLACE YOUR ENTIRE RETURN WITH THIS VVV

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Project Workspace
          </Typography>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Button variant="outlined">&larr; Back to Dashboard</Button>
          </Link>
        </Box>

        {/* --- This is the new conditional rendering logic --- */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
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
              border: '1px solid #ddd', 
              boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)' 
            }}
          >
            <Typography variant="h5" gutterBottom>{currentProject.name}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentProject.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* --- Render the Members List --- */}
            <Typography variant="h6" gutterBottom>Members</Typography>
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

            {/* --- Render the Tasks List (Placeholder) --- */}
            <Typography variant="h6" gutterBottom>Tasks</Typography>
            {currentProject.tasks.length === 0 ? (
              <Typography>No tasks for this project yet.</Typography>
            ) : (
              <List dense>
                {currentProject.tasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemText 
                      primary={task.title} 
                      secondary={task.status} 
                    />
                  </ListItem>
                ))}
              </List>
            )}

          </Paper>
        ) : (
          <Typography>No project found.</Typography>
        )}

      </Container>
    </div>
  );
};

export default ProjectPage;