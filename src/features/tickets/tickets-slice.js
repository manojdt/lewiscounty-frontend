import { rtkQueryApiServices } from '../../services/api';

export const ticketsApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticket) => ({
        url: '/tickets/',
        method: 'POST',
        body: ticket,
      }),
    }),
    updateTicket: builder.mutation({
      query: ({ id, ticket }) => ({
        url: `/tickets/${id}/`,
        method: 'PUT',
        body: ticket,
      }),
    }),
    // createTicket: builder.mutation({
    //   query: (ticket) => ({
    //     url: '/api/tickets/',
    //     method: 'POST',
    //     body: ticket,
    //   }),
    // }),
    postComment: builder.mutation({
      query: ({ id, ticket }) => ({
        url: `/tickets/${id}/comments/`,
        method: 'POST',
        body: ticket,
      }),
    }),
    getAllTickets: builder.query({
      query: () => `/tickets/`,
    }),
    // getAllTickets: builder.query({
    //   query: ({ status, page, limit }) => {
    //     let queryParams = `page=${page}&limit=${limit}`;

    //     if (status !== 'all') {
    //       queryParams = `status=${status}&${queryParams}`;
    //     }

    //     return {
    //       url: `/api/filter_tickets?${queryParams}`,
    //     };
    //   },
    // }),
    getTicket: builder.query({
      query: (slug) => `/tickets/${slug}/`,
    }),
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status/`,
        method: 'PUT',
        body: { status },
      }),
    }),
  }),
});

export const {
  // useCreateTicketMutation,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  usePostCommentMutation,
  useGetAllTicketsQuery,
  useGetTicketQuery,
  useUpdateStatusMutation,
} = ticketsApi;
