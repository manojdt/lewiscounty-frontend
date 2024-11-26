import { createSlice } from '@reduxjs/toolkit';
import {
  createCalendarEvent,
  getCalendarEvents,
  getCalendarFilterEvents,
  updateCalendarEvent,
} from '../../services/scheduler';
import { calendarStatus } from '../../utils/constant';

const initialState = {
  //   events: [],
  //   loading: false,
  //   status: '',
  //   error: '',
  events: [],
  filteredEvents: [],
  getEvent: [],
  createdEvent: null,
  loading: false,
  error: null,
};

export const schedulerSlice = createSlice({
  name: 'schedulerInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCalendarEvents.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getCalendarEvents.fulfilled, (state, action) => {
        return {
          ...state,
          events: action.payload,
          status: calendarStatus.load,
          loading: false,
        };
      })
      .addCase(getCalendarEvents.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder
      .addCase(createCalendarEvent.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        return {
          ...state,
          status: calendarStatus.create,
          loading: false,
        };
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });

    builder.addCase(getCalendarFilterEvents.fulfilled, (state, action) => {
      state.filteredEvents = action.payload;
    });

    builder
      .addCase(updateCalendarEvent.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        return {
          ...state,
          getEvent: action.payload,
          status: calendarStatus.load,
          loading: false,
        };
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
  },
});

export default schedulerSlice.reducer;
