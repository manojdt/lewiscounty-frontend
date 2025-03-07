import { rtkQueryApiServices } from "../../services/api";

// const { USER } = rtkQueryServiceTags;
// Helper function to handle JWT tokens

export const adminRequestApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    getJoinRequestData: builder.query({
      query: (params) => {
        // Build query string with all provided parameters
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.user) queryParams.append('user', params.user);
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.sort) queryParams.append('sort', params.sort);
        
        return {
          url: `user/join_request?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      // Transform the response to include pagination metadata
      transformResponse: (response) => {
        return {
          results: response.results || [],
          count: response.count || 0,
          page: response.current_page || 1,
          pageSize: response.page_size || 10,
          totalPages: response.total_pages || 1,
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'JoinRequest', id })),
              { type: 'JoinRequest', id: 'LIST' },
            ]
          : [{ type: 'JoinRequest', id: 'LIST' }],
    }),
    
    // Approve a join request
    approveJoinRequest: builder.mutation({
      query: (id) => ({
        url: `join-requests/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    
    // Reject a join request
    rejectJoinRequest: builder.mutation({
      query: (id) => ({
        url: `join-requests/${id}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    
    // Delete a join request
    deleteJoinRequest: builder.mutation({
      query: (id) => ({
        url: `join-requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'JoinRequest', id: 'LIST' }],
    }),
    
    // Send reminder for training video
    sendTrainingReminder: builder.mutation({
      query: (id) => ({
        url: `join-requests/${id}/send-reminder`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    
    // Start background verification
    startBackgroundCheck: builder.mutation({
      query: (id) => ({
        url: `join-requests/${id}/start-background-check`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    
    // Verify application
    verifyApplication: builder.mutation({
      query: (id) => ({
        url: `join-requests/${id}/verify`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
  }),
});
export const {
  useGetJoinRequestDataQuery,
  useApproveJoinRequestMutation,
  useRejectJoinRequestMutation,
  useDeleteJoinRequestMutation,
  useSendTrainingReminderMutation,
  useStartBackgroundCheckMutation,
  useVerifyApplicationMutation,
} = adminRequestApi;
