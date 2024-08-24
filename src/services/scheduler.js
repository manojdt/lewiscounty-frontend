import {
    createAsyncThunk,
    createAction
} from "@reduxjs/toolkit";

import api from "./api";


export const getCalendarEvents = createAsyncThunk(
    "getCalendarEvents",
    async () => {
        const calendatEvents = await api.get('/calendar_meeting/meeting');
        if (calendatEvents.status === 200 && calendatEvents.data) {
            return calendatEvents.data;
        }
        return calendatEvents
    }
);

export const createCalendarEvent = createAsyncThunk(
    "createCalendarEvent",
    async (data) => {
        const createEvent = await api.post('/calendar_meeting/meeting', data);
        if (createEvent.status === 200 && createEvent.data) {
            return createEvent.data;
        }
        return createEvent
    }
);