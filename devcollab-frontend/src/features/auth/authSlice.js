// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Check local storage for existing user info
const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// The initial state of our auth slice
const initialState = {
  userInfo: userInfo, // Can be user object or null
  token: userInfo ? userInfo.token : null, // Extract token for convenience
};

const authSlice = createSlice({
  name: 'auth', // The name of our slice
  initialState,
  // Reducers are functions that define how the state can be updated
  reducers: {
    // This reducer will run when a user successfully logs in
    setCredentials(state, action) {
      state.userInfo = action.payload;
      state.token = action.payload.token;
      // Also save user info to local storage for persistence
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // This reducer will run when a user logs out
    logout(state) {
      state.userInfo = null;
      state.token = null;
      // Clear user info from local storage
      localStorage.removeItem('userInfo');
    },
  },
});

// Export the actions so we can use them in our components
export const { setCredentials, logout } = authSlice.actions;

// Export the reducer to be used in the store
export default authSlice.reducer;