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
    getAllTickets: builder.query({
      query: ({ status, page, limit }) => {
        let queryParams = `page=${page}&limit=${limit}`;

        if (status !== 'all') {
          queryParams = `status=${status}&${queryParams}`;
        }

        return {
          url: `/api/filter_tickets?${queryParams}`,
        };
      },
    }),
    getTicket: builder.query({
      query: (slug) => `/api/tickets/${slug}/`,
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useGetAllTicketsQuery,
  useGetTicketQuery,
} = ticketsApi;
