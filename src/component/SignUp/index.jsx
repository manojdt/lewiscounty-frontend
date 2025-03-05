import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  resetUserInfo,
  updateInfo,
  updateUserInfo,
} from "../../services/loginInfo";
import { ReactComponent as EyeCloseIcon } from "../../assets/icons/eyeClose.svg";
import { ReactComponent as EyeOpenIcon } from "../../assets/icons/eyeOpen.svg";
import SuccessIcon from "../../assets/images/Success_tic1x.png";
import FailedIcon from "../../assets/images/cancel3x.png";
import modal_tick_icon from "../../assets/icons/modal_tick_icon.svg";
import SocialMediaLogin from "../../shared/SocialMedia";
import { SignupFields, PasswordRules } from "../../utils/loginFields";
import { PasswordRulesSet, userStatus } from "../../utils/constant";
import { useUserAccountCreateMutation } from "../../features/login/loginapi.services";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { MuiCustomModal } from "../../shared/Modal/MuiCustomModal";
import { Avatar } from "@mui/material";

export const Signup = () => {
  const [userAccountCreate, { data }] = useUserAccountCreateMutation();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [showBackdrop, setShowBackdrop] = React.useState(false);

  const [verifyPasswordRule, setVerifyPasswordRule] = useState({
    [PasswordRulesSet.character]: false,
    [PasswordRulesSet.upperlowercase]: false,
    [PasswordRulesSet.number]: false,
    [PasswordRulesSet.email]: false,
    [PasswordRulesSet.common]: false,
  });
  const userData = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm();

  const handleClosePopup = () => {
    setShowBackdrop(false);
    navigate("/login"); // Redirect to login page
  };
  const onSubmit = async (data) => {
    const { first_name, last_name, regemail, regpassword } = data;
    if (
      first_name !== "" &&
      last_name !== "" &&
      regemail !== "" &&
      regpassword !== ""
    ) {
      if (/\s/.test(regpassword)) {
        setError("regpassword", {
          type: "manual",
          message: "Password must not contain spaces",
        });
        return; // Stop further execution if the password contains spaces
      }
      const updatedData = { ...data, email: regemail.toLowerCase(), password: regpassword };
      if (
        !verifyPasswordRule[PasswordRulesSet.character] ||
        !verifyPasswordRule[PasswordRulesSet.upperlowercase] ||
        !verifyPasswordRule[PasswordRulesSet.number] ||
        !verifyPasswordRule[PasswordRulesSet.email] ||
        !verifyPasswordRule[PasswordRulesSet.common]
      ) {
        setError("regpassword", {
          type: "manual",
          message: "All Conditions must be satisfied",
        });
      } else {
        try {
          const createRes = await userAccountCreate(updatedData).unwrap();
          const decodedRes = jwtDecode(createRes.access);
          console.log("decodedRes", decodedRes);
          if (decodedRes?.is_verified) {
            if (userData.data.role === "fresher") navigate("/login-type");
            else if (userData.data.is_registered) navigate("/dashboard");
            else navigate("/mentor-application-form");
            dispatch(updateInfo());
          } else {
            setShowBackdrop(true);
          }
        } catch (error) {
          toast.error(error?.data?.error);
        }
      }
    }
  };

  const eightCharacter = (str) => /^.{8,}$/.test(str);
  const upperLowerCase = (str) => /^(?=.*[a-z])(?=.*[A-Z])\S+$/.test(str);
  const letterSymbol = (str) =>
    /[\d!@#$%^&*()_+={}\[\]:;<>,.?\\\/\-]/.test(str);

  const handleField = (field, value) => {
    const email = `${getValues("email")}`;
    let emailExist = email !== "" && value !== "";
    if (email !== "") {
      const emailValidation = new RegExp(email);
      emailExist = !emailValidation.test(value);
    }
    const eightCharacterExist = eightCharacter(value);
    const upperLowerCaseExist = upperLowerCase(value);
    const letterSymbolExist = letterSymbol(value);

    const passRule = {
      [PasswordRulesSet.character]: eightCharacterExist,
      [PasswordRulesSet.upperlowercase]: upperLowerCaseExist,
      [PasswordRulesSet.number]: letterSymbolExist,
      [PasswordRulesSet.email]: emailExist,
      [PasswordRulesSet.common]:
        eightCharacterExist &&
        upperLowerCaseExist &&
        letterSymbolExist &&
        emailExist,
    };
    setVerifyPasswordRule(passRule);
  };

  useEffect(() => {
    dispatch(resetUserInfo());
  }, []);

  // const handleRedirect = () => {
  //   dispatch(updateInfo());
  //   if (userData.data.role === "fresher") navigate("/login-type");
  //   else if (userData.data.is_registered) navigate("/dashboard");
  //   else navigate("/questions");
  // };

  useEffect(() => {
    if (
      !userData.loading &&
      Object.keys(userData.data).length &&
      userData.status === userStatus.create
    ) {
      setTimeout(() => {
        navigate("/login-type");
      }, 2000);
    }

    // if (!userData.loading && userData.status === userStatus.login) {
    //   setTimeout(() => {
    //     handleRedirect();
    //   }, 2000);
    // }

    if (!userData.loading && userData.status === userStatus.pending) {
      setTimeout(() => {
        dispatch(updateUserInfo({ status: "" }));
      }, 3000);
    }
  }, [userData]);

  return (
    <React.Fragment>
      <MuiCustomModal
        open={showBackdrop}
        PaperProps={{
          sx: {
            minHeight: 300,
          },
        }}
        maxWidth="sm"
        dialogTitle={"Message"}
        onClose={handleClosePopup}
        handleClose={handleClosePopup}
      >
        <div className="flex justify-center items-center flex-col gap-y-4">
          <Avatar src={modal_tick_icon} />
          <div className="flex justify-center items-center flex-col gap-2">
            <p className="text-[22px] text-font-primary-main font-bold">
              Thank You!
            </p>
            <p className="text-[16px] text-font-primary-main font-semibold text-center mt-8">
              Please verify your email address. A verification link has been{" "}
              <br /> sent to your registered email address.
            </p>
          </div>
        </div>
      </MuiCustomModal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={userData.loading || userData.status === userStatus.create}
      >
        {userData.status === userStatus.create ? (
          <div className="w-2/6 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
            <img src={SuccessIcon} alt="VerifyIcon" />
            <span style={{ color: "#232323", fontWeight: 600 }}>
              Account Created Successfully!
            </span>
          </div>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </Backdrop>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          userData.loading ||
          userData.status === userStatus.login ||
          userData.status === userStatus.pending
        }
      >
        {userData.status === userStatus.login ||
        userData.status === userStatus.pending ? (
          <div className="popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
            <img
              src={
                userData.status === userStatus.pending
                  ? FailedIcon
                  : SuccessIcon
              }
              alt="VerifyIcon"
            />
            <span style={{ color: "#232323", fontWeight: 600 }}>
              {userData.status === userStatus.pending
                ? "Waiting for Admin Approval"
                : " Login  Successful!"}
            </span>
          </div>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </Backdrop>

      <div className="w-full flex items-center justify-center">
        <div className="w-4/5 max-w-md">
          <h4 className="pb-1 text-3xl font-semibold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">
            MMA
          </h4>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Let's Get Started with Creating Your Account!
          </h2>
          <p className="text-[12px]">
            Already have an account?
            <span
              className="cursor-pointer pl-1"
              onClick={() => navigate("/login")}
              style={{
                color: "rgba(29, 91, 191, 1)",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              Log in
            </span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <SocialMediaLogin setVerificationPopup={setShowBackdrop} />

            <div
              className="mb-8 mt-8 flex items-center before:mt-0.5 before:flex-1 before:border-t
                     before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t
                      after:border-neutral-300 dark:before:border-neutral-500
                       dark:after:border-neutral-500"
            >
              <p
                className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200"
                style={{
                  color: "#232323",
                }}
              >
                OR
              </p>
            </div>
            {userData.error !== "" ? (
              <div className="pb-7">
                <p className="error" role="alert">
                  {userData.error}
                </p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {SignupFields.map((field, index) => (
                <>
                  <div
                    className={`relative mb-6 ${
                      field.size ? "width-49 max-lg:w-full" : "w-full"
                    }`}
                    key={index}
                  >
                    <label className="block tracking-wide text-gray-700 mb-2 text-[14px]">
                      {field.label}{" "}
                      <span style={{ color: "red" }}>
                        {field?.inputRules?.required ? "*" : ""}
                      </span>
                    </label>
                    <input
                      type={
                        field.fieldtype === "password"
                          ? passwordVisibility
                            ? "text"
                            : field.fieldtype
                          : field.fieldtype
                      }
                      autoComplete="off"
                      className={`w-full rounded px-3 py-[0.32rem] text-[14px] leading-[2.15] h-[60px] ${
                        errors[field.name]
                          ? "focus:border-teal focus:outline-none focus:ring-0"
                          : ""
                      }`}
                      placeholder={field.placeholder}
                      style={{
                        color: "#232323",
                        border: `1px solid ${
                          errors[field.name] ? "rgb(239 68 68)" : "#3E3E3E"
                        }`,
                      }}
                      {...register(field.name, field.inputRules)}
                      {...(field.fieldtype === "password"
                        ? {
                            onKeyUp: (e) =>
                              handleField(field.fieldtype, e.target.value),
                          }
                        : {})}
                      // onBlur={(e) => handleField(field.fieldtype, e.target.value)}
                      aria-invalid={errors[field.name] ? "true" : "false"}
                      tabIndex={index + 1}
                      name={
                        field?.name
                        //  === "email"?"regemail":field?.name === "password"?"regpassword":field?.name
                      }
                    />
                    {field.fieldtype === "password" && (
                      <button
                        type="button"
                        className="absolute top-9 end-0 p-3.5 rounded-e-md"
                        onClick={() =>
                          setPasswordVisibility(!passwordVisibility)
                        }
                      >
                        {passwordVisibility ? (
                          <EyeOpenIcon />
                        ) : (
                          <EyeCloseIcon />
                        )}
                      </button>
                    )}

                    {errors[field.name] && (
                      <p className="error" role="alert">
                        {errors[field.name].message}
                      </p>
                    )}
                  </div>
                  {field.fieldtype === "password" &&
                    getValues("regpassword") !== undefined &&
                    getValues("regpassword") !== "" && (
                      <div className="pb-3 leading-6">
                        <p className="text-[14px] pb-1">
                          Create a password That:
                        </p>
                        <ul className="">
                          {PasswordRules.map((rule, index) => {
                            let icon = "\\2022";
                            let pd = 3;
                            let textColor = "#000";
                            if (verifyPasswordRule[rule.key]) {
                              icon = "\\2714\\0020";
                              pd = 2;
                              textColor = "#00AEBD";
                            }
                            return (
                              <li
                                key={index}
                                className={`text-[12px] list-none before:content-['${icon}'] before:pr-${pd} before:text-[10px]`}
                                style={{ color: textColor }}
                              >
                                {rule.name}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                </>
              ))}
            </div>
            <div className="mb-6 flex items-center justify-between">
              <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
                <input
                  className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] text-[12px]"
                  type="checkbox"
                  {...register("user_agree_terms", { required: true })}
                  tabIndex={SignupFields.length + 1}
                />
                <label className="inline-block ps-[0.15rem] hover:cursor-pointer defaultTextColor text-[14px]">
                  I agree to the
                  <span
                    className="cursor-pointer px-1"
                    onClick={() => navigate("/login")}
                    style={{
                      color: "rgba(29, 91, 191, 1)",
                      textDecoration: "underline",
                      fontWeight: 600,
                    }}
                  >
                    Terms & Conditions
                  </span>
                  and
                  <span
                    className="cursor-pointer pl-1"
                    onClick={() => navigate("/login")}
                    style={{
                      color: "rgba(29, 91, 191, 1)",
                      textDecoration: "underline",
                      fontWeight: 600,
                    }}
                  >
                    Privacy Policy
                  </span>
                </label>
              </div>
            </div>

            {errors["user_agree_terms"] && (
              <p className="error mb-4" role="alert">
                Please agree terms & Conditions
              </p>
            )}

            <div className="flex create-button justify-center text-center lg:text-left">
              <button
                type="submit"
                className="inline-block rounded px-7 pb-3 pt-3 text-sm font-medium text-white w-2/5"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                style={{
                  background: "linear-gradient(to right, #00AEBD, #1D5BBF)",
                }}
                tabIndex={SignupFields.length + 2}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};
