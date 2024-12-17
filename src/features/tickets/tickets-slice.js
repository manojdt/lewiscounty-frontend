import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery,
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticket) => ({
        url: '/api/tickets/',
        method: 'POST',
        body: ticket,
      }),
    }),
    getAllTicket: builder.query({
      query: () => '/api/tickets/',
    }),
  }),
});

export const { useCreateTicketMutation, useGetAllTicketQuery } = ticketsApi;
