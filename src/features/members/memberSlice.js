import {
    createSlice
} from "@reduxjs/toolkit";

import {
    feedStatus
} from "../../utils/constant";
import {
    deactivateUser,
    getAssignMentorProgram,
    getMembersList
} from "../../services/members";

const initialState = {
    mentor: [],
    mentee: [],
    assignProgramInfo: {
        category: [],
        mentor: [],
        programs: []
    },
    loading: false,
    status: "",
    error: "",
};

export const memberSlice = createSlice({
    name: "members",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMembersList.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getMembersList.fulfilled, (state, action) => {
                console.log('action.payload', action.payload)
                let {
                    role,
                    data
                } = action.payload
                console.log('rrrr', role, data)
                return {
                    ...state,
                    [role]: data,
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(getMembersList.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

        builder
            .addCase(deactivateUser.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(deactivateUser.fulfilled, (state, action) => {
                return {
                    status: '',
                    loading: false,
                };
            })
            .addCase(deactivateUser.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


            builder
            .addCase(getAssignMentorProgram.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getAssignMentorProgram.fulfilled, (state, action) => {
                const response = action.payload
                return {
                    ...state,
                    assignProgramInfo: {
                        category: response?.mentor_details || [],
                        mentor: response?.mentor_details || [],
                        programs: response?.program_details || []
                    },
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(getAssignMentorProgram.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



    },
});

export default memberSlice.reducer;