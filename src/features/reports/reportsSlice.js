import {
    createSlice
} from "@reduxjs/toolkit";

import {
    reportsStatus
} from "../../utils/constant";
import {
    createReport,
    deleteReports,
    getAllReports,
    getProgramsByCategoryId,
    getReportDetails,
    getReportProgramDetails,
    updateReportDetails
} from "../../services/reportsInfo";

const initialState = {
    allreports: [],
    categoryPrograms: [],
    programDetails: {},
    reportDetails: {},
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

        builder
            .addCase(getReportProgramDetails.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getReportProgramDetails.fulfilled, (state, action) => {
                return {
                    ...state,
                    programDetails: action.payload,
                    status: reportsStatus.load,
                    loading: false,
                };
            })
            .addCase(getReportProgramDetails.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(createReport.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(createReport.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: reportsStatus.create,
                    loading: false,
                };
            })
            .addCase(createReport.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



        builder
            .addCase(getReportDetails.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getReportDetails.fulfilled, (state, action) => {
                return {
                    ...state,
                    reportDetails: action.payload,
                    loading: false,
                };
            })
            .addCase(getReportDetails.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
        builder
            .addCase(updateReportDetails.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateReportDetails.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: reportsStatus.update,
                    loading: false,
                };
            })
            .addCase(updateReportDetails.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(deleteReports.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(deleteReports.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: reportsStatus.delete,
                    loading: false,
                };
            })
            .addCase(deleteReports.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
    }
})

export default reportsSlice.reducer;