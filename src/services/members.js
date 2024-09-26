import {
    createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "./api";


export const getMembers = createAsyncThunk(
    "getMembers",
    async (query='') => {
        let queryString = new URLSearchParams(query).toString()
        const getActivities = await api.get(`mentee_program/launched-programs${queryString}`);
        if (getActivities.status === 200 && getActivities.data) {
            return getActivities.data;
        }
        return getActivities;
    }
);

