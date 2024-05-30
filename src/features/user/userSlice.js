import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    loadUserInfo: (state) => state,
  },
});

// Action creators are generated for each case reducer function
export const { loadUserInfo } = userSlice.actions;

export default userSlice.reducer;
