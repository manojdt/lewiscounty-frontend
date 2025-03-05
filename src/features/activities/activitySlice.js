import {
    createSlice
} from "@reduxjs/toolkit";
import {
    userActivities
} from "../../services/activities";

const initialState = {
    activity: [],
    loading: false,
    status: "",
    error: "",
};

export const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userActivities.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(userActivities.fulfilled, (state, action) => {
                return {
                    ...state,
                    activity: action.payload,
                    loading: false,
                };
            })
            .addCase(userActivities.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


    },
});

export default activitySlice.reducer;