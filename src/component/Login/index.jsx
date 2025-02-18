import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { LoginFields } from "../../utils/loginFields";
import SocialMediaLogin from "../../shared/SocialMedia";
import {
  resetUserInfo,
  updateInfo,
  updateUserInfo,
} from "../../services/loginInfo";
import { userStatus } from "../../utils/constant";
import { ReactComponent as EyeCloseIcon } from "../../assets/icons/eyeClose.svg";
import { ReactComponent as EyeOpenIcon } from "../../assets/icons/eyeOpen.svg";
import { useUserAccountLoginMutation } from "../../features/login/loginapi.services";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { MuiCustomModal } from "../../shared/Modal/MuiCustomModal";
import { Avatar } from "@mui/material";
import modal_tick_icon from "../../assets/icons/modal_tick_icon.svg";

const Login = () => {
  // Internal State
  const [remeberPassword, setRememberPassword] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [userFormDetails, setFormDetails] = React.useState({
    email: "",
    password: "",
  });
  const [verificationPopup, setVerificationPopup] = React.useState(false);

  const location = useLocation();
  const handleClosePopup = () => {
    setVerificationPopup(false);
  };
  // Redux
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userInfo);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    clearErrors
  } = useForm();

  const [userAccountLogin, { data: loginData }] = useUserAccountLoginMutation();

  // const onSubmit = async (data) => {
  //   const { email, password } = data;
  //   if (email !== "" && password !== "") {
  //     if (/\s/.test(password)) {
  //       setError("password", {
  //         type: "manual",
  //         message: "Password must not contain spaces",
  //       });
  //       return; // Stop further execution if the password contains spaces
  //     }
  //     if (localStorage.getItem("rememberme") === "true") {
  //       localStorage.setItem("useremail", email);
  //       localStorage.setItem("userpassword", btoa(password));
  //     }

  //     const apiData = await userAccountLogin(data).unwrap()
  //     if(apiData){
  //       console.log("apiData ==>", apiData)
  //     }

  //     // dispatch(userAccountLogin(data)).then((res)=>{
  //     //   console.log("res ===>",  res)
  //     //   if(res?.error?.message === "Please verify your email address. A verification link has been sent to your registered email address."){
  //     //     setVerificationPopup(true)
  //     //     setTimeout(() => {
  //     //       setVerificationPopup(false)
  //     //     }, 3000);
  //     //   }
  //     // })
  //     setFormDetails(data);
  //   }
  // };

  const onSubmit = async (data) => {
    const { email, password } = data;

    if (email !== "" && password !== "") {
      // Check if password contains spaces
      if (/\s/.test(password)) {
        setError("password", {
          type: "manual",
          message: "Password must not contain spaces",
        });
        return; // Stop further execution
      }

      // Remember the user's credentials if the "Remember Me" option is enabled
      if (localStorage.getItem("rememberme") === "true") {
        localStorage.setItem("useremail", email);
        localStorage.setItem("userpassword", btoa(password)); // Encode password in Base64
      }

      try {
        // Login API call using RTK Query
        const apiData = await userAccountLogin(data).unwrap();

        // if (apiData.status === 200) {
        const { access, refresh } = apiData;

        // Decode the JWT token to extract user info
        const decoded = jwtDecode(access);

        // Optional: Add checks based on decoded data
        // if (decoded?.userinfo?.approve_status === 'new') {
        //   return {}; // Handle specific approval status if required
        // }

        // Store tokens in localStorage
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        handleRedirect();
        // return decoded; // Return the decoded token for further use
        // }
      } catch (error) {
        if (!error?.data?.is_verify_email) {
          toast.error(error.data.message);
        }
        // Handle API errors
        if (error?.status === 401) {
          if (error?.data?.is_verify_email) {
            // Handle unverified email
            setVerificationPopup(true);
            // setTimeout(() => {
            //   handleClosePopup();
            // }, 3000);
          } else {
            // Handle invalid credentials or other 401 errors
            setError("password", {
              type: "manual",
              message: "Invalid email or password.",
            });
          }
          clearErrors();
        } else {
          // Handle unexpected errors
          setError("form", {
            type: "manual",
            message: "An unexpected error occurred. Please try again later.",
          });
          clearErrors();
        }
      }
    }
  };

  const handleRemeberPassword = () => {
    localStorage.setItem("rememberme", !remeberPassword);
    setRememberPassword(!remeberPassword);
  };

  // const handleRedirect = () => {
  //   dispatch(updateInfo())
  //   if (userData.data.role === 'fresher') navigate("/login-type");
  //   else if (userData.data.is_registered) navigate("/dashboard")
  //   else if(userData.data.role === 'mentee' && !userData.data.is_registered) navigate('/programs')
  //   else navigate("/questions");
  // }

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleRedirect = () => {
    dispatch(updateInfo()).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        const user_data = res?.payload;
        if (
          user_data?.role === "super_admin" &&
          user_data?.is_registered === true
        ) {
          navigate("/super-members");
        } else if (user_data?.role === "fresher") {
          navigate("/login-type");
        } else if (user_data?.is_registered) {
          if(user_data?.userinfo?.is_questions_completed||user_data.role==="admin"||user_data.role==="mentee"){
            navigate(redirectPath);
          }else{
            navigate("/questions");
          }
        } else if (user_data?.role === "mentee" && !user_data?.is_registered) {
          navigate("/programs");
        } else {
          navigate("/questions");
        }
      }
    });
  };

  React.useEffect(() => {
    const rememberme = localStorage.getItem("rememberme");
    const email = localStorage.getItem("useremail");
    const password = localStorage.getItem("userpassword");
    dispatch(resetUserInfo());
    if (localStorage.getItem("rememberme") === "true") {
      setRememberPassword(true);
      reset({ email, password: atob(password) });
    }
  }, []);

  React.useEffect(() => {
    if (!userData.loading && userData.status === userStatus.login) {
      setTimeout(() => {
        handleRedirect();
      }, 20);
    }

    if (!userData.loading && userData.status === userStatus.pending) {
      setTimeout(() => {
        dispatch(updateUserInfo({ status: "" }));
      }, 3000);
    }
  }, [userData]);

  // Prevent Enter key from triggering forgot password action
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.name === "forgot-password") {
      e.preventDefault();
    }
  };

  return (
    <React.Fragment>
      {/* <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={userData.loading || userData.status === userStatus.pending}
      >
        {userData.status === userStatus.pending ? (
          <div className='popup-content w-2/6 md:w-2/4 sm:w-2/4 bg-white flex flex-col gap-4 h-[330px] justify-center items-center'>
            <img
              src={
                userData.status === userStatus.pending
                  ? FailedIcon
                  : SuccessIcon
              }
              alt='VerifyIcon'
            />
            <span style={{ color: '#232323', fontWeight: 600 }}>
              {userData.status === userStatus.pending
                ? 'Waiting for Admin Approval'
                : ' Login Successful!'}
            </span>
          </div>
        ) : (
          <CircularProgress color='inherit' />
        )}
      </Backdrop> */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={userData.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Right Section */}
      <div className="w-full flex items-center justify-center">
        <div className="w-4/5 max-w-md">
          <div className="flex gap-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Log in to</h2>
            <h2 className="pb-1 text-2xl font-semibold bg-gradient-to-r from-[#00AEBD] to-[#1D5BBF] text-transparent bg-clip-text">
              MMA
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold underline cursor-pointer"
            >
              Sign up
            </span>
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <SocialMediaLogin
              setVerificationPopup={setVerificationPopup}
              location={location}
            />
            <div className="mb-4 mt-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
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
            {LoginFields.map((field, index) => (
              <div className="relative mb-6" key={index}>
                <label className="block tracking-wide text-gray-700 text-xs mb-2">
                  {field.label}
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
                  aria-invalid={errors[field.name] ? "true" : "false"}
                />
                {field.fieldtype === "password" && (
                  <button
                    type="button"
                    className="absolute top-8 end-0 p-3.5 rounded-e-md"
                    onClick={() => setPasswordVisibility(!passwordVisibility)}
                  >
                    {passwordVisibility ? <EyeOpenIcon /> : <EyeCloseIcon />}
                  </button>
                )}
                {errors[field.name] && (
                  <p className="error" role="alert">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            ))}

            <div className="mb-6 flex items-center justify-between">
              <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
                <input
                  className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem]"
                  type="checkbox"
                  value={remeberPassword}
                  checked={remeberPassword}
                  onChange={handleRemeberPassword}
                />
                <label className="inline-block ps-[0.15rem] text-[14px] hover:cursor-pointer defaultTextColor">
                  Remember me
                </label>
              </div>

              <button
                type="button" // Set type to 'button' to prevent it from submitting the form
                className="text-[12px]"
                style={{ color: "#00AEBD" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <div className="login-button flex justify-center text-center lg:text-left relative mb-16">
              <button
                type="submit"
                className="inline-block w-1/3 rounded px-7 pb-3 pt-3 text-sm font-medium text-white"
                data-twe-ripple-init
                data-twe-ripple-color="light"
                style={{
                  background: "linear-gradient(to right, #00AEBD, #1D5BBF)",
                }}
                disabled={userData.loading}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <MuiCustomModal
          open={verificationPopup}
          onClick={handleClosePopup}
          handleClose={handleClosePopup}
          PaperProps={{
            sx: {
              minHeight: 300,
            },
          }}
          maxWidth="sm"
          dialogTitle={"Message"}
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
      </div>
    </React.Fragment>
  );
};

export { Login };
