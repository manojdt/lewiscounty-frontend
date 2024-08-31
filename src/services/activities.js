import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";
import api from "./api";


export const userActivities = createAsyncThunk(
    "userActivities",
    async (data) => {
        const getActivities = await api.get("notification/notification", data);
        if (getActivities.status === 200) {
            return getActivities;
        }
        return getActivities;
    }
);