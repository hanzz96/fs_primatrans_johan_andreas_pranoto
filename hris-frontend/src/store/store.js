import { configureStore } from "@reduxjs/toolkit";
import workShiftReducer from "../features/workshift/workshiftSlice";

export const store = configureStore({
  reducer: {
    workshifts: workShiftReducer,
  },
});