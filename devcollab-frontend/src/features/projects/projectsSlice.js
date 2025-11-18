import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
// importing the logout action to clear out all the projects from the userInfo when user logout so that
// when the other user logs in from the same computer it will not see the previously logged in user's projects .
import { logout } from "../auth/authSlice";

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

export const createTask = createAsyncThunk(
  "projects/createTask",
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.post("/api/task", taskData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "projects/updateTaskStatus",
  async ({ taskId, status }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await api.patch(
        `/api/task/${taskId}`,
        { status }, // Send just the new status in the body
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
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
        state.loading = false;
        if (state.currentProject) {
          state.currentProject.tasks.push(action.payload);
        }
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskStatus.pending, (state) => {
        // We don't need a loading spinner because the drag-and-drop
        // provides instant "optimistic" visual feedback.
        // We'll just clear any old errors.
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        // The API returned the updated task.
        const updatedTask = action.payload;

        // Find the index of the task in our currentProject's array
        const index = state.currentProject.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );

        // If we found it, replace it with the updated version
        if (index !== -1) {
          state.currentProject.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        // If the API call fails, we set an error.
        // (In a v2, we would "revert" the drag-and-drop,
        // but for now, just logging the error is fine.)
        state.error = action.payload;
        console.error("Failed to update task status:", action.payload);
      });
  },
});

export const { clearError, clearCurrentProject } = projectsSlice.actions;

export default projectsSlice.reducer;
