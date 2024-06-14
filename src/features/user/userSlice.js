import { createSlice } from "@reduxjs/toolkit";
import { userAccountCreate, userAccountLogin } from "../../services/loginInfo";

const initialState = {
  data: {},
  loading: false,
  error: "",
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userAccountCreate.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(userAccountCreate.fulfilled, (state, action) => {
        return { ...state, data: action.payload, loading: false };
      })
      .addCase(userAccountCreate.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
    builder
      .addCase(userAccountLogin.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(userAccountLogin.fulfilled, (state, action) => {
        return { ...state, data: action.payload, loading: false };
      })
      .addCase(userAccountLogin.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
  },
});

export default userSlice.reducer;
