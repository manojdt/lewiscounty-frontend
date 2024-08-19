import {
    createSlice
} from "@reduxjs/toolkit";
import {
    getMyMentors,
    getMyMentorInfo,
    getMentorProgramActivity
} from "../../services/userList";

const initialState = {
    mentorList: [],
    mentorDetails: {},
    programActivity: [],
    menteeList: [],
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

    },
});

export default userListSlice.reducer;