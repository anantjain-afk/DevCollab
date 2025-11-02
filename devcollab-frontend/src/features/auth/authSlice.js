// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get user info from local storage
const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userInfo: userInfo,
  token: userInfo ? userInfo.token : null,
  loading: false,
  error: null,
  success: false, // Will be true on successful registration
};

// This is our Thunk for registering a user
export const register = createAsyncThunk(
  "auth/register", // action type string
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Thanks to our proxy, we can just use '/api/auth/register'
      const { data } = await axios.post(
        "/api/auth/register",
        { username, email, password },
        config
      );

      // Return the user data on success
      return data;
    } catch (error) {
      // Use rejectWithValue to send the error message as a payload
      return rejectWithValue(
        error.response ? error.response.data.error : error.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "api/auth/login",
        { email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.error : error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to reset error/success states, e.g., when navigating away
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCredentials(state, action) {
      // (We will use this for LOGIN, not register)
      state.userInfo = action.payload;
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout(state) {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
    },
  },
  // We use extraReducers to handle the state changes from createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // Registration was successful
        // We don't log the user in here, we just set success
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The error message from rejectWithValue
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        authSlice.caseReducers.setCredentials(state, action);
        // We call setCredentials to save the user info and token
        // We use authSlice.caseReducers.setCredentials(state, action) to call one reducer from another.
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { setCredentials, logout, resetAuth } = authSlice.actions;

export default authSlice.reducer;
