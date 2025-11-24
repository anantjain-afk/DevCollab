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
              border: '2px solid #000',
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '6px 6px rgba(229, 222, 222, 1)',
              '&:hover': {
                background: '#333',
                transform: 'translate(-2px, -2px)',
                boxShadow: '8px 8px rgba(165, 157, 157, 1)',
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
            <Grid item xs={12} md={6}>
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

            {/* Right Side - Placeholder Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '400px',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                  borderRadius: '12px',
                  border: '2px solid #aaa',
                  boxShadow: '6px 6px rgba(64, 59, 59, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#999',
                    fontStyle: 'italic',
                  }}
                >
                  Preview Image
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;