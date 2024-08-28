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

export const getReportProgramDetails = createAsyncThunk(
    "getReportProgramDetails",
    async (id) => {
        const getDetailsofProgram = await api.get(`fetch_program_detail/${id}`);
        if (getDetailsofProgram.status === 200 && getDetailsofProgram.data && getDetailsofProgram.data.program) {
            return getDetailsofProgram.data.program;
        }
        return getDetailsofProgram;
    }
);


export const createReport = createAsyncThunk(
    "createReport",
    async (data) => {
        const createRept = await api.post(`reports/create-report`, data);
        if (createRept.status === 200 && createRept.data) {
            return createRept.data;
        }
        return createRept
    }
);


export const getReportDetails = createAsyncThunk(
    "getReportDetails",
    async (reportId) => {
        const reportDetails = await api.get(`reports/report/${reportId}`);
        if (reportDetails.status === 200 && reportDetails.data) {
            return reportDetails.data;
        }
        return reportDetails
    }
);


export const updateReportDetails = createAsyncThunk(
    "updateReportDetails",
    async (data) => {
        const reportUpdate = await api.put(`reports/update-report`, data);
        if (reportUpdate.status === 200 && reportUpdate.data) {
            return reportUpdate.data;
        }
        return reportUpdate
    }
);


export const deleteReports = createAsyncThunk(
    "deleteReports",
    async (data) => {
        console.log('Delete---', data)
        const deleteReport = await api.delete('reports/delete-report', { data: data });
        if (deleteReport.status === 200 && deleteReport.data) {
            return deleteReport.data;
        }
        return deleteReport
    }
);



