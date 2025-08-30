import { configureStore } from "@reduxjs/toolkit";
import workShiftReducer from "../features/workshift/workshiftSlice";
import employeeReducer from "../features/employee/employeeSlice";

export const store = configureStore({
  reducer: {
    employees: employeeReducer,   // <-- make sure this key matches your useSelector
    workshifts: workShiftReducer,
  },
});