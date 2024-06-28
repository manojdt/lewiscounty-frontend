import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";

// Get All Programs
export const getAllPrograms = createAsyncThunk(
    "getAllPrograms",
    async (data) => {
        const validateOTP = await api.post("/validate-otp", data);
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
        const validateOTP = await api.post("/validate-otp", data);
        if (validateOTP.status === 200) {
            return validateOTP;
        }
        return validateOTP;
    }
);


export const createProgram = createAsyncThunk(
    "createProgram",
    async (data) => {
        // const validateOTP = await api.post("/validate-otp", data);
        // if (validateOTP.status === 200) {
        //     return validateOTP;
        // }
        // return validateOTP;
        return data;
    }
);


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