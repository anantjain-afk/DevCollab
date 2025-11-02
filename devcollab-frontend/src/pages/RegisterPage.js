import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { register, resetAuth } from "../features/auth/authSlice";
const RegisterPage = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // this is how we read from the redux store .
  const { loading, error, success } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault(); //this is to stop reloading when submitting .
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    dispatch(register({ username, email, password }));
  };

  useEffect(() => {
    if (success) {
      setMessage("Registration successful! Redirecting to login...");

      // Store the timer in a variable
      const timer = setTimeout(() => {
        dispatch(resetAuth());
        navigate("/login");
      }, 3000);

      // Return a cleanup function *for the timer*
      return () => clearTimeout(timer);
    }

    // This is the cleanup for when the component *unmounts*
  }, [navigate, dispatch, success]);
  useEffect(() => {
    return () => {
      dispatch(resetAuth());
    };
  }, [dispatch]);
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3} // This controls the shadow (3 is a good starting point)
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          borderRadius: "10px",
          flexDirection: "column",
          alignItems: "center",

          boxShadow: "8px 8px rgba(64, 59, 59, 1)",
          // We'll add a subtle border like the one in your screenshot
          border: "2px solid #aaa",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up for DevCollab
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert
              severity={success ? "success" : "error"}
              sx={{ width: "100%", mb: 2 }}
            >
              {message}
            </Alert>
          )}
          <TextField
            label="Username"
            value={username}
            margin="normal"
            required
            fullWidth
            onChange={(e) => setUserName(e.target.value)}
          ></TextField>
          <TextField
            label="Email Address"
            value={email}
            margin="normal"
            required
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
          <TextField
            label="Password"
            value={password}
            margin="normal"
            required
            fullWidth
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
          <TextField
            label="Confirm Password"
            value={confirmPassword}
            margin="normal"
            required
            fullWidth
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </Box>
        <Link to="/login">Already have an account? Login</Link>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
