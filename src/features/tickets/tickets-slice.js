import { rtkQueryApiServices } from '../../services/api';

export const ticketsApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticket) => ({
        url: 'tickets/',
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
