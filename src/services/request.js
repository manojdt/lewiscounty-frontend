import {
    createAction,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "./api";


export const getprogramRequest = createAsyncThunk(
    "getprogramRequest",
    async (query = '') => {
        let queryString = new URLSearchParams(query).toString()

        const programRequests = await api.get(`program_request/program_requests?${queryString}`);
        if (programRequests.status === 200 && programRequests.data) {
            return programRequests.data;
        }
        return programRequests;
    }
);


export const getResourceRequest = createAsyncThunk(
    "getResourceRequest",
    async (query = '') => {
        let queryString = new URLSearchParams(query).toString()

        const resourceRequests = await api.get(`metrial-request/?${queryString}`);
        if (resourceRequests.status === 200 && resourceRequests.data) {
            return resourceRequests.data;
        }
        return resourceRequests;
    }
);


export const updateLocalRequest = createAction('update/updateRequest')

export const updateProgramRequest = createAsyncThunk(
    "updateProgramRequest",
    async (data) => {
        const updateProgramReq = await api.put('program_request/update-program-request-status', data);
        if (updateProgramReq.status === 200 && updateProgramReq.data) {
            return updateProgramReq.data;
        }
        return updateProgramReq;
    }
);