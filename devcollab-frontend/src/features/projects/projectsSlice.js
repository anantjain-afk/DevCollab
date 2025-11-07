import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      };
      // Now we make our authenticated request
      const { data } = await api.get('/api/projects', config);
      return data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async(projectData , {getState , rejectWithValue})=>{
    // getState prop allows to have complete store or all states inside this async function 
    // This is useful when you need data already stored in Redux (like an auth token, user ID, etc.)

    try {
      const {auth } = getState() ; 
      const {token} = auth.userInfo ; 

      const config = {
        headers : {
          "Content-Type" : 'application/json',
          "authorization" : `Bearer ${token}` 
        }
      }
      const {data} = await api.post('/api/projects' , projectData , config)
      return data ; 


    } catch (error) {
      return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
  }
)

const initialState = {
    projects : [],
    loading : false ,
    error : null , 
    create : {
      loading : false ,
      error : null 
    }
}

const projectsSlice = createSlice({
    name : "projects" ,
    initialState ,
    reducers : {
      clearError: (state) => {
      state.error = null;}
    },
    extraReducers : (builder) =>  {
        builder.addCase(fetchProjects.pending,(state)=>{
            state.loading = true 
            state.error = null
        })
        builder.addCase(fetchProjects.fulfilled,(state,action)=>{
            state.loading = false 
            state.projects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProject.rejected , (state, action) => {
        state.create.loading = false ; 
        state.create.error = action.payload 
      })
      .addCase(createProject.pending , (state) => {
        state.create.loading = true ;
        state.create.error = null 
      })
      .addCase(createProject.fulfilled , (state, action)=>{
        state.create.loading = false ;
        state.projects.push(action.payload);
      })

    
    }
})

export const {clearError} = projectsSlice.actions ; 

export default projectsSlice.reducer;
