import {
    createSlice
} from "@reduxjs/toolkit";
import {
    requestStatus
} from "../../utils/constant";
import {
    getprogramRequest,
    getResourceRequest,
    goalsRequest,
    updateLocalRequest,
    updateProgramRequest
} from "../../services/request";

const initialState = {
    programRequest: [],
    memberRequest: [],
    resourceRequest: [],
    goalsRequest: [],
    testimonialsRequest: [],
    technicalSupportRequest: [],
    certificateRequest: [],
    reportRequest: [],
    loading: false,
    status: "",
    error: "",
};

export const requestSlice = createSlice({
    name: "requestInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getprogramRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getprogramRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    programRequest: action.payload,
                    status: requestStatus.load,
                    loading: false,
                };
            })
            .addCase(getprogramRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });
        builder
            .addCase(getResourceRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getResourceRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    resourceRequest: action.payload,
                    status: requestStatus.load,
                    loading: false,
                };
            })
            .addCase(getResourceRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(updateProgramRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateProgramRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: requestStatus.programupdate,
                    loading: false,
                };
            })
            .addCase(updateProgramRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



        builder.addCase(updateLocalRequest, (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        })



        builder
            .addCase(goalsRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(goalsRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    goalsRequest: action.payload,
                    status: requestStatus.load,
                    loading: false,
                };
            })
            .addCase(goalsRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


    },
});

export default requestSlice.reducer;