import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import LogoSlide from "../LogoSlide";
import { ReactComponent as EyeCloseIcon } from "../../assets/icons/eyeClose.svg";
import { ReactComponent as EyeOpenIcon } from "../../assets/icons/eyeOpen.svg";
import { useDispatch, useSelector } from "react-redux";
import { resetUserInfo, updatePassword } from "../../services/loginInfo";
import { userStatus } from "../../utils/constant";

export const ChangePassword = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get("email");
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.userInfo);
  const [passwordVisibility, setPasswordVisibility] = useState({
    new_password: false,
    confirm_password: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    console.log('errors', errors)
    const { new_password, confirm_password } = data
    if (new_password !== '' && confirm_password !== '' && new_password !== confirm_password) {
      setError("confirm_password", {
        type: "custom",
        message: "New password and Confirm password should be same",
      })
    } else if (userEmail !== '' && new_password === confirm_password) {
      dispatch(updatePassword({ email: userEmail, new_password: new_password }))
    }
  };

  useEffect(() => {
    dispatch(resetUserInfo())
  }, [])

  useEffect(() => {
    if (!userInfo.loading && userInfo.status === userStatus.changePassword) {
      navigate('/')
    }
  }, [userInfo])


  console.log('mmm', errors)

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
              <div className="change-password px-4 md:px-0 lg:w-6/12 text-black flex justify-center items-center">
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
                      Change Password
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
                        New Password
                      </label>
                      <input
                        type={`${passwordVisibility.new_password ? "text" : "password"
                          }`}
                        className="w-full rounded px-3 py-[0.32rem] leading-[2.15] text-[14px] h-[60px]"
                        placeholder="Enter new password"
                        style={{
                          color: "#232323",
                          border: "1px solid #3E3E3E",
                        }}
                        {...register("new_password", {
                          required: true,
                        })}
                        aria-invalid={errors.new_password ? "true" : "false"}
                      />

                      <button
                        type="button"
                        className="absolute top-7 end-0 p-3.5 rounded-e-md"
                        onClick={() =>
                          setPasswordVisibility({
                            ...passwordVisibility,
                            new_password: !passwordVisibility.new_password,
                          })
                        }
                      >
                        {passwordVisibility.new_password ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )}
                      </button>
                      {errors.new_password?.type === "required" && (
                        <p className="error" role="alert">
                          New Password is required
                        </p>
                      )}
                    </div>

                    <div className="relative mb-6">
                      <label className="block tracking-wide text-gray-700 text-xs mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={`${passwordVisibility.confirm_password
                          ? "text"
                          : "password"
                          }`}
                        className="w-full rounded px-3 py-[0.32rem] leading-[2.15] text-[14px] h-[60px]"
                        placeholder="Enter confirm password"
                        style={{
                          color: "#232323",
                          border: "1px solid #3E3E3E",
                        }}
                        {...register("confirm_password", {
                          required: true,
                        })}
                        aria-invalid={
                          errors.confirm_password ? "true" : "false"
                        }
                      />

                      <button
                        type="button"
                        className="absolute top-7 end-0 p-3.5 rounded-e-md"
                        onClick={() =>
                          setPasswordVisibility({
                            ...passwordVisibility,
                            confirm_password:
                              !passwordVisibility.confirm_password,
                          })
                        }
                      >
                        {passwordVisibility.confirm_password ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )}
                      </button>
                      {errors.confirm_password?.type === "required" || errors.confirm_password?.type === "custom" && (
                        <p className="error" role="alert">
                          {errors.confirm_password?.type === "custom" ? errors.confirm_password?.message : "Confirm Password is required"}
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
                        Save New Password
                      </button>
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
