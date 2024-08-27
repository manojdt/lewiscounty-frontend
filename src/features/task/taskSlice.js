import {
    createSlice
} from "@reduxjs/toolkit";

import {
    getAllTasks,
    getSpecificTask
} from "../../services/task";

const initialState = {
    taskList: [],
    task: {},
    loading: false,
    status: "",
    error: "",
};

export const taskSlice = createSlice({
    name: "taskList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTasks.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getAllTasks.fulfilled, (state, action) => {
                return {
                    ...state,
                    taskList: action.payload,
                    loading: false,
                };
            })
            .addCase(getAllTasks.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(getSpecificTask.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getSpecificTask.fulfilled, (state, action) => {
                return {
                    ...state,
                    task: action.payload,
                    loading: false,
                };
            })
            .addCase(getSpecificTask.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


    },
});

export default taskSlice.reducer;