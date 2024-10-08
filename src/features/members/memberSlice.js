import {
    createSlice
} from "@reduxjs/toolkit";

import {
    feedStatus
} from "../../utils/constant";
import { getMembersList } from "../../services/members";

const initialState = {
    mentor: [],
    mentee: [],
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
                let { role, data } = action.payload
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


       
    },
});

export default memberSlice.reducer;