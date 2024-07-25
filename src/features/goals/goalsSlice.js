import {
    createSlice
} from "@reduxjs/toolkit";
import {
    createGoal,
    deleteGoalInfo,
    getAllGoals,
    getGoalInfo,
    getGoalsCount,
    updateGoal,
    updateGoalStatus,
} from "../../services/goalsInfo";
import {
    goalStatus
} from "../../utils/constant";

const initialState = {
    goalsList: [],
    createdGoal: {},
    goalsCount: {},
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
                    createdGoal: action.payload,
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
        builder
            .addCase(getGoalsCount.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getGoalsCount.fulfilled, (state, action) => {
                return {
                    ...state,
                    goalsCount: action.payload,
                    loading: false,
                };
            })
            .addCase(getGoalsCount.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
        builder
            .addCase(updateGoal.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: goalStatus.update,
                    loading: false,
                };
            })
            .addCase(updateGoal.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
        builder
            .addCase(updateGoalStatus.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateGoalStatus.fulfilled, (state, action) => {
                const status = action.payload.actionstatus || goalStatus.statusupdate
                return {
                    ...state,
                    status: status,
                    loading: false,
                };
            })
            .addCase(updateGoalStatus.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
        builder
            .addCase(deleteGoalInfo.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(deleteGoalInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: goalStatus.delete,
                    loading: false,
                };
            })
            .addCase(deleteGoalInfo.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

    },
});

export default goalsSlice.reducer;