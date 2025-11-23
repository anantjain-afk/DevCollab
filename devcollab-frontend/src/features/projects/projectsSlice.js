import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
// importing the logout action to clear out all the projects from the userInfo when user logout so that
// when the other user logs in from the same computer it will not see the previously logged in user's projects .
import { logout } from "../auth/authSlice";
import { 
  createTask,  
  updateTask, 
  deleteTask 
} from '../tasks/tasksSlice';

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (arg, { getState, rejectWithValue }) => {
    try {
      // We use getState() to access the *entire* Redux state
      const { auth } = getState();
      const { token } = auth.userInfo; // Get the token from the auth slice

      // We configure our headers to include the Bearer Token
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      };
      // Now we make our authenticated request
      const { data } = await api.get("/api/projects", config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.error : error.message
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { getState, rejectWithValue }) => {
    // getState prop allows to have complete store or all states inside this async function
    // This is useful when you need data already stored in Redux (like an auth token, user ID, etc.)

    try {
      const { auth } = getState();
      const { token } = auth.userInfo;

      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await api.post("/api/projects", projectData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.error : error.message
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.get(`/api/projects/${projectId}`, config);
      return data;
    } catch (error) {
      rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);


// src/features/projects/projectsSlice.js

// VVV ADD THIS THUNK VVV
export const addMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, email }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Call the API endpoint we built way back in Phase 3!
      const { data } = await api.post(
        `/api/projects/${projectId}/members`, 
        { email }, 
        config
      );
      return data; // Returns { message, membership }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
  }
);


const initialState = {
  projects: [],
  loading: false,
  error: null,
  currentProject: null,
  create: {
    loading: false,
    error: null,
  },
  memberModal: {
    loading: false,
    error: null,
  },
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.error = null;
    },
    clearMemberError: (state) => {
    state.memberModal.error = null;
  },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProject.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.create.loading = false;
        state.projects.push(action.payload);
      })
      // This listens for the 'logout' action from the 'authSlice'
      .addCase(logout, (state) => {
        // When the user logs out, reset this slice to its initial state
        state.projects = [];
        state.loading = false;
        state.error = null;
      })

      // current projects :
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProject = null; // Clear old project
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
    if (state.currentProject) {
      state.currentProject.tasks.push(action.payload);
    }
  })

  // When a task is deleted, remove it from our project's tasks list
  .addCase(deleteTask.fulfilled, (state, action) => {
    if (state.currentProject) {
      state.currentProject.tasks = state.currentProject.tasks.filter(
        (task) => task.id !== action.payload // payload is the taskId
      );
    }
  })

  // When a task's details are updated, find it and replace it
  .addCase(updateTask.fulfilled, (state, action) => {
    if (state.currentProject) {
      const updatedTask = action.payload;
      const index = state.currentProject.tasks.findIndex(
        (t) => t.id === updatedTask.id
      );
      if (index !== -1) {
        state.currentProject.tasks[index] = updatedTask;
      }
    }
  })
  .addCase(addMember.pending, (state) => {
    state.memberModal.loading = true;
    state.memberModal.error = null;
  })
  .addCase(addMember.fulfilled, (state, action) => {
    state.memberModal.loading = false;
    // The API returns { membership: { userId, projectId, role, ... } }
    // But our UI expects the full user object inside 'user'.
    // Since we don't have the full user object from the API response (only the ID),
    // we will cheat slightly and force a re-fetch of the project to get the full details.
    // OR, better yet, we can rely on the fact that the user will see the email they just typed.

    // Actually, let's do the robust thing: 
    // We won't push to the array manually here because the data shape is complex.
    // instead, we will rely on re-fetching the project details (which we can trigger from the UI).

    // For now, just handle the loading state.
  })
  .addCase(addMember.rejected, (state, action) => {
    state.memberModal.loading = false;
    state.memberModal.error = action.payload;
  });
}})


export const { clearError, clearCurrentProject , clearMemberError } = projectsSlice.actions;

export default projectsSlice.reducer;
