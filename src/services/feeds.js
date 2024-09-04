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
    async (data) => {
        // const createPostResponse = await api.get('post/create-post', data);
        // if (createPostResponse.status === 200 && createPostResponse.data) {
        //     return createPostResponse.data;
        // }
        return ''
        // return createPostResponse;
    }
);