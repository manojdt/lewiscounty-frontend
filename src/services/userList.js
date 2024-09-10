import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";


export const getMyMentors = createAsyncThunk(
    "getMyMentors",
    async () => {
        const myMentors = await api.get('/mentors/my_mentors');
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
    async () => {
        const myMenteeList = await api.get('/mentee/my_mentee');
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


