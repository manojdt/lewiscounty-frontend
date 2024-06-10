import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import LogoSlide from "../LogoSlide";
import { LoginFields } from "../../utils/loginFields";

export const Login = () => {
  const [remeberPassword, setRememberPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { useremail, userpassword } = data;
    if (useremail !== "" && userpassword !== "") {
      console.log('Login Data',data);
      navigate("/dashboard");
    }
  };

  const handleRemeberPassword = () => setRememberPassword(!remeberPassword);

  return (
    <div className="h-full">
      <div className="flex flex-wrap h-full">
        <div className="w-full">
          <div className="block bg-white shadow-lg h-full">
            <div className="g-0 lg:flex lg:flex-row h-full">
              <LogoSlide />

              <div className="px-4 md:px-0 lg:w-6/12 text-black">
                <div className="md:mx-6 md:p-12">
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
                      Login
                    </h4>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <a
                      className="mb-3 flex w-full items-center justify-center rounded  px-7 pb-2.5 pt-3 text-center text-sm font-medium"
                      style={{ color: "#232323", border: "1px solid #3E3E3E" }}
                      href="#!"
                      role="button"
                    >
                      <span className="me-2 fill-white [&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                          <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                          ></path>
                          <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                          ></path>
                          <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                        </svg>
                      </span>
                      Continue with Google
                    </a>
                    <div className="mb-8 mt-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
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
                      LoginFields.map((fields, index) =>

                        <div className="relative mb-6" key={index}>
                          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {fields.label}
                          </label>
                          <input
                            type={fields.fieldtype}
                            className={`w-full rounded px-3 py-[0.32rem] leading-[2.15] ${errors[fields.name] ? 'focus:border-teal focus:outline-none focus:ring-0' : ''}`}
                            placeholder={fields.placeholder}
                            style={{
                              color: "#232323",
                              border: `1px solid ${errors[fields.name] ? 'rgb(239 68 68)' : '#3E3E3E'}`,
                            }}
                            {...register(fields.name, fields.inputRules)}
                            aria-invalid={errors[fields.name] ? "true" : "false"}
                          />
                          {errors[fields.name] && (
                            <p className="error" role="alert">
                              {errors[fields.name].message}
                            </p>
                          )}
                        </div>
                      )
                    }

                    <div className="mb-6 flex items-center justify-between">
                      <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
                        <input
                          className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem]"
                          type="checkbox"
                          value={remeberPassword}
                          checked={remeberPassword}
                          onChange={handleRemeberPassword}
                        />
                        <label className="inline-block ps-[0.15rem] hover:cursor-pointer defaultTextColor">
                          Remember me
                        </label>
                      </div>

                      <button style={{ color: "#00AEBD" }} onClick={() => navigate('/forgot-password')}>
                        Forgot password?
                      </button>
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
                        Login
                      </button>

                      <p
                        className="mb-0 mt-2 pt-1 text-sm font-semibold text-center"
                        style={{ color: "#232323" }}
                      >
                        Don't have an account?
                        <button
                          className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 pl-1"
                          style={{ color: "#1D5BBF" }}
                          onClick={() => navigate("/register")}
                        >
                          Create an Account
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
