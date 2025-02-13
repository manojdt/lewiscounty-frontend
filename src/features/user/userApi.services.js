
import { rtkQueryApiServices } from '../../services/api';

export const userApi = rtkQueryApiServices.injectEndpoints({
    endpoints: (builder) => ({
         updateUserPassword: builder.mutation({
            query: (passwordData) => ({
                url: 'update-profile-password',
                method: 'PUT',
                body: passwordData,
            }),
        }),
        checkEmail: builder.mutation({
            query: (email) => ({
                url: `profile/email-exist/${email}`,
                method: 'GET',
            }),
        }),

    }),

});

export const {
    useUpdateUserPasswordMutation,
    useCheckEmailMutation
} = userApi;
