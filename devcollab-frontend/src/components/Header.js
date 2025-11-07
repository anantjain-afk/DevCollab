// src/components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const Header = () => {
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <AppBar position="static" 
    sx={{
       boxShadow: " 8px rgba(64, 59, 59, 1)"
    }}>
      <Toolbar>
        {/* The title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DevCollab
        </Typography>

        {/* ... replace the comment with this ... */}
        {userInfo ? (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {userInfo.user.username}
            </Typography>
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
