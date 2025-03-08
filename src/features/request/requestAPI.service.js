import { rtkQueryApiServices } from "../../services/api";
import { acceptMember } from "../../services/category";

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
    getMenteeJoinRequestData: builder.query({
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
          url: `/mentee_info_update/mentee/mentee_registration_form/?${queryParams.toString()}`,
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
    
    // Approve Mnetee a join request
    approveMenteeJoinRequest: builder.mutation({
      query: (id) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/verify_application/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    rejectMenteeJoinRequest: builder.mutation({
      query: ({id,data}) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/reject/`,
        method: 'POST',
        body:data
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    
    reviewMenteeJoinRequest: builder.mutation({
      query: ({id,data}) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/inreview/`,
        method: 'POST',
        body:data
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    notSubmitMenteeJoinRequest: builder.mutation({
      query: ({id,data}) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/not_submitted/`,
        method: 'POST',
        body:data
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    submitMenteeJoinRequest: builder.mutation({
      query: (id) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/submitted/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    finalApproveMenteeJoinRequest: builder.mutation({
      query: (id) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/final_approved/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
    }),
    acceptMemberRequest: builder.mutation({
      query: (body) => ({
        url: `user/accept_member`,
        method: 'POST',
        body
      }),
    }),
    finalRejectMenteeJoinRequest: builder.mutation({
      query: ({id,data}) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${id}/final_rejected/`,
        method: 'POST',
        body:data
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JoinRequest', id }],
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

    acceptMemberRequest: builder.mutation({
      query: (body) => ({
        url: `user/accept_member`,
        method: 'POST',
        body
      }),
    }),
    acceptVerifyApplication: builder.mutation({
      query: (body) => ({
        url: `user/accept_member`,
        method: 'POSt',
        body
      }),
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
  useAcceptVerifyApplicationMutation,
  useAcceptMemberRequestMutation,
  useGetJoinRequestDataQuery,
  useGetMenteeJoinRequestDataQuery,
  useApproveJoinRequestMutation,
  useAcceptMemberRequestMutation,
  useRejectMenteeJoinRequestMutation,
  useApproveMenteeJoinRequestMutation,
  useReviewMenteeJoinRequestMutation,
  useNotSubmitMenteeJoinRequestMutation,
  useSubmitMenteeJoinRequestMutation,
  useFinalApproveMenteeJoinRequestMutation,
  useFinalRejectMenteeJoinRequestMutation,
  useRejectJoinRequestMutation,
  useDeleteJoinRequestMutation,
  useSendTrainingReminderMutation,
  useStartBackgroundCheckMutation,
  useVerifyApplicationMutation,
} = adminRequestApi;
