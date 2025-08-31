// src/features/employee/employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/employees";
// Fetch
export const fetchEmployees = createAsyncThunk(
    "employees/fetchAll",
    async ({ page = 1, perPage = 25, search = "" }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}?page=${page}&per_page=${perPage}&search=${search}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error || { message: error.message });
        }
    }
);

// Search
export const searchEmployees = createAsyncThunk(
    "employees/search",
    async (query, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}`, {
                params: { search: query },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error || { message: error.message });
        }
    }
);

// Create
export const createEmployee = createAsyncThunk(
    "employees/create",
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
export const updateEmployee = createAsyncThunk(
    "employees/update",
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
export const deleteEmployee = createAsyncThunk(
    "employees/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error || { message: error.message });
        }
    }
);

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
        items: [],
        status: "idle",
        error: null,
        pagination: {},
        employees: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.items = action.payload.data.map((emp) => ({
                    id: emp.id,
                    first_name: emp.first_name ?? "",
                    last_name: emp.last_name ?? "",
                    birth_date: emp.birth_date ?? "",
                    gender: emp.gender ?? "",
                    nik: emp.nik ?? "",
                    employee_number: emp.employee_number ?? "",
                    position: emp.position ?? "",
                    work_shift_name: emp.work_shift_name ?? "-",
                    work_shift_id: emp.work_shift_id ?? null,
                }));
                state.pagination = action.payload.pagination;
                state.status = "succeeded";
            })
            .addCase(searchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload.data;
                console.log(state.employees, "state employees");
            });
    },
});

export default employeeSlice.reducer;
