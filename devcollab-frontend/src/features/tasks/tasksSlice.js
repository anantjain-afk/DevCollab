// src/features/tasks/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- INITIAL STATE ---
// This state is ONLY for the modals and actions related to tasks
const initialState = {
  create: {
    loading: false,
    error: null,
  },
  details: {
    loading: false,
    error: null,
  },
};

// --- THUNKS ---
// (These are cut from projectsSlice)

export const createTask = createAsyncThunk(
  'tasks/createTask', // <-- Note the new prefix 'tasks/'
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post('/api/tasks', taskData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus', // <-- new prefix
  async ({ taskId, status, originalStatus }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.patch(`/api/tasks/${taskId}`, { status }, config);
      // We pass along originalStatus for the projectsSlice to use
      return { updatedTask: data, originalStatus }; 
    } catch (error) {
      // Pass all args back on failure for rollback
      return rejectWithValue({ ...error.response.data, originalStatus, taskId });
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask', // <-- new prefix
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      const { taskId, title, description } = taskData;
      const { data } = await axios.patch(`/api/tasks/${taskId}`, { title, description }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask', // <-- new prefix
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/tasks/${taskId}`, config);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
  }
);

// --- THE SLICE ---
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCreateTaskError: (state) => {
      state.create.error = null;
    },
    clearTaskDetailsError: (state) => {
      state.details.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.create.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })
      // Update Task (Details)
      .addCase(updateTask.pending, (state) => {
        state.details.loading = true;
        state.details.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.details.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error = action.payload;
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.details.loading = true;
        state.details.error = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.details.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error = action.payload;
      })
      // Update Task Status (Drag-and-Drop)
      // This action doesn't have a UI modal, so it doesn't need to set loading/error
      .addCase(updateTaskStatus.pending, () => {})
      .addCase(updateTaskStatus.fulfilled, () => {})
      .addCase(updateTaskStatus.rejected, () => {});
  },
});

export const { clearCreateTaskError, clearTaskDetailsError } = tasksSlice.actions;

export default tasksSlice.reducer;