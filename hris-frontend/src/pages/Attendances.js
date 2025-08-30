// src/pages/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendances,
  deleteAttendance,
} from "../features/attendance/attendanceSlice";
import AttendanceForm from "./AttendanceForm";
import {debounce} from "lodash";

import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";

function AttendancePage() {
  const dispatch = useDispatch();
  const { items, status, pagination } = useSelector(
    (state) => state.attendances
  );
  const { items: employees } = useSelector((state) => state.employees);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAttendances({ page, search }));
  }, [dispatch, page, search]);

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 500), // 500ms debounce
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value); // update immediately for UI
    debouncedSearch(e.target.value); // trigger API after debounce
  };

  const handleDelete = async (id) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAttendance(id)).unwrap();
      await dispatch(fetchAttendances({ page, search })).unwrap();
    } catch (error) {
      console.error("Error deleting attendance:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const columns = [
    { field: "employee_name", headerName: "Employee", flex: 1 },
    { field: "attendance_date", headerName: "Date", flex: 1 },
    { field: "check_in", headerName: "Check In", flex: 1 },
    { field: "check_out", headerName: "Check Out", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-start space-x-2">
        <Button variant="contained" color="warning" size="small" onClick={() => handleEdit(params.row)}>
          Edit
        </Button>
        <Button variant="contained" color="error" size="small" onClick={() => handleDelete(params.row.id)} 
            disabled={isDeleting}>

        {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Attendances</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
        >
          + Add Attendance
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          placeholder="Search by employee"
          value={searchInput} // immediate update
          onChange={handleSearchChange}
          fullWidth
        />
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          loading={status === "loading"}
        />
      </div>

      {modalOpen && (
        <AttendanceForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          editData={editData}
          page={page}
        />
      )}
    </div>
  );
}

export default AttendancePage;
