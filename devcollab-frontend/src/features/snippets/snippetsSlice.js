import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"

export const createSnippet = createAsyncThunk(
  "snippets/createSnippet",
  async (snippetData, {rejectWithValue ,getState}) => {
    try {
        const {auth} = getState()
        const {token} = auth.userInfo ;
        const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        }
      const response = await api.post("/api/snippets", snippetData , config);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create snippet");
    }
  }
);
export const fetchProjectSnippets = createAsyncThunk(
  "snippets/fetchProjectSnippets",
  async (projectId,  {rejectWithValue ,getState}) => {
    try {
        const {auth} = getState()
        const {token} = auth.userInfo ;
        const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        }
      const response = await api.get(`/api/snippets/${projectId}`, config);
      return response.data;
    } catch (error) {
        console.log("error fetching snippets in slice", error)
      return rejectWithValue("Failed to fetch snippets");
    }
  }
);

export const explainCode = createAsyncThunk(
  "snippets/explainCode",
  async (codeData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { token } = auth.userInfo;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post("/api/ai/explain", codeData, config);
      return response.data.result; // Assuming the API returns { result: "explanation text" }
    } catch (error) {
      
    }
  }
)

const snippetSlice = createSlice({
  name: "snippets",
  initialState: {
    snippets: [],
    fetch: {
      loading: false,
      error: null,
    },
    create: {
      loading: false,
      error: null,
    },
    ai: {
    loading: false,
    result: null, // This will hold the explanation text
    error: null,
  },
  },
  reducers: {
    clearSnippets: (state) => {
      state.snippets = [];
    },
    clearCreateSnippetError: (state) => {
      state.create.error = null ;
    },
    clearAIResult: (state) => {
    state.ai.result = null;
    state.ai.error = null;
  },

  },
  extraReducers: (builder) => {
    builder
    .addCase(createSnippet.pending , (state)=>{
        state.create.loading = true ;
        state.create.error = null ;
    })
    .addCase(createSnippet.fulfilled , (state, action)=>{
        state.create.loading = false ;
        state.snippets.unshift(action.payload) ;
    })
    .addCase(createSnippet.rejected , (state, action)=>{
        state.create.loading = false ;
        state.create.error = action.payload ;
    })
    .addCase(fetchProjectSnippets.pending , (state)=>{
        state.fetch.loading = true ;
        state.fetch.error = null ;
    })
    .addCase(fetchProjectSnippets.fulfilled , (state, action)=>{
        state.fetch.loading = false ;
        state.snippets = action.payload ;
    })
    .addCase(fetchProjectSnippets.rejected , (state, action)=>{
        state.fetch.loading = false ;
        state.fetch.error = action.payload ;
    })
    .addCase(explainCode.pending, (state) => {
    state.ai.loading = true;
    state.ai.error = null;
    state.ai.result = null;
  })
  .addCase(explainCode.fulfilled, (state, action) => {
    state.ai.loading = false;
    state.ai.result = action.payload; // The explanation text
  })
  .addCase(explainCode.rejected, (state, action) => {
    state.ai.loading = false;
    state.ai.error = action.payload;
  });
  },
});


export const { clearSnippets , clearCreateSnippetError,clearAIResult } = snippetSlice.actions;
export default snippetSlice.reducer;