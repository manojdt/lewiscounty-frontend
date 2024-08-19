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

// export const getMyMentees = createAsyncThunk(
//     "getMyMentees",
//     async () => {
//         const helpContactData = await api.get('/profile/help_desk_contact');
//         if (helpContactData.status === 200 && helpContactData.data) {
//             return helpContactData.data;
//         }
//         return helpContactData
//     }
// );