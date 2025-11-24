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
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

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
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Container sx={{ mt: 5, mb: 5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: '#000',
              mb: 1,
            }}
          >
            Your Projects
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
            }}
          >
            Manage and collaborate on your projects
          </Typography>
        </Box>

        {/* Create Project Button */}
        <Button 
          variant="outlined" 
          onClick={handleOpen} 
          startIcon={<AddIcon />}
          sx={{ 
            mb: 4,
            color: '#000',
            background: '#fff',
            border: '2px solid #aaa',
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: '10px',
            boxShadow: '4px 4px rgba(64, 59, 59, 0.8)',
            '&:hover': {
              background: '#f5f5f5',
              transform: 'translate(-2px, -2px)',
              boxShadow: '6px 6px rgba(64, 59, 59, 1)',
            },
          }}
        >
          Create New Project
        </Button>

        {/* This is our conditional rendering logic */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#000' }} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error"
            sx={{
              border: '1px solid #f44336',
              borderRadius: '8px',
            }}
          >
            {error}
          </Alert>
        ) : (
          <Box>
            {/* We map over the projects array and render one for each */}
            {projects.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  border: '2px solid #aaa',
                  borderRadius: '12px',
                  background: '#ffffff',
                }}
              >
                <Typography sx={{ color: '#666' }}>
                  You are not a member of any projects yet.
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                  Create your first project to get started!
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {projects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        border: '2px solid #aaa',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        boxShadow: '6px 6px rgba(64, 59, 59, 1)',
                        '&:hover': {
                          boxShadow: '8px 8px rgba(64, 59, 59, 1)',
                          transform: 'translate(-2px, -2px)',
                        },
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        to={`/project/${project.id}`}
                        sx={{ height: '100%' }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#000',
                              fontWeight: 600,
                              mb: 1.5,
                            }}
                          >
                            {project.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666',
                              lineHeight: 1.6,
                            }}
                          >
                            {project.description || 'No description provided'}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
      <Typography 
        id="create-project-modal-title" 
        variant="h6" 
        component="h2"
        sx={{
          fontWeight: 600,
          color: '#000',
          mb: 1,
        }}
      >
        Create a New Project
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#666',
          mb: 3,
        }}
      >
        Start collaborating with your team
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
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#000',
              },
            },
          }}
        />
        <TextField
          label="Description (Optional)"
          margin="normal"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#000',
              },
            },
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
            color: '#fff',
            textTransform: 'none',
            py: 1.2,
            '&:hover': {
              background: '#333',
            },
          }}
          disabled={create.loading}
        >
          {create.loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Project'}
        </Button>
      </Box>
    </Paper>
      </Modal>
    </Box>
  );
};

export default DashBoardPage;
