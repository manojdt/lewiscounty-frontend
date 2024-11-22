import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";


export const getMyMentors = createAsyncThunk(
    "getMyMentors",
    async (data) => {
        const myMentors = await api.get(`/mentors/my_mentors?page=${data?.page + 1 ?? 1}&limit=${data?.pageSize}`);
        if (myMentors.status === 200 && myMentors.data) {
            return myMentors.data.mentor || myMentors.data;
        }
        return myMentors
    }
);

export const getMyTopMentors = createAsyncThunk(
    "getMyMentors",
    async (data) => {
        const myMentors = await api.get(`/rating/top_mentor?page=${data?.page + 1 ?? 1}&limit=${data?.pageSize}&search=${data?.search ?? ""}`);
        if (myMentors.status === 200 && myMentors.data) {
            return myMentors.data.mentor || myMentors.data;
        }
        return myMentors
    }
);

export const getMyMentorInfo = createAsyncThunk(
    "getMyMentorInfo",
    async (id) => {
        const myMentor = await api.get(`/mentors/${id}`);
        if (myMentor.status === 200 && myMentor.data) {
            return myMentor.data.mentor || myMentor.data;
        }
        return myMentor
    }
);

export const getProfileInfo = createAsyncThunk(
    "getProfileInfo",
    async (id) => {
        const myProfile = await api.get(`/user/${id}`);
        if (myProfile.status === 200 && myProfile.data) {
            return myProfile.data.mentor || myProfile.data;
        }
        return myProfile
    }
);


export const getMentorProgramActivity = createAsyncThunk(
    "getMentorProgramActivity",
    async (id) => {
        const programActivity = await api.get(`/mentors/programs_activity_list/${id}`);
        if (programActivity.status === 200 && programActivity.data) {
            return programActivity.data;
        }
        return programActivity
    }
);

export const getMyMentees = createAsyncThunk(
    "getMyMentees",
    async (data) => {
        const myMenteeList = await api.get(`/mentee/my_mentee?page=${data?.page + 1 ?? 1}&limit=${data?.pageSize}`);
        if (myMenteeList.status === 200 && myMenteeList.data) {
            return myMenteeList.data;
        }
        return myMenteeList
    }
);


export const getMyMenteeInfo = createAsyncThunk(
    "getMyMenteeInfo",
    async (id) => {
        const myMentee = await api.get(`/mentee/${id}`);
        if (myMentee.status === 200 && myMentee.data) {
            return myMentee.data.mentor || myMentee.data;
        }
        return myMentee
    }
);


export const getMenteeProgramActivity = createAsyncThunk(
    "getMenteeProgramActivity",
    async (id) => {
        const myMenteeProgramActivity = await api.get(`/programs_activity_list/${id}`);
        if (myMenteeProgramActivity.status === 200 && myMenteeProgramActivity.data) {
            return myMenteeProgramActivity.data.mentor || myMenteeProgramActivity.data;
        }
        return myMenteeProgramActivity
    }
);

export const getFollowList = createAsyncThunk(
    "getFollowList",
    async (id) => {
        const followInfo = await api.get(`/post/user-status/${id}`);
        if (followInfo.status === 200 && followInfo.data) {
            return followInfo.data;
        }
        return followInfo
    }
);


export const userFollow = createAsyncThunk(
    "userFollow",
    async (data) => {
        const userFollowInfo = await api.post(`/post/follow`, data);
        if (userFollowInfo.status === 200 && userFollowInfo.data) {
            return userFollowInfo.data;
        }
        return userFollowInfo
    }
);

export const userUnFollow = createAsyncThunk(
    "userUnFollow",
    async (data) => {
        const userUnFollowInfo = await api.post(`/post/unfollow`, data);
        if (userUnFollowInfo.status === 200 && userUnFollowInfo.data) {
            return userUnFollowInfo.data;
        }
        return userUnFollowInfo
    }
);