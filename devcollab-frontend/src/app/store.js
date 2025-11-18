import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/tasksSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects : projectReducer,
    tasks: tasksReducer,
  },
});