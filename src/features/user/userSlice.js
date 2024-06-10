import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return state = action.payload
    },
    updateUserInfo: (state, action) =>  {
      return state = { ...state, ...action.payload }
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUserInfo, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
