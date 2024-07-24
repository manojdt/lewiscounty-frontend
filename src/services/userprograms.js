import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";
import { programActionStatus } from "../utils/constant";

// Get All Programs
export const getUserPrograms = createAsyncThunk(
    "getUserPrograms",
    async (query) => {
        const queryParams = query && Object.keys(query).length ? `?${query.type}=${query.value}` : ''
        const getUserProgram = await api.get(`fetch_program${queryParams}`);
        console.log('getUserProgram', getUserProgram)
        if (getUserProgram.status === 200 && getUserProgram.data) {
            console.log('iddd')
            const response = {
                ...getUserProgram.data,
                filterType: query?.type || '',
                filterValue: query?.value || ''
            }
            console.log('response', response)
            return response;
        }
        return getUserProgram;
    }
);



export const updateProgram = createAsyncThunk(
    "updateProgram",
    async (data) => {
        console.log('data',data)
        const updateUserProgram = await api.post("update_program", data);
        if (updateUserProgram.status === 200 && updateUserProgram.data) {
            console.log('updateUserProgram', updateUserProgram)
            let status = ''
            if (data.status && data.status !== '') {
                status = data.status
            }
            if (data.hasOwnProperty('is_bookmark') && data.is_bookmark !== '') {
                status = programActionStatus.bookmark
            }
            return {
                programdetails: updateUserProgram.data,
                status 
            };
        }
        return updateUserProgram;
    }
);


export const getProgramCounts = createAsyncThunk(
    "getProgramCounts",
    async (id) => {
        const getProgramAllCounts = await api.get('program_status_count');
        if (getProgramAllCounts.status === 200 && getProgramAllCounts.data) {
            return getProgramAllCounts.data;
        }
        return getProgramAllCounts;
    }
);

export const getProgramDetails = createAsyncThunk(
    "getProgramDetails",
    async (id) => {
        const getDetailsofProgram = await api.get(`fetch_program_detail/${id}`);
        if (getDetailsofProgram.status === 200 && getDetailsofProgram.data && getDetailsofProgram.data?.program) {
            return getDetailsofProgram.data.program;
        }
        return getDetailsofProgram;
    }
);

export const getMentees = createAsyncThunk(
    "getMentees",
    async () => {
        const getMenteesList = await api.get('mentees');
        if (getMenteesList.status === 200 && getMenteesList.data) {
            return getMenteesList.data;
        }
        return getMenteesList;
    }
);


export const getProgramMentees = createAsyncThunk(
    "getProgramMentees",
    async () => {
        const allMentees = await api.get('program_task_assign/list_mentee');
        if (allMentees.status === 200 && allMentees.data) {
            return allMentees.data;
        }
        return allMentees;
    }
);

export const assignProgramTask = createAsyncThunk(
    "assignProgramTask",
    async (data) => {
        const programTaskAssign = await api.post('program_task_assign/create_task?status=assign', data);
        if (programTaskAssign.status === 201 && programTaskAssign.data) {
            return programTaskAssign.data;
        }
        return programTaskAssign;
    }
);


export const getMenteeDetails = createAsyncThunk(
    "getMenteeDetails",
    async (menteeId) => {
        const menteeDetails = await api.post(`program_task_assign/list_mentee?id=${menteeId}`);
        if (menteeDetails.status === 200 && menteeDetails.data) {
            return menteeDetails.data;
        }
        return menteeDetails;
    }
);