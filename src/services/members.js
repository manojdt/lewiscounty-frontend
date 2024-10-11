import {
    createAsyncThunk,
} from "@reduxjs/toolkit";
import api from "./api";


export const getMembers = createAsyncThunk(
    "getMembers",
    async (query='') => {
        let queryString = new URLSearchParams(query).toString()
        const getActivities = await api.get(`mentee_program/launched-programs${queryString}`);
        if (getActivities.status === 200 && getActivities.data) {
            return getActivities.data;
        }
        return getActivities;
    }
);


export const getMembersList = createAsyncThunk(
    "getMembersList",
    async (query='') => {
        let queryString = new URLSearchParams(query).toString()
        const getMembersInfo = await api.get(`members/member-list?${queryString}`);
        if (getMembersInfo.status === 200 && getMembersInfo.data) {
            return { role: query.role_name, data: getMembersInfo.data };
        }
        return getMembersInfo;
    }
);

export const deactivateUser = createAsyncThunk(
    "deactivateUser",
    async (data) => {
        const deactivateUserInfo = await api.post(`members/members-request`, data);
        if (deactivateUserInfo.status === 200 && deactivateUserInfo.data) {
            return deactivateUserInfo.data;
        }
        return deactivateUserInfo;
    }
);

