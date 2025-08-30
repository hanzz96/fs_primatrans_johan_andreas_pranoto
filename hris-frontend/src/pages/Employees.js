// src/pages/Employees.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../features/employee/employeeSlice";

import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function Employees() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.employees);

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "male",
    nik: "",
    employee_number: "",
    position: "",
    work_shift_id: null,
  });

  // New loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmployees(page));
    }
  }, [status, page, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);

    try {
      if (form.id) {
        await dispatch(updateEmployee({ id: form.id, data: form })).unwrap();
      } else {
        await dispatch(createEmployee(form)).unwrap();
      }

      // Refetch after action
      await dispatch(fetchEmployees(page)).unwrap();

      setModalOpen(false);
      setForm({
        id: null,
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "male",
        nik: "",
        employee_number: "",
        position: "",
        work_shift_id: null,
      });
    } catch (error) {
      console.error("Error submitting employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (isDeleting) return; // prevent double click
    setIsDeleting(true);

    try {
      await dispatch(deleteEmployee(id)).unwrap();
      await dispatch(fetchEmployees(page)).unwrap();
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setModalOpen(true);
  };

  // Columns remain the same
  const columns = [
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "birth_date", headerName: "Birth Date", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "nik", headerName: "NIK", flex: 1 },
    { field: "employee_number", headerName: "Employee Number", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "work_shift", headerName: "Work Shift", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="space-x-2">
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={() => handleDelete(params.row.id)}
            disabled={isDeleting} // disable button while deleting
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          disabled={isSubmitting} // disable while submitting
        >
          + Add Employee
        </Button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="bg-white p-6 rounded shadow-md w-96 mx-auto mt-20">
          <h3 className="text-lg font-bold mb-4">
            {form.id ? "Edit Employee" : "Add Employee"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <TextField
              fullWidth
              label="First Name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="Birth Date"
              InputLabelProps={{ shrink: true }}
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="NIK"
              value={form.nik}
              onChange={(e) => setForm({ ...form, nik: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Employee Number"
              value={form.employee_number}
              onChange={(e) =>
                setForm({ ...form, employee_number: e.target.value })
              }
              required
            />
            <TextField
              fullWidth
              label="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Work Shift ID"
              type="number"
              value={form.work_shift_id || ""}
              onChange={(e) =>
                setForm({ ...form, work_shift_id: Number(e.target.value) })
              }
            />

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}


export default Employees;
