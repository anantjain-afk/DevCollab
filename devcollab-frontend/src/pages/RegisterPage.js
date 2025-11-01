import { useState, React } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
const RegisterPage = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component={'h1'} variant="h5" ></Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
