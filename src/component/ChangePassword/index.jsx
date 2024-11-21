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
                     
                      <h4 className="mt-1 pl-3 pb-1 text-xl font-semibold logoColor">
                        MyLogo
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
