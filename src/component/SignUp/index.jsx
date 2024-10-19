import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import LogoSlide from "../LogoSlide";

import { userAccountCreate, resetUserInfo, updateInfo, updateUserInfo } from '../../services/loginInfo'
import { ReactComponent as EyeCloseIcon } from "../../assets/icons/eyeClose.svg";
import { ReactComponent as EyeOpenIcon } from "../../assets/icons/eyeOpen.svg";
import SuccessIcon from "../../assets/images/Success_tic1x.png"
import FailedIcon from "../../assets/images/cancel3x.png"

import SocialMediaLogin from "../../shared/SocialMedia";
import { SignupFields, PasswordRules } from "../../utils/loginFields";
import { PasswordRulesSet, userStatus } from "../../utils/constant";


export const Signup = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [verifyPasswordRule, setVerifyPasswordRule] = useState({
    [PasswordRulesSet.character]: false,
    [PasswordRulesSet.upperlowercase]: false,
    [PasswordRulesSet.number]: false,
    [PasswordRulesSet.email]: false,
    [PasswordRulesSet.common]: false,
  })
  const userData = useSelector(state => state.userInfo)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError
  } = useForm();

  const onSubmit = (data) => {
    const { first_name, last_name, email, password } = data;
    if (first_name !== "" && last_name !== '' && email !== "" && password !== "") {
      if (!verifyPasswordRule[PasswordRulesSet.character] || !verifyPasswordRule[PasswordRulesSet.upperlowercase] ||
        !verifyPasswordRule[PasswordRulesSet.number] || !verifyPasswordRule[PasswordRulesSet.email] ||
        !verifyPasswordRule[PasswordRulesSet.common]) {
          setError("password", {
            type: "manual",
            message: "All Conditions must be satisfied",
          })
      } else {
        dispatch(userAccountCreate(data))
      }
    }
  };

  const eightCharacter = (str) => /^.{8,}$/.test(str)
  const upperLowerCase = (str) => /^(?=.*[a-z])(?=.*[A-Z])\S+$/.test(str)
  const letterSymbol = (str) => /[\d!@#$%^&*()_+={}\[\]:;<>,.?\\\/\-]/.test(str)

  const handleField = (field, value) => {
    const email = `${getValues('email')}`
    let emailExist = email !== '' && value !== ''
    if (email !== '') {
      const emailValidation = new RegExp(email);
      emailExist = !emailValidation.test(value)
    }
    const eightCharacterExist = eightCharacter(value)
    const upperLowerCaseExist = upperLowerCase(value)
    const letterSymbolExist = letterSymbol(value)

    const passRule = {
      [PasswordRulesSet.character]: eightCharacterExist,
      [PasswordRulesSet.upperlowercase]: upperLowerCaseExist,
      [PasswordRulesSet.number]: letterSymbolExist,
      [PasswordRulesSet.email]: emailExist,
      [PasswordRulesSet.common]: eightCharacterExist && upperLowerCaseExist && letterSymbolExist && emailExist
    }
    setVerifyPasswordRule(passRule)
  }

  useEffect(() => {
    dispatch(resetUserInfo())
  }, [])

  const handleRedirect = () => {
    dispatch(updateInfo())
    if (userData.data.role === 'fresher') navigate("/login-type");
    else if (userData.data.is_registered) navigate("/dashboard")
    else navigate("/questions");
  }


  useEffect(() => {
    if (!userData.loading && Object.keys(userData.data).length && userData.status === userStatus.create) {
      setTimeout(() => {
        navigate("/login-type");
      }, 2000)
    }

    if (!userData.loading && userData.status === userStatus.login) {
      setTimeout(() => {
        handleRedirect()
      }, 2000)
    }

    if (!userData.loading && userData.status === userStatus.pending) {
      setTimeout(() => {
        dispatch(updateUserInfo({status: ''}))
      },3000) 
    }
  }, [userData])


  return (
    <div className="h-full">
      <div className="flex flex-wrap h-full">
        <div className="w-full">
          <div className="block bg-white shadow-lg h-full">
            <div className="g-0 lg:flex lg:flex-row h-full">
              <LogoSlide />
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={userData.loading || userData.status === userStatus.create}
              >
                {
                  userData.status === userStatus.create ?
                    <div className="w-2/6 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
                      <img src={SuccessIcon} alt="VerifyIcon" />
                      <span style={{ color: '#232323', fontWeight: 600 }}>Account Created Successfully!</span>
                    </div>
                    :
                    <CircularProgress color="inherit" />
                }

              </Backdrop>

              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={userData.loading || userData.status === userStatus.login || userData.status === userStatus.pending}

              >
                {
                  (userData.status === userStatus.login || userData.status === userStatus.pending) ?
                    <div className="popup-content w-2/6 bg-white flex flex-col gap-4 h-[330px] justify-center items-center">
                      <img src={userData.status === userStatus.pending ? FailedIcon : SuccessIcon} alt="VerifyIcon" />
                      <span style={{ color: '#232323', fontWeight: 600 }}>
                        {
                          userData.status === userStatus.pending ? 'Waiting for admin approval' : ' Login  Successful!'
                        }



                      </span>
                    </div>
                    :
                    <CircularProgress color="inherit" />
                }

              </Backdrop>
              <div className="signup-content px-4 md:px-0 lg:w-7/12 text-black">
                <div className="md:mx-4 md:p-8">
                  <div className="text-left">
                    <div className="flex items-center logo">
                      {/* <svg
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
                      </svg> */}
                      <h4 className="mt-1 pb-1 text-xl font-semibold logoColor">
                        My Logo
                      </h4>
                    </div>

                    <h4 className="mt-3 pb-1 text-xl font-semibold defaultTextColor">
                      Welcome to logo.com
                    </h4>
                    <p className="text-[12px] pb-10">Already have an account?
                      <span className="cursor-pointer pl-1" onClick={() => navigate('/login')}
                        style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', fontWeight: 600 }}>Log in</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <SocialMediaLogin view={'horizontal'} />

                    <div className="mb-8 mt-8 flex items-center before:mt-0.5 before:flex-1 before:border-t
                     before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t
                      after:border-neutral-300 dark:before:border-neutral-500
                       dark:after:border-neutral-500">
                      <p
                        className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200"
                        style={{
                          color: "#232323",
                        }}
                      >
                        OR
                      </p>
                    </div>
                    {
                      userData.error !== '' ? <div className="pb-7">
                        <p className="error" role="alert">
                          {userData.error}
                        </p></div> : null
                    }
                    <div className="flex flex-wrap gap-2">
                      {
                        SignupFields.map((field, index) =>
                          <>
                            <div className={`relative mb-6 ${field.size ? 'width-49' : 'w-full'}`} key={index}>
                              <label className="block tracking-wide text-gray-700 mb-2 text-[14px]">
                                {field.label} *
                              </label>
                              <input
                                type={field.fieldtype === 'password' ? (passwordVisibility ? 'text' : field.fieldtype) : field.fieldtype}
                                className={`w-full rounded px-3 py-[0.32rem] text-[14px] leading-[2.15] h-[60px] ${errors[field.name] ? 'focus:border-teal focus:outline-none focus:ring-0' : ''}`}
                                placeholder={field.placeholder}
                                style={{
                                  color: "#232323",
                                  border: `1px solid ${errors[field.name] ? 'rgb(239 68 68)' : '#3E3E3E'}`,
                                }}
                                {...register(field.name, field.inputRules)}
                                {...field.fieldtype === 'password' ? { onKeyUp: (e) => handleField(field.fieldtype, e.target.value) } : {}}
                                // onBlur={(e) => handleField(field.fieldtype, e.target.value)}
                                aria-invalid={errors[field.name] ? "true" : "false"}
                              />
                              {
                                field.fieldtype === 'password' &&

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
                              }

                              {errors[field.name] && (
                                <p className="error" role="alert">
                                  {errors[field.name].message}
                                </p>
                              )}
                            </div>
                            {
                              field.fieldtype === 'password' && getValues('password') !== undefined && getValues('password') !== '' &&
                              <div className="pb-3 leading-6">
                                <p className="text-[14px] pb-1">Create a password That:</p>
                                <ul className="">
                                  {
                                    PasswordRules.map((rule, index) => {
                                      let icon = '\\2022'
                                      let pd = 3
                                      let textColor = '#000'
                                      if (verifyPasswordRule[rule.key]) {
                                        icon = '\\2714\\0020'
                                        pd = 2
                                        textColor = '#00AEBD'
                                      }

                                      return (
                                        <li key={index} className={`text-[12px] list-none before:content-['${icon}'] before:pr-${pd} before:text-[10px]`}
                                          style={{ color: textColor }}>{rule.name}</li>)
                                    })
                                  }
                                </ul>
                              </div>
                            }
                          </>
                        )
                      }
                    </div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
                        <input
                          className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] text-[12px]"
                          type="checkbox"
                          {
                          ...register("user_agree_terms", { required: true })
                          }
                        />
                        <label className="inline-block ps-[0.15rem] hover:cursor-pointer defaultTextColor text-[14px]">
                          I agree to the

                          <span className="cursor-pointer px-1" onClick={() => navigate('/login')}
                            style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', fontWeight: 600 }}>Terms & Service</span>

                          and
                          <span className="cursor-pointer pl-1" onClick={() => navigate('/login')}
                            style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</span>

                        </label>
                      </div>
                      {errors['user_agree_terms'] && (
                        <p className="error" role="alert">
                          Please agree terms
                        </p>
                      )}
                    </div>


                    <div className="flex create-button justify-center text-center lg:text-left">
                      <button
                        type="submit"
                        className="inline-block rounded px-7 pb-3 pt-3 text-sm font-medium text-white w-2/5"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        style={{
                          background:
                            "linear-gradient(to right, #00AEBD, #1D5BBF)",

                        }}
                      >
                        Create Account
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
