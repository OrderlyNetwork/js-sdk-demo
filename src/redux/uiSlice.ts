import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  showSidePanel: boolean;
}

const initialState = {
  showSidePanel: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSidePanel(state) {
      state.showSidePanel = true;
    },
    closeSidePanel(state) {
      state.showSidePanel = false;
    },
  },
});

export const { openSidePanel, closeSidePanel } = uiSlice.actions;

export default uiSlice.reducer;
