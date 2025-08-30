import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchWorkshifts,
  createWorkshift,
  updateWorkshift,
  deleteWorkshift,
} from "../features/workshift/workshiftSlice";
import { Button, Modal, Box, TextField, Select, MenuItem, Typography } from "@mui/material";
import { handleApiError } from "../utils/errorHandler";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
  boxShadow: 24,
};

function WorkShifts() {
  const dispatch = useDispatch();
  const { items, pagination, status } = useSelector((state) => state.workshifts);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", type: "shift", description: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchWorkshifts(page));
  }, [dispatch, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (form.id) {
        await dispatch(updateWorkshift({ id: form.id, data: form })).unwrap();
      } else {
        await dispatch(createWorkshift(form)).unwrap();
      }
  
      // Refetch data after success
      dispatch(fetchWorkshifts(page));
  
      setModalOpen(false);
      setForm({ id: null, name: "", type: "shift", description: "" });
    } catch (error) {
      console.error(error);
      handleApiError(error);
    }
  };
  const handleEdit = (row) => {
    setForm(row);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this workshift?")) {
      try{
        dispatch(deleteWorkshift(id));
      }
      catch(error){
        handleApiError(error);
      }
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: ({ value }) => value.toUpperCase() || "-",
    },
    { field: "description", headerName: "Description", flex: 2, renderCell: ({ value }) => value || "-" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="contained" color="warning" size="small" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Typography variant="h5">Work Shifts</Typography>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          + Add Workshift
        </Button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={items || []}
          columns={columns}
          page={page - 1}
          pageSize={pageSize}
          rowCount={pagination?.total || 0}
          pagination
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          loading={status === "loading"}
        />
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            {form.id ? "Edit Workshift" : "Add Workshift"}
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Select
              fullWidth
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <MenuItem value="shift">Shift</MenuItem>
              <MenuItem value="fulltime">Fulltime</MenuItem>
            </Select>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default WorkShifts;
