import { rtkQueryApiServices } from "../../services/api";

export const userApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    updateUserPassword: builder.mutation({
      query: (passwordData) => ({
        url: "update-profile-password",
        method: "PUT",
        body: passwordData,
      }),
    }),
    checkEmail: builder.mutation({
      query: (email) => ({
        url: `profile/email-exist/${email}`,
        method: "GET",
      }),
    }),
    getMyMentors: builder.query({
      query: ({ page = 0, pageSize, search = "" }) => ({
        url: `/mentors/my_mentors`,
        params: { page: page + 1, limit: pageSize, search },
      }),
      transformResponse: (response) => response.mentor || response,
      providesTags: ["Mentors"],
    }),

    getMyTopMentors: builder.query({
      query: ({ page = 0, pageSize, search = "" }) => ({
        url: `/rating/top_mentor`,
        params: { page: page + 1, limit: pageSize, search },
      }),
      transformResponse: (response) => response.mentor || response,
      providesTags: ["Mentors"],
    }),
    getJoinRequestCounts: builder.query({
      query: () => ({
        url: `user/join_request_count`,
      }),
    }),

    getMyReqMentors: builder.query({
      query: (query) => {
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) =>
              !(key === "search" && value.trim().length === 0) &&
              !(key === "status" && value === "all")
          )
        );
        return {
          url: `/rating/request-mentor`,
          params: filteredQuery,
        };
      },
      providesTags: ["Mentors"],
    }),

    getMyTopPrograms: builder.query({
      query: (query) => {
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) =>
              !(key === "search" && value.trim().length === 0) &&
              !(key === "status" && value === "all")
          )
        );
        return {
          url: `/rating/top_programs`,
          params: filteredQuery,
        };
      },
      transformResponse: (response) => response.mentor || response,
      providesTags: ["Mentors"],
    }),

    getMentorInfo: builder.query({
      query: (id) => `/mentors/${id}`,
      transformResponse: (response) => response.mentor || response,
      providesTags: (result, error, id) => [{ type: "Mentors", id }],
    }),

    getMentorProgramActivity: builder.query({
      query: (id) => `/mentors/programs_activity_list/${id}`,
      providesTags: (result, error, id) => [
        { type: "Mentors", id: `activity-${id}` },
      ],
    }),

    // Profile related endpoints
    getProfileInfo: builder.query({
      query: (id) => {
        let url = `/user/${id}`;

        return url;
      },
      transformResponse: (response) => response.mentor || response,
      providesTags: (result, error, data) => [{ type: "Profile", id: data.id }],
    }),

    // Mentee related endpoints
    getMyMentees: builder.query({
      query: (query) => {
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) => !(key === "search" && value.trim().length === 0)
          )
        );
        return {
          url: `/mentee/my_mentee`,
          params: filteredQuery,
        };
      },
      providesTags: ["Mentees"],
    }),

    getMyReqMentees: builder.query({
      query: (query) => {
        const filteredQuery = Object.fromEntries(
          Object.entries(query).filter(
            ([key, value]) =>
              !(key === "search" && value.trim().length === 0) &&
              !(key === "status" && value === "all")
          )
        );
        return {
          url: `/program_request/follow-request`,
          params: filteredQuery,
        };
      },
      providesTags: ["Mentees"],
    }),

    getMenteeInfo: builder.query({
      query: (id) => `/mentee/${id}`,
      transformResponse: (response) => response.mentor || response,
      providesTags: (result, error, id) => [{ type: "Mentees", id }],
    }),

    getMenteeProgramActivity: builder.query({
      query: (id) => `/programs_activity_list/${id}`,
      transformResponse: (response) => response.mentor || response,
      providesTags: (result, error, id) => [
        { type: "Mentees", id: `activity-${id}` },
      ],
    }),

    // Follow related endpoints
    getFollowList: builder.query({
      query: (id) => `/post/user-status/${id}`,
      providesTags: (result, error, id) => [{ type: "FollowStatus", id }],
    }),

    userFollow: builder.mutation({
      query: (data) => ({
        url: `/program_request/follow-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FollowStatus", "Profile"],
    }),

    userUnFollow: builder.mutation({
      query: (data) => ({
        url: `/post/unfollow`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FollowStatus", "Profile"],
    }),

    menteeFollowReq: builder.mutation({
      query: (data) => ({
        url: `/program_request/follow-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Mentees", "FollowStatus"],
    }),

    mentorAcceptReq: builder.mutation({
      query: (data) => ({
        url: `/program_request/follow-request`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Mentors", "Mentees"],
    }),

    menteeUnFollowReq: builder.mutation({
      query: (data) => ({
        url: `/post/unfollow`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Mentees", "FollowStatus"],
    }),

    menteeCancelReq: builder.mutation({
      query: (data) => ({
        url: `/rating/request-mentor`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Mentees"],
    }),

    // Request view
    getRequestView: builder.query({
      query: (id) => `/request/${id}/`,
      providesTags: (result, error, id) => [
        { type: "Mentors", id: `request-${id}` },
      ],
    }),

    // Profile notes
    getProfileNotesList: builder.query({
      query: (id) => ({
        url: `/profile/user-notes/`,
        params: { user: id },
      }),
      providesTags: (result, error, id) => [{ type: "Notes", id }],
    }),

    addUpdateProfileNotes: builder.mutation({
      query: (data) => ({
        url: `/profile/user-notes/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { user }) => [
        { type: "Notes", id: user },
      ],
    }),
  }),
});

export const {
  useUpdateUserPasswordMutation,
  useCheckEmailMutation, // Mentor hooks
  useGetMyMentorsQuery,
  useGetMyTopMentorsQuery,
  useGetMyReqMentorsQuery,
  useGetMyTopProgramsQuery,
  useGetMentorInfoQuery,
  useGetMentorProgramActivityQuery,
  useGetJoinRequestCountsQuery,

  // Profile hooks
  useGetProfileInfoQuery,

  // Mentee hooks
  useGetMyMenteesQuery,
  useGetMyReqMenteesQuery,
  useGetMenteeInfoQuery,
  useGetMenteeProgramActivityQuery,

  // Follow hooks
  useGetFollowListQuery,
  useUserFollowMutation,
  useUserUnFollowMutation,
  useMenteeFollowReqMutation,
  useMentorAcceptReqMutation,
  useMenteeUnFollowReqMutation,
  useMenteeCancelReqMutation,

  // Request view hooks
  useGetRequestViewQuery,

  // Profile notes hooks
  useGetProfileNotesListQuery,
  useAddUpdateProfileNotesMutation,
} = userApi;
