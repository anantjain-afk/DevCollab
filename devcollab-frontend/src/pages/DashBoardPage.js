// src/pages/DashboardPage.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects , createProject , clearError } from "../features/projects/projectsSlice";
import { Link } from 'react-router-dom';
// Your existing imports
import Header from "../components/Header";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Button , 
  Modal, 
  TextField
} from "@mui/material";

const DashBoardPage = () => {
  const dispatch = useDispatch();

  // local States : 
  const [open , setOpen] = useState(false) ;
  const [name , setName] = useState('');
  const [description , setDescription] = useState('') ; 
  const { userInfo } = useSelector((state) => state.auth);
  const { projects, loading, error , create } = useSelector((state) => state.projects);
  

  const handleOpen = () => {
    dispatch(clearError());
    setOpen(true)};
  const handleClose = () => setOpen(false);

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    console.log(2)
    try {
      // Dispatch our new thunk with the data from local state
      await dispatch(createProject({ name, description })).unwrap();

      // If it succeeds:
      handleClose(); // Close the modal
      setName('');     // Clear the form
      setDescription(''); // Clear the form

    } catch (err) {
      // If it fails, the 'error' state in Redux is already set.
      // The .unwrap() will throw the error, and we catch it here.
      console.error('Failed to create project:', err);
    }
  };


  useEffect(() => {
  // Only fetch projects if the user is logged in
  // AND our projects array is currently empty.
  if (userInfo && projects.length === 0) {
    dispatch(fetchProjects());
  }
}, [dispatch, userInfo, projects.length]); // <-- Add projects.length

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Projects
        </Typography>

         <Button 
      variant="contained" 
      onClick={handleOpen} 
      sx={{ mb: 3 }}
    >
      Create New Project
    </Button>

       
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
  // VVV 1. Wrap the Paper in a Link
  <Link 
    to={`/project/${project.id}`} // <-- 2. Set the dynamic URL
    key={project.id} 
    style={{ textDecoration: 'none' }} // <-- 3. Remove the ugly underline
  >
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 2, 
        border: '1px solid #ddd', 
        boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
        '&:hover': { // <-- 4. (Optional) Add a nice hover effect
          boxShadow: '8px 8px 10px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-2px)'
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Typography variant="h6" sx={{ color: 'primary.main' }}>
        {project.name}
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        {project.description}
      </Typography>
    </Paper>
  </Link>
))
            )}
          </Box>
        )}
      </Container>
      

      <Modal
      open = {open} 
      onClose={handleClose}
      aria-labelledby="create-project-modal-title"

      >
        <Paper
      sx={{
        // This style is to make it look like your login/register forms
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #aaa',
        boxShadow: '8px 8px rgba(64, 59, 59, 1)',
        borderRadius: '10px',
        p: 4, // padding
      }}
    >
      <Typography id="create-project-modal-title" variant="h6" component="h2">
        Create a New Project
      </Typography>

      <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmitProject}>
        {create.error && <Alert severity="error" sx={{ mb: 2 }}>{create.error}</Alert>}
        <TextField
          label="Project Name"
          margin="normal"
          required
          fullWidth
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description (Optional)"
          margin="normal"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{ mt: 3, mb: 2 }}
  disabled={create.loading} // <-- ADD THIS
>
  {create.loading ? <CircularProgress size={24} /> : 'Create'}
</Button>
      </Box>
    </Paper>
      </Modal>
    </div>
  );
};

export default DashBoardPage;
