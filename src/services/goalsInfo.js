import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";

// Get All Goals
export const getAllGoals = createAsyncThunk(
    "getAllGoals",
    async (query = '') => {
        const queryString = query !== '' ? `?status=${query}` : ''
        const allGoals = await api.get(`goals/goal${queryString}`);
        if (allGoals.status === 200 && allGoals.data) {
            return allGoals.data;
        }
        return allGoals
    }
);

export const updateLocalGoalInfo = createAction('update/updateLocalGoalInfo')


export const createGoal = createAsyncThunk(
    "createGoal",
    async (data) => {
        const createGoal = await api.post("goals/create-goal", data);
        if (createGoal.status === 201 && createGoal.data) {
            return createGoal.data;
        }
        return createGoal
    }
);


export const getGoalInfo = createAsyncThunk(
    "getGoalInfo",
    async (id) => {
        const getGoalInfo = await api.get(`goals/goal/${id}`);
        if (getGoalInfo.status === 200 && getGoalInfo.data) {
            return getGoalInfo.data;
        }
        return getGoalInfo
    }
);


export const getGoalsCount = createAsyncThunk(
    "getGoalsCount",
    async () => {
        const getAllGoalsCount = await api.get(`goals/goal-status-count`);
        if (getAllGoalsCount.status === 200 && getAllGoalsCount.data) {
            return getAllGoalsCount.data;
        }
        return getAllGoalsCount
    }
);


export const updateGoalStatus = createAsyncThunk(
    "updateGoalStatus",
    async (data) => {
        const updateGoalStatusValue = await api.put('goals/update-goal-status', data);
        if (updateGoalStatusValue.status === 200 && updateGoalStatusValue.data) {
            return { ...updateGoalStatusValue.data, actionstatus: data.action  } ;
        }
        return updateGoalStatusValue
    }
);


export const updateGoal = createAsyncThunk(
    "updateGoal",
    async (data) => {
        const updateGoalData = await api.put('goals/update-goal', data);
        if (updateGoalData.status === 200 && updateGoalData.data) {
            return updateGoalData.data;
        }
        return updateGoalData
    }
);


export const deleteGoalInfo = createAsyncThunk(
    "deleteGoalInfo",
    async (id) => {
        const deleteGoal = await api.delete(`goals/delete-goal/${id}`);
        if (deleteGoal.status === 200 && deleteGoal.data) {
            return deleteGoal.data;
        }
        return deleteGoal
    }
);


export const getGoalsProgressData = createAsyncThunk(
    "getGoalsProgressData",
    async () => {
        const goalProgressData = await api.get('goals/goals-progress-chart');
        if (goalProgressData.status === 200 && goalProgressData.data) {
            return goalProgressData.data;
        }
        return goalProgressData
    }
);


export const getGoalsOverAllData = createAsyncThunk(
    "getGoalsOverAllData",
    async (query) => {
        const goalOverAll = await api.get(`goals/goals-overall-perfromance?${query}`);
        if (goalOverAll.status === 200 && goalOverAll.data) {
            return goalOverAll.data;
        }
        return goalOverAll
    }
);



export const getGoalsRequest = createAsyncThunk(
    "getGoalsRequest",
    async () => {
        const programRequest = await api.get('goals/goals-request');
        if (programRequest.status === 200 && programRequest.data) {
            return programRequest.data;
        }
        return programRequest
    }
);


export const getGoalsHistory = createAsyncThunk(
    "getGoalsHistory",
    async () => {
        const goalsHistory = await api.get('goals/goals-history');
        if (goalsHistory.status === 200 && goalsHistory.data) {
            return goalsHistory.data;
        }
        return goalsHistory
    }
);



export const getRecentGoalActivity = createAsyncThunk(
    "getRecentGoalActivity",
    async () => {
        const goalActivity = await api.get('goals/goals-activities');
        if (goalActivity.status === 200 && goalActivity.data) {
            return goalActivity.data;
        }
        return goalActivity
    }
);

