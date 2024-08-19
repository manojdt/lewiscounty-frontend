import {
    createSlice
} from "@reduxjs/toolkit";

import {
    reportsStatus
} from "../../utils/constant";
import {
    getAllReports,
    getProgramsByCategoryId
} from "../../services/reportsInfo";

const initialState = {
    allreports: [],
    categoryPrograms: [],
    loading: false,
    status: "",
    error: "",
};

export const reportsSlice = createSlice({
    name: "reportsInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReports.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                return {
                    ...state,
                    allreports: action.payload,
                    status: reportsStatus.load,
                    loading: false,
                };
            })
            .addCase(getAllReports.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(getProgramsByCategoryId.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getProgramsByCategoryId.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: '',
                    categoryPrograms: action.payload,
                    loading: false,
                };
            })
            .addCase(getProgramsByCategoryId.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
    }
})

export default reportsSlice.reducer;