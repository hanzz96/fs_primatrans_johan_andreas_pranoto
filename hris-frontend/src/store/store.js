import { configureStore } from "@reduxjs/toolkit";
import workShiftReducer from "../features/workshift/workshiftSlice";
import employeeReducer from "../features/employee/employeeSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";

export const store = configureStore({
  reducer: {
    employees: employeeReducer,   // <-- make sure this key matches your useSelector
    workshifts: workShiftReducer,
    attendances: attendanceReducer
  },
});