// src/pages/DashboardPage.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../features/projects/projectsSlice";

// Your existing imports
import Header from "../components/Header";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper
} from "@mui/material";

const DashBoardPage = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, userInfo]);

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Projects
        </Typography>

        {/* This is our conditional rendering logic */}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            {/* We map over the projects array and render one for each */}
            {projects.length === 0 ? (
              <Typography>You are not a member of any projects yet.</Typography>
            ) : (
              projects.map((project) => (
                <Paper
                  key={project.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #ddd",
                    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography>{project.description}</Typography>
                </Paper>
              ))
            )}
          </Box>
        )}
      </Container>
    </div>
  );
};

export default DashBoardPage;
