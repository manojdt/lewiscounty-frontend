import {
  createSlice
} from "@reduxjs/toolkit";
import {
  userAccountCreate,
  userAccountLogin,
  updateUserInfo,
  resetUserInfo,
  userAccessToken,
  updateInfo,
  updateUserRole,
  forgotPassword,
  updatePassword,
  validateOTP,
  updateQuestions,
  updateMenteeQuestions
} from "../../services/loginInfo";
import {
  userStatus
} from '../../utils/constant'


const initialState = {
  data: {},
  loading: false,
  status: '',
  error: "",
  otp: ""
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(userAccountCreate.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(userAccountCreate.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          status: userStatus.create,
          loading: false
        };
      })
      .addCase(userAccountCreate.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      })
    builder
      .addCase(userAccountLogin.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(userAccountLogin.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          status: userStatus.login,
          loading: false
        };
      })
      .addCase(userAccountLogin.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      })
    builder.addCase(updateUserInfo, (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    })
    builder.addCase(resetUserInfo, (state, action) => initialState)
    builder.addCase(updateInfo.fulfilled, (state, action) => {
      // console.log('action', action, state)
      return {
        ...state,
        loading: false,
        data: action.payload,
        status: '',
        error: ''
      }
    })
    builder
      .addCase(userAccessToken.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(userAccessToken.fulfilled, (state, action) => {
        return {
          ...state,
          status: userStatus.login,
          loading: false
        };
      })
      .addCase(userAccessToken.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      })
    builder
      .addCase(updateUserRole.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        console.log('update role action', action)
        return {
          ...state,
          loading: false,
          status: userStatus.role,
          data: action.payload
        };
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      })

    builder
      .addCase(forgotPassword.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        console.log('trigger otp', action)
        return {
          ...state,
          loading: false,
          status : userStatus.otp
        };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      })

      builder
      .addCase(validateOTP.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(validateOTP.fulfilled, (state, action) => {
        console.log('validate otp', action)
        return {
          ...state,
          loading: false,
          status : userStatus.otpSuccess
        };
      })
      .addCase(validateOTP.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,
        };
      })

      builder
      .addCase(updatePassword.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        console.log('change password', action)
        return {
          ...state,
          loading: false,
          status : userStatus.changePassword
        };
      })
      .addCase(updatePassword.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,

        };
      })

      builder
      .addCase(updateQuestions.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(updateQuestions.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          data: action.payload,
          status : userStatus.questions
        };
      })
      .addCase(updateQuestions.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,

        };
      })

      builder
      .addCase(updateMenteeQuestions.pending, (state) => {
        return {
          ...state,
          loading: true
        };
      })
      .addCase(updateMenteeQuestions.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          data: action.payload,
          status : userStatus.questions
        };
      })
      .addCase(updateMenteeQuestions.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message,

        };
      })
  },
});


export default userSlice.reducer;