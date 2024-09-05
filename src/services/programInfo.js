import {
  createAsyncThunk,
  createAction
} from "@reduxjs/toolkit";

import api from "./api";

// Get All Programs
export const getAllPrograms = createAsyncThunk(
  "getAllPrograms",
  async (data) => {
    const validateOTP = await api.post("validate-otp", data);
    if (validateOTP.status === 200) {
      return validateOTP;
    }
    return validateOTP;
  }
);

// Get Specific Program
export const getProgramDetails = createAsyncThunk(
  "getProgramDetails",
  async (data) => {
    const validateOTP = await api.post("validate-otp", data);
    if (validateOTP.status === 200) {
      return validateOTP;
    }
    return validateOTP;
  }
);

export const createProgram = createAsyncThunk("createProgram", async (data) => {
  // const validateOTP = await api.post("/validate-otp", data);
  // if (validateOTP.status === 200) {
  //     return validateOTP;
  // }
  // return validateOTP;
  return data;
});

export const createNewPrograms = createAsyncThunk(
  "createNewPrograms",
  async (data) => {
    // api.interceptors.request.use(function (config) {
    //   config.headers["Content-Type"] = "multipart/form-data";
    //   return config;
    // });
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    const createProgram = await api.post("programs", data, {
      headers: headers
    });
    // const createProgram = { status : 201}
    console.log("createProgram", createProgram);
    if (createProgram.status === 201) {
      return createProgram;
    }
    return createProgram;
  }
);

export const fetchProgram = createAsyncThunk("fetchProgram", async (data) => {
  const fetchProgram = await api.get("fetch_program", data);
  if (fetchProgram.status === 200) {
    return fetchProgram;
  }
  return fetchProgram;
});

export const updateAllPrograms = createAsyncThunk(
  "updatePrograms",
  async (data) => {
    // const validateOTP = await api.post("/validate-otp", data);
    // if (validateOTP.status === 200) {
    //     return validateOTP;
    // }
    // return validateOTP;
    return data;
  }
);

export const createNewProgram = createAsyncThunk(
  "createNewProgram",
  async (data) => {
    return data;
  }
);

export const loadAllPrograms = createAsyncThunk(
  "loadAllPrograms",
  async (data) => {
    return data;
  }
);

export const updateNewPrograms = createAsyncThunk(
  "updateNewPrograms",
  async (data) => {
    return data;
  }
);

export const updateProgramDetails = createAsyncThunk(
  "updateProgramDetails",
  async (data) => {
    return data;
  }
);

export const getAllCategories = createAsyncThunk(
  "getAllCategories",
  async (data) => {
    const allCategory = await api.get("category", data);
    if (allCategory.status === 200 && allCategory.data) {
      return allCategory.data;
    }
    return allCategory;
  }
);

export const getAllMaterials = createAsyncThunk(
  "getAllMaterials",
  async (data) => {
    const allMaterial = await api.get(`materials?category_id=${data}`);
    if (allMaterial.status === 200 && allMaterial.data) {
      return allMaterial.data;
    }
    return allMaterial;
  }
);

export const getAllCertificates = createAsyncThunk(
  "getAllCertificates",
  async (data) => {
    const allCertificates = await api.get(`certificate?category_id=${data}`);
    if (allCertificates.status === 200 && allCertificates.data) {
      return allCertificates.data;
    }
    return allCertificates;
  }
);

export const getAllSkills = createAsyncThunk("getAllSkills", async (data) => {
  const allSkills = await api.get(`skills?category_id=${data}`);
  if (allSkills.status === 200 && allSkills.data) {
    return allSkills.data;
  }
  return allSkills;
});

export const getAllMembers = createAsyncThunk("getAllMembers", async (data) => {
  const allMembers = await api.get(`members?category_id=${data}`);
  if (allMembers.status === 200 && allMembers.data) {
    return allMembers.data;
  }
  return allMembers;
});

export const getProgramsByCategory = createAsyncThunk(
  "getProgramsByCategory",
  async (categoryId) => {
    const allPrograms = await api.get(
      `program_task_assign/list_program?id=${categoryId}`
    );
    if (allPrograms.status === 200 && allPrograms.data) {
      return allPrograms.data;
    }
    return allPrograms;
  }
);