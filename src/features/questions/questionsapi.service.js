import { jwtDecode } from "jwt-decode";
import { rtkQueryApiServices, rtkQueryServiceTags } from "../../services/api";

const { USER } = rtkQueryServiceTags;
// Helper function to handle JWT tokens
const processJwtResponse = (response) => {
  if (response?.access) {
    const decoded = jwtDecode(response.access);
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);
    return decoded;
  }
  return response;
};
import { jwtDecode } from "jwt-decode";
import { rtkQueryApiServices, rtkQueryServiceTags } from "../../services/api";

const { USER } = rtkQueryServiceTags;
// Helper function to handle JWT tokens
const processJwtResponse = (response) => {
  if (response?.access) {
    const decoded = jwtDecode(response.access);
    localStorage.setItem("access_token", response.access);
    localStorage.setItem("refresh_token", response.refresh);
    return decoded;
  }
  return response;
};

export const questionsApi = rtkQueryApiServices.injectEndpoints({
  endpoints: (builder) => ({
    getMentorQuestions: builder.query({
      // Changed from mutation to query
      query: () => "user_info_update", // Simplified query format for GET request
    }),
    updateUserInfo: builder.mutation({
      query: (data) => ({
        url: "user_info_update",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => processJwtResponse(response),
      invalidatesTags: [USER],
    }),

    // Convert updateQuestionsPost
    updateUserInfoPost: builder.mutation({
      query: (data) => ({
        url: "user_info_update",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => processJwtResponse(response),
      invalidatesTags: [USER],
    }),

    // Convert updateMenteeQuestions
    updateMenteeInfo: builder.mutation({
      query: (data) => ({
        url: "mentee_info_update",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response?.access) {
          const decoded = jwtDecode(response.access);
          // Only store tokens if not a new user
          if (decoded?.userinfo?.approve_status !== "new") {
            localStorage.setItem("access_token", response.access);
            localStorage.setItem("refresh_token", response.refresh);
            return decoded;
          }
          return {};
        }
        return response;
      },
      invalidatesTags: ["Mentee"],
    }),

    // Convert updateMenteeDocument
    updateMenteeDocuments: builder.mutation({
      query: (data) => ({
        url: "user/documents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Documents"],
    }),

    getLanguageList: builder.query({
      query: (data) => ({
        url: "profile/languages",
        method: "GET",
        body: data,
      }),
    }),

    ProgramAddressDetails: builder.mutation({
      query: (params) => ({ url: `locations`, params }),
      providesTags: ["Locations"],
    }),
  }),
});
export const {
  useProgramAddressDetailsMutation,
  useGetMentorQuestionsQuery,
  useGetLanguageListQuery,
  useUpdateUserInfoMutation,
  useUpdateUserInfoPostMutation,
  useUpdateMenteeInfoMutation,
  useUpdateMenteeDocumentsMutation,
} = questionsApi;

