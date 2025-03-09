import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";

const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/`;

// const baseUrl = "https://bpz49qbw-8000.inc1.devtunnels.ms/api/"
const loginApiSlice = createApi({
  reducerPath: "loginApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl, // Use your base URL here
    prepareHeaders: (headers) => {
      //   const token = localStorage.getItem("access_token");
      //   if (token) {
      //     headers.set("Authorization", `Bearer ${token}`);
      //   }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // User Account Creation
    userAccountCreate: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.status === 201) {
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          const decoded = jwtDecode(response.access);
          return { status: response.status, userResponse: decoded };
        }
        return response;
      },
    }),

    // User Login
    userAccountLogin: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: data,
      }),
      // transformResponse: (response) => {
      //   if (response.status === 200) {
      //     // localStorage.setItem('access_token', response.access);
      //     // localStorage.setItem('refresh_token', response.refresh);
      //     // return jwtDecode(response.access);

      //   }
      // //   if (response.status === 401) {
      // //     return response
      // //   //   { error: 'Invalid Credentials' };
      // //   }
      //   return response;
      // },
    }),

    // Refresh User Token
    userAccessToken: builder.mutation({
      query: (data) => ({
        url: "/token/",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.status === 200) {
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          return jwtDecode(response.access);
        }
        return response;
      },
    }),

    // Update User Role
    updateUserRole: builder.mutation({
      query: (data) => ({
        url: "update-role",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.status === 200) {
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          return jwtDecode(response.access);
        }
        return response;
      },
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "trigger-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Validate OTP
    validateOTP: builder.mutation({
      query: (data) => ({
        url: "validate-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Update Password
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "update-pwd",
        method: "POST",
        body: data,
      }),
    }),

    // Update Questions
    updateQuestions: builder.mutation({
      query: (data) => ({
        url: "user_info_update",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.status === 200) {
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          return jwtDecode(response.access);
        }
        return response;
      },
    }),

    // Update Mentee Questions
    updateMenteeQuestions: builder.mutation({
      query: (data) => ({
        url: "mentee_info_update",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response.status === 201) {
          const decoded = jwtDecode(response.access);
          if (decoded?.userinfo?.approve_status === "new") {
            return {};
          }
          localStorage.setItem("access_token", response.access);
          localStorage.setItem("refresh_token", response.refresh);
          return decoded;
        }
        return response;
      },
    }),

    // Generate New Token
    updateToken: builder.mutation({
      query: () => ({
        url: "generate_new_token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useUserAccountCreateMutation,
  useUserAccountLoginMutation,
  useUserAccessTokenMutation,
  useUpdateUserRoleMutation,
  useForgotPasswordMutation,
  useValidateOTPMutation,
  useUpdatePasswordMutation,
  useUpdateQuestionsMutation,
  useUpdateMenteeQuestionsMutation,
  useUpdateTokenMutation,
} = loginApiSlice;

export default loginApiSlice;
