// src/pages/AttendanceForm.jsx
import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
    createAttendance,
    updateAttendance,
    fetchAttendances,
} from "../features/attendance/attendanceSlice";
import { handleApiError } from "../utils/errorHandler";
import { searchEmployees } from "../features/employee/employeeSlice";

import { Button, TextField, Modal } from "@mui/material";

function AttendanceForm({ open, onClose, editData, page }) {
    const dispatch = useDispatch();
    const { items: employees } = useSelector((state) => state.employees);

    const [form, setForm] = useState({
        id: null,
        employee_id: null,
        employee_name: "",
        attendance_date: "",
        check_in: "",
        check_out: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (editData) {
            setForm(editData);
        } else {
            setForm({
                id: null,
                employee_id: null,
                employee_name: "",
                attendance_date: "",
                check_in: "",
                check_out: "",
            });
        }
    }, [editData]);

    const fetchEmployee = async (inputValue = "") => {
        try {
            const data = await dispatch(searchEmployees(inputValue)).unwrap();
            console.log(data.data, "on menu");
            const mapped = data.data.map((shift) => ({
                value: shift.id,
                label: shift.full_name,
            }));
            setOptions(mapped);

            // If form has an ID but no name yet, fill it from the fetched options
            if (form.id && !form.full_name) {
                const current = mapped.find((s) => s.value === form.id);
                if (current) setForm({ ...form, full_name: current.label });
            }

            return mapped;
        } catch (error) {
            console.error("Error fetching work shifts:", error);
            return [];
        }
    };

    const fetchEmployeeDebounced = React.useMemo(
        () =>
            debounce(async (inputValue, callback) => {
                try {
                    // Call your API or Redux action with the search term
                    const data = await dispatch(
                        searchEmployees(inputValue)
                    ).unwrap();
                    console.log(data, "fetch");
                    const options = data.data.map((e) => ({
                        value: e.id,
                        label: `${e.full_name}`,
                    }));
                    setOptions(options);
                    callback(options);
                } catch (error) {
                    console.error("Error fetching employees:", error);
                    callback([]);
                }
            }, 500), // 500ms debounce
        [dispatch]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (form.id) {
                await dispatch(
                    updateAttendance({ id: form.id, data: form })
                ).unwrap();
            } else {
                await dispatch(createAttendance(form)).unwrap();
            }
            await dispatch(fetchAttendances(page));
            onClose();
        } catch (err) {
            handleApiError(err);
            console.error("Error saving attendance:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadEmployeeOptions = async (inputValue = "") => {
        return employees
            .filter((e) =>
                `${e.first_name} ${e.last_name}`
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            )
            .map((e) => ({
                value: e.id,
                label: `${e.first_name} ${e.last_name}`,
            }));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="bg-white p-6 rounded shadow-md w-96 mx-auto mt-20">
                <h3 className="text-lg font-bold mb-4">
                    {form.id ? "Edit Attendance" : "Add Attendance"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <AsyncSelect
                        cacheOptions
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        defaultOptions={options}
                        loadOptions={fetchEmployeeDebounced}
                        onChange={(selected) =>
                            setForm({
                                ...form,
                                employee_id: selected?.value,
                                employee_name: selected?.label,
                            })
                        }
                        value={
                            form.employee_id
                                ? {
                                      value: form.employee_id,
                                      label: form.employee_name,
                                  }
                                : null
                        }
                        placeholder="Select Employee"
                        onMenuOpen={() => fetchEmployee()}
                    />

                    <TextField
                        fullWidth
                        type="date"
                        label="Attendance Date"
                        InputLabelProps={{ shrink: true }}
                        value={form.attendance_date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                attendance_date: e.target.value,
                            })
                        }
                        required
                    />

                    <TextField
                        fullWidth
                        type="time"
                        label="Check In"
                        InputLabelProps={{ shrink: true }}
                        value={form.check_in}
                        onChange={(e) =>
                            setForm({ ...form, check_in: e.target.value })
                        }
                    />

                    <TextField
                        fullWidth
                        type="time"
                        label="Check Out"
                        InputLabelProps={{ shrink: true }}
                        value={form.check_out}
                        onChange={(e) =>
                            setForm({ ...form, check_out: e.target.value })
                        }
                    />

                    <div className="flex justify-end space-x-2 mt-4">
                        <Button
                            variant="outlined"
                            onClick={onClose}
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
    );
}

export default AttendanceForm;
