import { rtkQueryApiServices, rtkQueryServiceTags } from '../../services/api';

export const questionsApi = rtkQueryApiServices.injectEndpoints({
    endpoints: (builder) => ({
        getMentorQuestions: builder.query({  // Changed from mutation to query
            query: () => "user_info_update",  // Simplified query format for GET request
          }),
    }),
});
export const {
   useGetMentorQuestionsQuery
} = questionsApi;