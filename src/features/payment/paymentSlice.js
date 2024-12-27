import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery,
  endpoints: (builder) => ({
    paymentProcessing: builder.query({
      query: (programId) => ({
        url: `/api/payments/create-payment-intent/${programId}`,
        method: 'POST',
      }),
    }),
  }),
});

export const { usePaymentProcessingQuery } = paymentApi;
