import { configureStore } from "@reduxjs/toolkit";
import workshiftReducer from "../features/workshift/workshiftSlice";

export const store = configureStore({
  reducer: {
    workshifts: workshiftReducer,
  },
});
