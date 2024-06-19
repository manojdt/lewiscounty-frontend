import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { emailPattern } from "../../utils/InputRules";
import LogoSlide from "../LogoSlide";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../services/loginInfo";
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
    console.log(data);
  };

  useEffect(() => {

    const forgotEmail = getValues('email');

    console.log('forgotEmail', forgotEmail)
    console.log('userInfo.otp', userInfo.status)
    console.log('userStatus.otp', userStatus.otp)


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
              <div className="px-4 md:px-0 lg:w-6/12 text-black flex justify-center items-center">
                <div className="w-9/12">
                  <div className="text-center">
                    <div className="flex justify-center items-center">
                      <svg
                        width="59"
                        height="59"
                        viewBox="0 0 59 59"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M29.0588 58.5365C45.1076 58.5365 58.1177 45.4327 58.1177 29.2682C58.1177 13.1039 45.1076 0 29.0588 0C13.0101 0 0 13.1039 0 29.2682C0 45.4327 13.0101 58.5365 29.0588 58.5365ZM38.1242 13.6344C38.5654 12.0557 37.0444 11.1221 35.6552 12.119L16.2629 26.0335C14.7564 27.1145 14.9934 29.2682 16.6189 29.2682H21.7254V29.2284H31.6778L23.5685 32.1103L19.9935 44.9022C19.5523 46.4809 21.0732 47.4144 22.4625 46.4176L41.8548 32.5031C43.3613 31.4221 43.1242 29.2682 41.4988 29.2682H33.7549L38.1242 13.6344Z"
                          fill="#00AEBD"
                          style={{
                            fill: "#00AEBD;fill:color(display-p3 0.0000 0.6824 0.7412);fill-opacity:1",
                          }}
                        />
                      </svg>
                      <h4 className="mt-1 pl-3 pb-1 text-xl font-semibold logoColor">
                        Logo
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
