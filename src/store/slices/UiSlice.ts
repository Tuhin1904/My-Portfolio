// features/ui/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  highlightStartButton: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    triggerHighlight: (state) => {
      state.highlightStartButton = true;
    },
    removeHighlight: (state) => {
      state.highlightStartButton = false;
    },
  },
});

export const { triggerHighlight, removeHighlight } = uiSlice.actions;
export default uiSlice.reducer;