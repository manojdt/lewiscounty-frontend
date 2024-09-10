import {
    createSlice
} from "@reduxjs/toolkit";

import {
    createPost,
    getPost,
    getPostDetails,
    getRecentPosts,
    getUserPost,
    updateFeedTrack
} from "../../services/feeds";
import {
    feedStatus
} from "../../utils/constant";

const initialState = {
    feeds: [],
    feedDetails: {},
    recentPosts: [],
    userPost: [],
    loading: false,
    status: "",
    error: "",
};

export const feedSlice = createSlice({
    name: "feeds",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPost.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getPost.fulfilled, (state, action) => {
                return {
                    ...state,
                    feeds: action.payload,
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(getPost.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(getPostDetails.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getPostDetails.fulfilled, (state, action) => {
                return {
                    ...state,
                    feedDetails: action.payload,
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(getPostDetails.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(createPost.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(createPost.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: feedStatus.create,
                    loading: false,
                };
            })
            .addCase(createPost.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(getRecentPosts.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getRecentPosts.fulfilled, (state, action) => {
                return {
                    ...state,
                    recentPosts: action.payload,
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(getRecentPosts.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });


        builder
            .addCase(updateFeedTrack.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(updateFeedTrack.fulfilled, (state, action) => {
                return {
                    ...state,
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(updateFeedTrack.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });



            builder
            .addCase(getUserPost.pending, (state) => {
                return {
                    ...state,
                    loading: true,
                };
            })
            .addCase(getUserPost.fulfilled, (state, action) => {
                return {
                    ...state,
                    userPost : action.payload,
                    status: feedStatus.load,
                    loading: false,
                };
            })
            .addCase(getUserPost.rejected, (state, action) => {
                return {
                    ...state,
                    loading: false,
                    error: action.error.message,
                };
            });

    },
});

export default feedSlice.reducer;