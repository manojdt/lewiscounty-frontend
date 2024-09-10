import {
    createSlice
} from "@reduxjs/toolkit";
import {
    getMyMentors,
    getMyMentorInfo,
    getMentorProgramActivity,
    getMyMentees,
    getMyMenteeInfo,
    getMenteeProgramActivity
} from "../../services/userList";

const initialState = {
    mentorList: [],
    mentorDetails: {},
    programActivity: [],
    menteeList: [],
    menteeDetails: {},
    loading: false,
    status: "",
    error: "",
};

export const userListSlice = createSlice({
    name: "helpInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMyMentors.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMyMentors.fulfilled, (state, action) => {
                return {
                    ...state,
                    mentorList: action.payload,
                    loading: false,
                };
            })
            .addCase(getMyMentors.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(getMyMentorInfo.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMyMentorInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    mentorDetails: action.payload,
                    menteeDetails: {},
                    loading: false,
                };
            })
            .addCase(getMyMentorInfo.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(getMentorProgramActivity.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMentorProgramActivity.fulfilled, (state, action) => {
                return {
                    ...state,
                    programActivity: action.payload,
                    loading: false,
                };
            })
            .addCase(getMentorProgramActivity.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(getMyMentees.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMyMentees.fulfilled, (state, action) => {
                return {
                    ...state,
                    menteeList: action.payload,
                    loading: false,
                };
            })
            .addCase(getMyMentees.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(getMyMenteeInfo.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMyMenteeInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    menteeDetails: action.payload,
                    mentorDetails: [],
                    loading: false,
                };
            })
            .addCase(getMyMenteeInfo.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(getMenteeProgramActivity.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMenteeProgramActivity.fulfilled, (state, action) => {
                return {
                    ...state,
                    programActivity: action.payload,
                    loading: false,
                };
            })
            .addCase(getMenteeProgramActivity.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

    },
});

export default userListSlice.reducer;