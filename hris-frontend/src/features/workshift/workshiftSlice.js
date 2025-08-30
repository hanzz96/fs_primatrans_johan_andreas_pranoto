// src/store/workshiftSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/workshifts"; // adjust if needed

// Fetch
export const fetchWorkshifts = createAsyncThunk(
  "workshifts/fetchAll",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

// Create
export const createWorkshift = createAsyncThunk(
  "workshifts/create",
  async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  }
);

// Update
export const updateWorkshift = createAsyncThunk(
  "workshifts/update",
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  }
);

// Delete
export const deleteWorkshift = createAsyncThunk(
  "workshifts/delete",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
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
      // Create
      .addCase(createWorkshift.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateWorkshift.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (w) => w.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      // Delete
      .addCase(deleteWorkshift.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w.id !== action.payload);
      });
  },
});

export default workshiftSlice.reducer;
