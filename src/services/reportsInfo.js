import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";

// Get All Reports
export const getAllReports = createAsyncThunk(
    "getAllReports",
    async (query = '') => {
        const queryString = query !== '' ? `?status=${query}` : ''
        const allReports = await api.get(`reports/reports${queryString}`);
        if (allReports.status === 200 && allReports.data) {
            return allReports.data;
        }
        return allReports
    }
);


export const getProgramsByCategoryId = createAsyncThunk(
    "getProgramsByCategoryId",
    async (categoryId) => {
        const allPrograms = await api.get(`reports/get-programs-by-id/${categoryId}`);
        if (allPrograms.status === 200 && allPrograms.data) {
            return allPrograms.data;
        }
        return allPrograms
    }
);