// src/components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
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
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        {/* The title */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#000',
          }}
        >
          DevCollab
        </Typography>

        {/* ... replace the comment with this ... */}
        {userInfo ? (
          <>
            <Typography 
              variant="body2" 
              sx={{ 
                mr: 3,
                color: '#666',
              }}
            >
              {userInfo.user.username}
            </Typography>
            <Button 
              onClick={logoutHandler}
              sx={{
                color: '#000',
                textTransform: 'none',
                border: '1px solid #e0e0e0',
                px: 2,
                '&:hover': {
                  background: '#f5f5f5',
                },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => navigate("/login")}
            sx={{
              color: '#000',
              textTransform: 'none',
              '&:hover': {
                background: '#f5f5f5',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
