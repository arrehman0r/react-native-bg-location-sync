import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loginUser: null,
    isAuthenticated: false,


  },
  reducers: {
    setLoginUser: (state, action) => {
      return { ...state, loginUser: action.payload , isAuthenticated: !!action.payload };
    },
    logoutUser: (state) => {
      state.loginUser = null;
      state.isAuthenticated = false;

    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    }

  },
});

export const { setLoginUser, logoutUser, setIsAuthenticated } = userSlice.actions;


export default userSlice.reducer;