import {
    createSlice
} from "@reduxjs/toolkit";
import {
    createGoal,
    getAllGoals,
    getGoalInfo,
} from "../../services/goalsInfo";
import {
    goalStatus
} from "../../utils/constant";

const initialState = {
    goalsList: [],
    goalInfo: {},
    loading: false,
    status: "",
    error: "",
};

export const goalsSlice = createSlice({
    name: "goalsInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllGoals.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getAllGoals.fulfilled, (state, action) => {
                return {
                    ...state,
                    goalsList: action.payload,
                    status: goalStatus.load,
                    loading: false,
                };
            })
            .addCase(getAllGoals.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(createGoal.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: goalStatus.create,
                    loading: false,
                };
            })
            .addCase(createGoal.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
        builder
            .addCase(getGoalInfo.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getGoalInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: '',
                    goalInfo: action.payload,
                    loading: false,
                };
            })
            .addCase(getGoalInfo.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


    },
});

export default goalsSlice.reducer;