import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Typography,
  Container,
  Box,
  TextField,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { login, resetAuth } from "../features/auth/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, userInfo } = useSelector((state) => state.auth);
  
  const handleSubmit = async (e) => {
    // console.log('--- HANDLE SUBMIT CALLED ---');
    e.preventDefault(); // This is still correct!
    // debugger; 

  try {
    // dispatch() returns a promise that we can await.
    // .unwrap() is a helper that will either:
    // 1. Return the 'payload' from the .fulfilled action
    // 2. Throw the 'payload' from the .rejected action

    await dispatch(login({ email, password })).unwrap();

    // If the line above succeeds, login was successful.
    // The 'userInfo' state will update, and your
    // useEffect hook will handle the navigation.

  } catch (err) {
    // We 'catch' the error here.
    // The 'error' state in Redux is already set by your reducer,
    // so we don't have to do anything else.
    // The component will re-render and show the <Alert>.
    // Most importantly, the page won't reload!
    console.error('Failed to log in:', err);
  };}

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    // This runs when the component mounts and returns a cleanup function
    return () => {
      
      dispatch(resetAuth());
    };
  }, [dispatch]);

  return (
    <>
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
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              label="Email"
              margin="normal"
              required
              fullWidth
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
            <TextField
              label="Password"
              margin="normal"
              required
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>

          <Link to="/register">Don't have an account? Sign Up</Link>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
