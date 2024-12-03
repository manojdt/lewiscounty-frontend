import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

import api from './api';

export const getCalendarEvents = createAsyncThunk(
  'getCalendarEvents',
  async () => {
    const calendatEvents = await api.get('/calendar_meeting/meeting');
    if (calendatEvents.status === 200 && calendatEvents.data) {
      return calendatEvents.data;
    }
    return calendatEvents;
  }
);

export const createCalendarEvent = createAsyncThunk(
  'createCalendarEvent',
  async (data) => {
    const createEvent = await api.post('/calendar_meeting/meeting', data);
    if (createEvent.status === 200 && createEvent.data) {
      return createEvent.data;
    }
    return createEvent;
  }
);

export const updateCalendarEvent = createAsyncThunk(
  'updateCalendarEvent',
  async (id) => {
    const updateEvent = await api.get(`/calendar_meeting/meeting?id=${id}`);
    if (updateEvent.status === 200 && updateEvent.data) {
      return updateEvent.data;
    }
    return updateEvent;
  }
);

export const getCalendarFilterEvents = createAsyncThunk(
  'getCalendarFilterEvents',
  async ({ startDate, endDate, status }) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    if (status !== 'all') {
      params.append('status', status);
    }

    const getEvents = await api.get(
      `/calendar_meeting/meeting?${params.toString()}`
    );

    if (getEvents.status === 200 && getEvents.data) {
      return getEvents.data;
    }
    return getEvents;
  }
);

// http://127.0.0.1:8000/api/calendar_meeting/meeting?start_date=2024-09-01&end_date=2024-11-30&status=reschedule
