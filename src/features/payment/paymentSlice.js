import { createSlice } from '@reduxjs/toolkit';
import { postPayments } from '../../services/payment';

const initialState = {
  paymentData: {},
  loading: false,
  status: '',
  error: '',
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postPayments.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(postPayments.fulfilled, (state, action) => {
        return {
          status: '',
          loading: false,
          paymentData: action.payload,
          error: '',
        };
      })
      .addCase(postPayments.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      });
  },
});

export default paymentSlice.reducer;
