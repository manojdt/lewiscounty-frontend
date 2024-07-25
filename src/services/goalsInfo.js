import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";

// Get All Goals
export const getAllGoals = createAsyncThunk(
    "getAllGoals",
    async () => {
        const allGoals = await api.get("goals/goal/");
        if (allGoals.status === 200 && allGoals.data) {
            return allGoals.data;
        }
        return allGoals
    }
);


export const createGoal = createAsyncThunk(
    "createGoal",
    async (data) => {
        const createGoal = await api.post("goals/create-goal/", data);
        if (createGoal.status === 201 && createGoal.data) {
            return createGoal.data;
        }
        return createGoal
    }
);


export const getGoalInfo = createAsyncThunk(
    "getGoalInfo",
    async (id) => {
        const getGoalInfo = await api.get(`goals/goal/${id}/`);
        if (getGoalInfo.status === 200 && getGoalInfo.data) {
            return getGoalInfo.data;
        }
        return getGoalInfo
    }
);