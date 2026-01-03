import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button, Grid, Paper, Fade } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CodeIcon from "@mui/icons-material/Code";
import Threads from "../components/Thread";

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: "Task Management",
      description: "Track tasks visually and stay ahead of deadlines with our intuitive Kanban board.",
      icon: <TaskAltIcon />,
      type: "image",
      content: "/assets/task_management.png"
    },
    {
      id: 1,
      title: "Real-time Chat",
      description: "Communicate with your team instantly. Keep conversations organized by project.",
      icon: <ChatIcon />,
      type: "code",
      content: `
// Chat Message
const message = {
  sender: "Sarah",
  content: "Hey team, the API is ready!",
  timestamp: "10:42 AM",
  project: "Frontend-Revamp"
};
      `
    },
    {
      id: 2,
      title: "Code Snippets",
      description: "Share and manage code snippets directly within your project workspace.",
      icon: <CodeIcon />,
      type: "code",
      content: `
// Shared Snippet
function calculateMetric(data) {
  return data.reduce((acc, val) => acc + val, 0);
}
// Shared by: Mike
      `
    },
    {
      id: 3,
      title: "Project Rooms",
      description: "Centralized workspaces for each project with dedicated members and resources.",
      icon: <GroupsIcon />,
      type: "image",
      content: "/assets/project_rooms.png"
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.5px", color: "#000" }}>
          DevCollab
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/login"
            sx={{
              color: "#000",
              mr: 2,
              textTransform: "none",
              "&:hover": { color: "#333" },
            }}
          >
            Log in
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              background: "#000",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { background: "#333" },
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
          py: 8,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Threads Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: "none"
          }}
        >
          <Threads 
            color={[0, 0, 0]}
            amplitude={4}
            distance={2}
            enableMouseInteraction={false}
          />

        </Box>
        {/* Hero Content */}
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              color: "#000",
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Build.{" "}
            <span style={{ borderBottom: "2px dashed black" }}>
              Collaborate
            </span>
            . <span style={{ fontStyle: "italic" }}>Ship.</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mb: 4,
              fontSize: "1rem",
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
              borderRadius: "1px",
              background: "#000",
              color: "#fff",

              "&:hover": {
                background: "#333",
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
          background: "#fafafa",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: "#000",
            }}
          >
            Transforming the Way You Collaborate.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Connect, communicate, and build together like never before with our
            real-time collaboration tools, designed to streamline your
            development workflow and transform the way teams work on projects.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#000",
              fontWeight: 600,
            }}
          >
            DevCollab is Live!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mt: 1,
            }}
          >
            Join developers already collaborating and building amazing projects
            together.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 12, mt: 15, textAlign: "center" }}>
        
        {/* Feature Section Container - Light Themed as requested */}
        <Box sx={{ 
          background: "#ffffff", 
          borderRadius: "32px", 
          p: { xs: 2, md: 6 },
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #e0e0e0"
        }}>
          {/* Feature Navigation Pills */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 6,
            }}
          >
            {features.map((feature, index) => (
              <Button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                startIcon={feature.icon}
                sx={{
                  borderRadius: "30px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  border: activeFeature === index ? "1px solid #000" : "1px solid #e0e0e0",
                  background: activeFeature === index ? "#000" : "transparent",
                  color: activeFeature === index ? "#fff" : "#666",
                  "&:hover": {
                    background: activeFeature === index ? "#333" : "#f5f5f5",
                    border: activeFeature === index ? "1px solid #000" : "1px solid #ccc",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {feature.title}
              </Button>
            ))}
          </Box>

          {/* Feature Showcase Area */}
          <Paper
            elevation={0}
            sx={{
              background: "#fafafa",
              border: "1px solid #e0e0e0",
              borderRadius: "24px",
              overflow: "hidden",
              position: "relative",
              textAlign: "left",
              minHeight: "400px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, height: "100%" }}>
              {/* Left Content */}
              <Box 
                sx={{ 
                  width: { xs: "100%", md: "40%" }, 
                  p: { xs: 4, md: 6 }, 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center",
                  borderRight: { md: "1px solid #e0e0e0" },
                  borderBottom: { xs: "1px solid #e0e0e0", md: "none" }
                }}
              >
                <Fade in={true} key={activeFeature} timeout={500}>
                  <Box>
                    <Typography variant="h4" sx={{ color: "#000", mb: 2, fontWeight: 600 }}>
                      {features[activeFeature].title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.7 }}>
                      {features[activeFeature].description}
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ color: "#000", fontWeight: 600, cursor: "pointer" }}>
                        Learn more
                      </Typography>
                      <Typography sx={{ color: "#000" }}>→</Typography>
                    </Box>
                  </Box>
                </Fade>
              </Box>

              {/* Right Visual (Image or Code) */}
              <Box 
                sx={{ 
                  width: { xs: "100%", md: "60%" }, 
                  background: "#f0f0f0", 
                  p: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px"
                }}
              >
                <Fade in={true} key={`visual-${activeFeature}`} timeout={700}>
                  {features[activeFeature].type === "code" ? (
                    <Box
                      sx={{
                        width: "100%",
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        p: 3,
                        fontFamily: "'Fira Code', monospace",
                        fontSize: "0.9rem",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                      </Box>
                      <pre style={{ margin: 0, color: "#333", overflowX: "auto" }}>
                        {features[activeFeature].content}
                      </pre>
                      <Box sx={{ mt: 2, textAlign: "right" }}>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            background: "#000", 
                            color: "#fff",
                            boxShadow: "none",
                            textTransform: "none",
                            "&:hover": {
                              background: "#333",
                              boxShadow: "none",
                            }
                          }}
                        >
                          Run
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      component="img"
                      src={features[activeFeature].content}
                      alt={features[activeFeature].title}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "350px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                    />
                  )}
                </Fade>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
