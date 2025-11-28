import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
} from '@mui/material';

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#000',
          }}
        >
          DevCollab
        </Typography>
        <Button
          component={Link}
          to="/login"
          sx={{
            color: '#000',
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': {
              background: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Login
        </Button>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 3,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#000',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Build. Collaborate. <span style={{ fontStyle: 'italic' }}>Ship.</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4,
              fontSize: '1rem',
            }}
          >
            A platform built for developers to work together seamlessly.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: '10px',
              background: '#000',
              color: '#fff',
              
              '&:hover': {
                background: '#333',
               
              },
            }}
          >
            Get Started →
          </Button>
        </Container>
      </Box>

      {/* Middle Section - About DevCollab */}
      <Box
        sx={{
          py: 8,
          px: 3,
          background: '#fafafa',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#000',
            }}
          >
            Transforming the Way You Collaborate.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Connect, communicate, and build together like never before with our real-time collaboration tools, designed to streamline your development workflow and transform the way teams work on projects.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000',
              fontWeight: 600,
            }}
          >
            DevCollab is Live!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mt: 1,
            }}
          >
            Join developers already collaborating and building amazing projects together.
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          borderTop: '1px solid #e0e0e0',
          py: 8,
          px: 3,
          background: '#ffffff',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left Side - Features */}
            <Box sx={{ display: 'flex',  gap: 2   }}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 4,
                  color: '#000',
                }}
              >
                Main Features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#000',
                    }}
                  >
                    Real-time Collaboration
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      lineHeight: 1.6,
                    }}
                  >
                    Work together on projects in real-time. See changes as they happen and collaborate seamlessly with your team.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#000',
                    }}
                  >
                    Private Chat
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      lineHeight: 1.6,
                    }}
                  >
                    Communicate with your team through built-in chat. Keep conversations organized and focused on your projects.
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: '#000',
                    }}
                  >
                    Task Management
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      lineHeight: 1.6,
                    }}
                  >
                    Organize your work with powerful task management tools. Track progress and stay on top of deadlines.
                  </Typography>
                </Box>
              </Box>
          </Grid>
              <Grid item xs={7} md={2}>
                <Box
                  component="img"
                  src="/assets/preview_image.png"
                  alt="DevCollab Dashboard Preview"
                  width="100%"
                  height="auto"
                  border="1px solid #000000ff"  
                  borderRadius="10px"
                  boxShadow="4px 6px 4px rgba(0, 0, 0, 0.1)"

                />
            </Grid>
          </Box>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;