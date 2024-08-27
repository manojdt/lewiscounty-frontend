import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";


export const getAllTasks = createAsyncThunk(
    "getAllTasks",
    async (query = {}) => {
        let queryString = ''
        if (Object.keys(query).length) {
            queryString += '?'
            for (let a in query) {
                queryString += `${a}=${query[a]}`
            }
        }

        const getAllTask = await api.get(`/program_task_assign/task_list_mentee${queryString}`);
        if (getAllTask.status === 200 && getAllTask.data) {
            return getAllTask.data;
        }
        return getAllTask
    }
);

