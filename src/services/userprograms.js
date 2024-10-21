import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";
import {
    programActionStatus
} from "../utils/constant";

// Get All Programs
export const getUserPrograms = createAsyncThunk(
    "getUserPrograms",
    async (query) => {
        let updateQuery = query
        if(query.value === 'planned'){
            updateQuery = {...query, value: 'yettojoin'}
        }
        let queryParams = ''
        if(updateQuery && Object.keys(updateQuery).length){         
            if(updateQuery.hasOwnProperty('type')){
                queryParams = ( queryParams === '' ? '?' : '&') + `${updateQuery.type}=${updateQuery.value}`
            }

            if(updateQuery.hasOwnProperty('page')){
                queryParams =  (queryParams === '' ? '?' : `${queryParams}&`) + `${updateQuery.page}=${updateQuery.number}`
            }
        }
        queryParams = queryParams !== '' ? `${queryParams}&limit=6` : '?limit=6'
       
        const getUserProgram = await api.get(`fetch_program${queryParams}`);
        if (getUserProgram.status === 200 && getUserProgram.data) {
            const response = {
                ...getUserProgram.data,
                filterType: updateQuery?.type || '',
                filterValue: updateQuery?.value || ''
            }
            return response;
        }
        return getUserProgram;
    }
);


export const updateProgram = createAsyncThunk(
    "updateProgram",
    async (data) => {
        const updateUserProgram = await api.post("update_program", data);
        if (updateUserProgram.status === 200 && updateUserProgram.data) {
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
        if (getDetailsofProgram.status === 200 && getDetailsofProgram.data && getDetailsofProgram.data.program) {
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
        const headers = {
            'Content-Type': 'application/json',
        }
        const programTaskAssign = await api.post('program_task_assign/create_task', data, {
            headers: headers
        });
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


export const getMenteePrograms = createAsyncThunk(
    "getMenteePrograms",
    async (query) => {

        let queryString = query
        if (queryString.value === 'yettojoin') {
            queryString.value = 'planned';
        }

        if (queryString.value === 'yettostart') {
            queryString.value = 'recently_joined';
        }     

        if (queryString.value === 'inprogress') {
            queryString.value = 'ongoing';
        }


        let queryParams = ''
        if(queryString && Object.keys(queryString).length){         
            if(queryString.hasOwnProperty('type')){
                queryParams = ( queryParams === '' ? '?' : '&') + `${queryString.type}=${queryString.value}`
            }

            if(queryString.hasOwnProperty('page')){
                queryParams =  (queryParams === '' ? '?' : `${queryParams}&`) + `${queryString.page}=${queryString.number}`
            }
        }
        queryParams = queryParams !== '' ? `${queryParams}&limit=6` : '?limit=6'


        // const queryParams = queryString && Object.keys(queryString).length ? `?${queryString.type}=${queryString.value}&limit=9` : '?limit=9'
        const getUserProgram = await api.get(`mentee_program/all${queryParams}`);
        if (getUserProgram.status === 200 && getUserProgram.data) {
            const response = {
                ...getUserProgram.data,
                filterType: queryString?.type || '',
                filterValue: queryString?.value || ''
            }
            return response;
        }
        return getUserProgram;
    }
);


export const getMenteeJoinedInProgram = createAsyncThunk(
    "getMenteeJoinedInProgram",
    async (data) => {
        const menteeJoinedProgram = await api.post('mentee_program/enroll_check', data);
        if (menteeJoinedProgram.status === 200 && menteeJoinedProgram.data) {
            return menteeJoinedProgram.data;
        }
        return menteeJoinedProgram;
    }
);

export const menteeJoinProgram = createAsyncThunk(
    "menteeJoinProgram",
    async (data) => {
        const menteeJoinProgram = await api.post('mentee_program/join_program', data);
        if (menteeJoinProgram.status === 200 && menteeJoinProgram.data) {
            return menteeJoinProgram.data;
        }
        return menteeJoinProgram;
    }
);


export const getMenteeProgramCount = createAsyncThunk(
    "getMenteeProgramCount",
    async () => {
        const menteeProgramCount = await api.get('mentee_program/count_program');
        if (menteeProgramCount.status === 200 && menteeProgramCount.data) {
            return menteeProgramCount.data;
        }
        return menteeProgramCount;
    }
);


export const startProgramTask = createAsyncThunk(
    "startProgramTask",
    async (data) => {
        const startTask = await api.patch('program_task_assign/task_start', data);
        if (startTask.status === 200 && startTask.data) {
            return startTask.data;
        }
        return startTask;
    }
);


export const getProgramTaskDetails = createAsyncThunk(
    "getProgramTaskDetails",
    async (taskId) => {
        const queryString = taskId !== '' ? `?task_id=${taskId}` : ''
        const taskdetails = await api.get(`program_task_assign/task_submission${queryString}`);
        if (taskdetails.status === 200 && taskdetails.data) {
            return taskdetails.data;
        }
        return taskdetails;
    }
);


export const submitProgramTaskDetails = createAsyncThunk(
    "submitProgramTaskDetails",
    async (data) => {
        const submitTask = await api.post("program_task_assign/task_submission", data);
        if (submitTask.status === 201 && submitTask.data) {
            return submitTask.data;
        }
        return submitTask;
    }
);

export const chartProgramList = createAsyncThunk(
    "chartProgramList",
    async (data) => {
        const chartProgram = await api.get(`program-performance?filter_by=${data}`);
        if (chartProgram.status === 200 && chartProgram.data) {
            return chartProgram.data;
        }
        return chartProgram;
    }
);


export const updateUserProgramInfo = createAction('update/userProgramInfo')