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
    updateMenteeInfo: builder.mutation({
      query: (data) => ({
        url: "mentee_registration_form",
        method: "POST",
        body: data,
      }),
    }),

  }),
});
export const {
  useUpdateMenteeInfoMutation,
} = questionsApi;
