import { rtkQueryApiServices } from '../../services/api';

export const programApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    // postComment: builder.mutation({
    //   query: ({ id, ticket }) => ({
    //     url: `/tickets/${id}/comments/`,
    //     method: 'POST',
    //     body: ticket,
    //   }),
    // }),
    getStates: builder.query({
      query: () => `/program/states`,
    }),
    getCities: builder.query({
      query: (id) => `/program/cities?state_id=${id}`,
    }),
  }),
});

export const { useGetStatesQuery, useGetCitiesQuery } = programApi;
