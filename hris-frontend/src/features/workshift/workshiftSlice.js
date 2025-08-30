// src/store/workshiftSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/workshifts"; // adjust if needed
// Fetch
export const fetchWorkshifts = createAsyncThunk(
  "workshifts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);

// Create
export const createWorkshift = createAsyncThunk(
  "workshifts/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);

// Update
export const updateWorkshift = createAsyncThunk(
  "workshifts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);

// Delete
export const deleteWorkshift = createAsyncThunk(
  "workshifts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);

// Search
export const searchWorkShifts = createAsyncThunk(
  "workshifts/search",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { params: { search: query } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);

const workshiftSlice = createSlice({
  name: "workshifts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWorkshifts.fulfilled, (state, action) => {
        state.items = action.payload.data.map((ws) => ({
          id: ws.id,
          name: ws.name ?? "",
          type: ws.type ?? "",
          description: ws.description ?? "",
        }));
        console.log(state.items)
        state.status = "succeeded";
      })
  },
});

export default workshiftSlice.reducer;
