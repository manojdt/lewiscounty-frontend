import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "./api";

export const userAccountCreate = createAsyncThunk(
  "userCreate",
  async (data) => {
    const userCreate = await api.post("/register", data);
    if (userCreate.status === 201) {
      localStorage.setItem("access_token", userCreate.data.access);
      localStorage.setItem("refresh_token", userCreate.data.refresh);
      let decoded = jwtDecode(userCreate.data.access);
      return decoded;
    }
    return userCreate;
  }
);

export const userAccountLogin = createAsyncThunk("userLogin", async (data) => {
  const userlogin = await api.post("/login", data);
  if (userlogin.status === 200) {
    localStorage.setItem("access_token", userlogin.data.access);
    localStorage.setItem("refresh_token", userlogin.data.refresh);
    let decoded = jwtDecode(userlogin.data.access);
    return decoded;
  }
  return userlogin;
});
