import { createSlice } from "@reduxjs/toolkit";

const utilsSlice = createSlice({
  name: "utils",
  initialState: {
    loading: false,
    visible: false,
    message: '',
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    showToast: (state, action) => {

      state.visible = true;
      state.message = action.payload; // The message to be shown in Snackbar
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = ''; // Clear the message when hiding Snackbar
    },
  },
});

export const { setLoading, showToast, hideToast } = utilsSlice.actions;
export default utilsSlice.reducer;