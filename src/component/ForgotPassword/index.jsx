import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { emailPattern } from "../../utils/InputRules";
import LogoSlide from "../LogoSlide";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetUserInfo } from "../../services/loginInfo";
import { userStatus } from "../../utils/constant";


export const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.userInfo)
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  const onSubmit = (data) => {
    if (data.email !== '') {
      dispatch(forgotPassword({ email: data.email }))
    }
  };

  useEffect(() => {
    dispatch(resetUserInfo())
  }, [])

  useEffect(() => {
    const forgotEmail = getValues('email');
    if (!userInfo.loading && userInfo.status === userStatus.otp && forgotEmail !== '') {
      localStorage.setItem('forgotEmail', forgotEmail);
      navigate('/verify-otp?email=' + forgotEmail)
    }
  }, [userInfo])


  return (
    <div className="h-full">
      <div className="flex flex-wrap h-full">
        <div className="w-full">
          <div className="block bg-white shadow-lg h-full">
            <div className="g-0 lg:flex lg:flex-row h-full">
              <LogoSlide />
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={userInfo.loading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <div className="forgot-password-logo px-4 md:px-0 lg:w-6/12 text-black flex justify-center items-center">
                <div className="w-9/12">
                  <div className="text-center">
                    <div className="flex justify-center items-center">
                     
                      <h4 className="mt-1 pl-3 pb-1 text-xl font-semibold logoColor">
                        MyLogo
                      </h4>
                    </div>

                    <h4 className="mb-6 mt-6 pb-1 text-xl font-semibold defaultTextColor">
                      Forgot Your Password
                    </h4>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                  {
                      userInfo.error !== '' ? <div className="pb-7">
                        <p className="error" role="alert">
                          {userInfo.error}
                        </p></div> : null
                    }
                    <div className="relative mb-6">
                      <label className="block tracking-wide text-gray-700 text-xs mb-2">
                        Email
                      </label>
                      <input
                        type="text"
                        className="w-full rounded px-3 py-[0.32rem] leading-[2.15] text-[14px] h-[60px]"
                        placeholder="Enter your email"
                        style={{
                          color: "#232323",
                          border: "1px solid #3E3E3E",
                        }}
                        {...register("email", {
                          required: true,
                          pattern: emailPattern,
                        })}
                        aria-invalid={errors.useremail ? "true" : "false"}
                      />
                      {errors.email?.type === "required" && (
                        <p className="error" role="alert">
                          Email is required
                        </p>
                      )}
                    </div>


                    <div className="text-center lg:text-left">
                      <button
                        type="submit"
                        className="inline-block w-full rounded px-7 pb-3 pt-3 text-sm font-medium text-white"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        style={{
                          background:
                            "linear-gradient(to right, #00AEBD, #1D5BBF)",
                        }}
                      >
                        Request OTP
                      </button>

                      <p
                        className="mb-0 mt-2 pt-1 text-sm font-semibold text-center"
                        style={{ color: "#232323" }}
                      >
                        Already have an account?
                        <button
                          className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 pl-1"
                          style={{ color: "#1D5BBF" }}
                          onClick={() => navigate("/")}
                        >
                          Login
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
