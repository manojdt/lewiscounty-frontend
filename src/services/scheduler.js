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
  async ({ apiData, eventSelect, id }) => {
    const updateEvent = await api.put(
      `/calendar_meeting/meeting?option=${eventSelect}&id=${id}`,
      apiData
    );
    if (updateEvent.status === 200 && updateEvent.data) {
      return updateEvent.data;
    }
    return updateEvent;
  }
);

export const deleteCalendarEvent = createAsyncThunk(
  'deleteCalendarEvent',
  async ({ selectedOption, itemId }) => {
    const deleteEvent = await api.delete(
      `/calendar_meeting/meeting?option=${selectedOption}&id=${itemId}`
    );
    if (deleteEvent.status === 200 && deleteEvent.data) {
      return deleteEvent.data;
    }
    return deleteEvent;
  }
);

export const getCalendarEvent = createAsyncThunk(
  'updateCalendarEvent',
  async (id) => {
    const getEvent = await api.get(`/calendar_meeting/meeting?id=${id}`);
    if (getEvent.status === 200 && getEvent.data) {
      return getEvent.data;
    }
    return getEvent;
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
