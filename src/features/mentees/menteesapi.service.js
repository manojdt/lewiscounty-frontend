import { rtkQueryApiServices } from '../../services/api';

export const menteeApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    // Get mentee details by ID
    getMenteeDetails: builder.query({
      query: (menteeId) => ({
        url: `/mentee_info_update/mentee/mentee_registration_form/${menteeId}/`,
        method: 'GET',
      }),
      providesTags: (result, error, menteeId) => [{ type: 'MenteeDetails', id: menteeId }],
    }),
    
    // Get all mentees (for admin dashboard)
    getAllMentees: builder.query({
      query: (params) => ({
        url: 'mentee_info_update/mentee_registration_form/',
        method: 'GET',
        params: params, // Optional filters, pagination, etc.
      }),
      providesTags: ['Mentees'],
    }),
    
    // Update mentee details
    updateMenteeDetails: builder.mutation({
      query: ({ menteeId, data }) => ({
        url: `mentee_info_update/mentee_registration_form/${menteeId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { menteeId }) => [
        { type: 'MenteeDetails', id: menteeId },
        'Mentees'
      ],
    }),
    
    // Get current user's mentee profile (if any)
    getCurrentUserMenteeProfile: builder.query({
      query: () => ({
        url: 'user/mentee-profile',
        method: 'GET',
      }),
      providesTags: ['CurrentUserProfile'],
    }),
  }),
});

export const {
  useGetMenteeDetailsQuery,
  useGetAllMenteesQuery,
  useUpdateMenteeDetailsMutation,
  useGetCurrentUserMenteeProfileQuery,
} = menteeApi;