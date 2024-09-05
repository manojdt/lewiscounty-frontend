import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";
import api from "./api";


export const createPost = createAsyncThunk(
    "createPost",
    async (data) => {
        const createPostResponse = await api.post('post/create-post', data);
        if (createPostResponse.status === 200 && createPostResponse.data) {
            return createPostResponse.data;
        }
        return createPostResponse;
    }
);

export const getPost = createAsyncThunk(
    "getPost",
    async () => {
        const getPostData = await api.get('post/view-post');
        if (getPostData.status === 200 && getPostData.data) {
            return getPostData.data;
        }
        return getPostData;
    }
);


export const getPostDetails = createAsyncThunk(
    "getPostDetails",
    async (id) => {
        const getPostDetail = await api.get(`post/view-post/${id}`);
        if (getPostDetail.status === 200 && getPostDetail.data) {
            return getPostDetail.data;
        }
        return getPostDetail;
    }
);

