// src/pages/AttendancePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAttendances,
    deleteAttendance,
} from "../features/attendance/attendanceSlice";
import AttendanceForm from "./AttendanceForm";
import { debounce } from "lodash";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";

function AttendancePage() {
    const dispatch = useDispatch();
    const { items, status, pagination } = useSelector(
        (state) => state.attendances
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    // Server-side pagination model
    const [paginationModel, setPaginationModel] = useState({
        page: 0, // zero-indexed
        pageSize: 25, // default
    });

    // Debounced search
    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setSearch(value);
                setPaginationModel((prev) => ({ ...prev, page: 0 })); // reset to first page
            }, 500),
        []
    );

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value); // immediate UI update
        debouncedSearch(e.target.value); // trigger API after debounce
    };

    // Fetch attendances when pagination or search changes
    useEffect(() => {
        dispatch(
            fetchAttendances({
                page: paginationModel.page + 1, // API expects 1-indexed
                perPage: paginationModel.pageSize,
                search,
            })
        );
    }, [dispatch, paginationModel, search]);

    const handleDelete = async (id) => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteAttendance(id)).unwrap();
            // Refetch current page
            dispatch(
                fetchAttendances({
                    page: paginationModel.page + 1,
                    perPage: paginationModel.pageSize,
                    search,
                })
            );
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
                    <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        disabled={isDeleting}
                    >
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
                    value={searchInput}
                    onChange={handleSearchChange}
                    fullWidth
                />
            </div>

            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={items}
                    columns={columns}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    rowCount={pagination?.total || items.length}
                    pageSizeOptions={[10, 25, 50, 100]}
                    loading={status === "loading"}
                />
            </div>

            {modalOpen && (
                <AttendanceForm
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    editData={editData}
                    page={paginationModel.page + 1}
                />
            )}
        </div>
    );
}

export default AttendancePage;
