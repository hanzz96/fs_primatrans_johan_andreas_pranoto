// src/pages/Employees.jsx
import React, { useEffect, useState, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "../features/employee/employeeSlice";
import { searchWorkShifts } from "../features/workshift/workshiftSlice";

import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    Modal,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { handleApiError } from "../utils/errorHandler";

function Employees() {
    const dispatch = useDispatch();
    const {
        items: employees,
        status: employeeStatus,
        pagination,
    } = useSelector((state) => state.employees);
    const { items: workShifts, status: workShiftStatus } = useSelector(
        (state) => state.workshifts
    );

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
        work_shift_name: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [options, setOptions] = useState([]);

    // Server-side pagination
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10, // default
    });

    useEffect(() => {
        dispatch(
            fetchEmployees({
                page: paginationModel.page + 1,
                perPage: paginationModel.pageSize,
            })
        );
    }, [dispatch, paginationModel]);

    const debouncedFetchWorkShifts = useMemo(
        () =>
            debounce(async (inputValue, callback) => {
                try {
                    const data = await dispatch(
                        searchWorkShifts(inputValue)
                    ).unwrap();
                    const mapped = data.map((shift) => ({
                        value: shift.id,
                        label: shift.name,
                    }));
                    setOptions(mapped);
                    callback(mapped);
                } catch (error) {
                    console.error(error);
                    callback([]);
                }
            }, 500),
        [dispatch]
    );

    const fetchWorkShifts = async (inputValue = "") => {
        try {
            const data = await dispatch(searchWorkShifts(inputValue)).unwrap();
            const mapped = data.map((shift) => ({
                value: shift.id,
                label: shift.name,
            }));
            setOptions(mapped);

            if (form.work_shift_id && !form.work_shift_name) {
                const current = mapped.find(
                    (s) => s.value === form.work_shift_id
                );
                if (current)
                    setForm({ ...form, work_shift_name: current.label });
            }

            return mapped;
        } catch (error) {
            console.error("Error fetching work shifts:", error);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (form.id) {
                await dispatch(
                    updateEmployee({ id: form.id, data: form })
                ).unwrap();
            } else {
                await dispatch(createEmployee(form)).unwrap();
            }
            await dispatch(
                fetchEmployees({
                    page: paginationModel.page + 1,
                    perPage: paginationModel.pageSize,
                })
            ).unwrap();
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
                work_shift_name: "",
            });
        } catch (error) {
            handleApiError(error);
            console.error("Error submitting employee:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (isDeleting) return;
        setIsDeleting(true);

        try {
            await dispatch(deleteEmployee(id)).unwrap();
            await dispatch(
                fetchEmployees({
                    page: paginationModel.page + 1,
                    perPage: paginationModel.pageSize,
                })
            ).unwrap();
        } catch (error) {
            handleApiError(error);
            console.error("Error deleting employee:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (employee) => {
        setForm(employee);
        setModalOpen(true);
    };

    const handleModalClose = () => {
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
            work_shift_name: "",
        });
    };

    const handlePaginationModelChange = (model) => {
        if (model.pageSize !== paginationModel.pageSize) {
            setPaginationModel({ page: 0, pageSize: model.pageSize }); // reset to first page
        } else {
            setPaginationModel(model);
        }
    };

    const columns = [
        { field: "first_name", headerName: "First Name", flex: 1 },
        { field: "last_name", headerName: "Last Name", flex: 1 },
        { field: "birth_date", headerName: "Birth Date", flex: 1 },
        { field: "gender", headerName: "Gender", flex: 1 },
        { field: "nik", headerName: "NIK", flex: 1 },
        { field: "employee_number", headerName: "Employee Number", flex: 1 },
        { field: "position", headerName: "Position", flex: 1 },
        { field: "work_shift_name", headerName: "Work Shift", flex: 1 },
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
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Employees</h2>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalOpen(true)}
                    disabled={isSubmitting}
                >
                    + Add Employee
                </Button>
            </div>

            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={employees}
                    columns={columns}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange} // use fixed handler
                    rowCount={pagination?.total || employees.length}
                    pageSizeOptions={[5, 10, 15, 20, 100]}
                    loading={employeeStatus === "loading"}
                />
            </div>

            <Modal open={modalOpen} onClose={handleModalClose}>
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
                            onChange={(e) =>
                                setForm({ ...form, last_name: e.target.value })
                            }
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Birth Date"
                            InputLabelProps={{ shrink: true }}
                            value={form.birth_date}
                            onChange={(e) =>
                                setForm({ ...form, birth_date: e.target.value })
                            }
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={form.gender}
                                onChange={(e) =>
                                    setForm({ ...form, gender: e.target.value })
                                }
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="NIK"
                            value={form.nik}
                            onChange={(e) =>
                                setForm({ ...form, nik: e.target.value })
                            }
                            required
                        />
                        <TextField
                            fullWidth
                            label="Employee Number"
                            value={form.employee_number}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    employee_number: e.target.value,
                                })
                            }
                            required
                        />
                        <TextField
                            fullWidth
                            label="Position"
                            value={form.position}
                            onChange={(e) =>
                                setForm({ ...form, position: e.target.value })
                            }
                            required
                        />

                        <div className="mt-2">
                            <AsyncSelect
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                                cacheOptions={false}
                                defaultOptions={options}
                                loadOptions={debouncedFetchWorkShifts}
                                onMenuOpen={() => fetchWorkShifts()}
                                onChange={(selected) =>
                                    setForm({
                                        ...form,
                                        work_shift_id: selected?.value,
                                        work_shift_name: selected?.label,
                                    })
                                }
                                value={
                                    form.work_shift_id
                                        ? {
                                              value: form.work_shift_id,
                                              label:
                                                  form.work_shift_name ||
                                                  options.find(
                                                      (o) =>
                                                          o.value ===
                                                          form.work_shift_id
                                                  )?.label ||
                                                  "Loading...",
                                          }
                                        : null
                                }
                                placeholder="Select Work Shift"
                                loadingMessage={() => "Loading..."}
                                noOptionsMessage={() => "No work shifts found"}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button
                                variant="outlined"
                                onClick={handleModalClose}
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
