// src/components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center'  , margin :"5px"}} >
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        background: "#ffffff",
        border: "1px solid #000000ff",
        borderRadius : "30px",
        boxShadow: "",
        width: "60%",
        


        zIndex: 1200,
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
            fontStyle: "italic",
            color: "#000",
          }}
        >
          <Link
            to={userInfo ? "/dashboard" : "/"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span
              style={{
                border: "2px solid #070707ff",
                padding: "4px",
                boxShadow: "4px 4px rgba(0,0,0)",
                backgroundColor: "#f5f5f5ff",
              }}
            >
              DevCollab
            </span>
          </Link>
        </Typography>

        {/* ... replace the comment with this ... */}
        {userInfo ? (
          <>
            <Typography
              variant="body1"
              sx={{
                mr: 3,
                color: "#000000ff",
                fontWeight: "Bold",
                borderBottom: "1px solid #666",
              }}
            >
              {userInfo.user.username}
            </Typography>
            <Button
              onClick={logoutHandler}
              sx={{
                color: "#000",
                textTransform: "none",
                border: "1px solid #e0e0e0",
                borderRadius: "0px",
                px: 2,
                "&:hover": {
                  background: "#f5f5f5",
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
              color: "#000",
              textTransform: "none",
              "&:hover": {
                background: "#f5f5f5",
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
    </div>
  );
};

export default Header;
