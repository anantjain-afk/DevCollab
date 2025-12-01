import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FolderIcon from "@mui/icons-material/Folder";
import FeatureCard from "../components/featureCard";
const HomePage = () => {
  const features = [
    {
      icon: <GroupsIcon sx={{ fontSize: "3rem" }} />,
      title: "Real-time Collaboration",
      description:
        "Work together instantly with live updates on every project.",
    },
    {
      icon: <ChatIcon sx={{ fontSize: "3rem" }} />,
      title: "Private Chat",
      description:
        "Communicate with your team and keep conversations organized.",
    },
    {
      icon: <TaskAltIcon sx={{ fontSize: "3rem" }} />,
      title: "Task Management",
      description: "Track tasks visually and stay ahead of deadlines.",
    },
    {
      icon: <FolderIcon sx={{ fontSize: "3rem" }} />,
      title: "Project Rooms",
      description: "Centralized workspaces for each project.",
    },
  ];
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 2,
        }}
      >
        <span
          style={{
            border: "2px solid #070707ff",
            padding: "6px",
            boxShadow: "4px 4px rgba(0,0,0)",
            backgroundColor: "#f5f5f5ff",
          }}
        >
          DevCollab
        </span>
        <Button
          component={Link}
          to="/login"
          sx={{
            px: 3,
            py: 1.2,

            background: "#000",
            color: "#fff",

            "&:hover": {
              background: "#333",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
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

      {/* Features Section */}
      <Box
        sx={{
          borderTop: "1px solid #e0e0e0",
          py: 10,
          px: 3,
          background: "#ffffff",
        }}
      >
        <Container
          width="100%"
          maxWidth="lg"
          sx={{
            border: "2px dashed black",
            padding: "10px",
            borderRadius: "3px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 8,
              color: "#000",
              textAlign: "center",
            }}
          >
            <span style={{ borderBottom: "3px solid black" }}>
              Main Features
            </span>
          </Typography>
          <div
            style={{
              display: "grid",

              gap: "30px",
              gridTemplateColumns: "1fr 1fr",
              justifyItems: "center",
            }}
          >
            {features.map((item) => (
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
