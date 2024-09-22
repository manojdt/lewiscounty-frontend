import {
    createSlice
} from "@reduxjs/toolkit";
import {
    requestStatus
} from "../../utils/constant";
import {
    cancelMemberRequest,
    getCategoryList,
    getMemberRequest,
    getprogramRequest,
    getResourceRequest,
    goalsRequest,
    programCancelRequest,
    programRescheduleRequest,
    updateGoalRequest,
    updateLocalRequest,
    updateMemberRequest,
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
    categoryList: [],
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

        builder
            .addCase(updateGoalRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateGoalRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: requestStatus.goalupdate,
                    loading: false,
                };
            })
            .addCase(updateGoalRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(getCategoryList.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getCategoryList.fulfilled, (state, action) => {
                return {
                    ...state,
                    categoryList: action.payload,
                    status: requestStatus.categoryload,
                    loading: false,
                };
            })
            .addCase(getCategoryList.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



        builder
            .addCase(getMemberRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMemberRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    memberRequest: action.payload,
                    status: requestStatus.memberload,
                    loading: false,
                };
            })
            .addCase(getMemberRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



        builder
            .addCase(updateMemberRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateMemberRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: requestStatus.memberupdate,
                    loading: false,
                };
            })
            .addCase(updateMemberRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



        builder
            .addCase(cancelMemberRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(cancelMemberRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: requestStatus.membercancel,
                    loading: false,
                };
            })
            .addCase(cancelMemberRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(programRescheduleRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(programRescheduleRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: requestStatus.reschedule,
                    loading: false,
                };
            })
            .addCase(programRescheduleRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



        builder
            .addCase(programCancelRequest.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(programCancelRequest.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: requestStatus.cancel,
                    loading: false,
                };
            })
            .addCase(programCancelRequest.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


    },
});

export default requestSlice.reducer;