// src/features/attendance/attendanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/attendances";


// Fetch with pagination and optional search
export const fetchAttendances = createAsyncThunk(
  "attendances/fetchAll",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);

// Create
export const createAttendance = createAsyncThunk(
  "attendances/create",
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
export const updateAttendance = createAsyncThunk(
  "attendances/update",
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
export const deleteAttendance = createAsyncThunk(
  "attendances/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error || { message: error.message });
    }
  }
);


const attendanceSlice = createSlice({
  name: "attendances",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    pagination: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendances.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.items = action.payload.data.map((att) => ({
          id: att.id,
          employee_id: att.employee_id,
          employee_name: att.employee ? `${att.employee.first_name} ${att.employee.last_name}`: "-", // include join from backend
          attendance_date: att.attendance_date,
          check_in: att.check_in,
          check_out: att.check_out,
          
        }));
        state.pagination = action.payload.pagination;
        state.status = "succeeded";
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export default attendanceSlice.reducer;
