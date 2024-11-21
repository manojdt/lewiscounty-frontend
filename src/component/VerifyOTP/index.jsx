import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams  } from "react-router-dom";
import LogoSlide from "../LogoSlide";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { resetUserInfo, validateOTP } from "../../services/loginInfo";
import { userStatus } from "../../utils/constant";

export const VerifyOTP = () => {
  const numberOfDigits = 6;
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get("email");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.userInfo);
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [disableSubmit, setDisableSubmit] = useState(true);
  const otpBoxReference = useRef([]);

  const handleSubmit = () => {
    const verifyOtp = otp.join("");
    if(verifyOtp !== '' && verifyOtp.length === 6 && userEmail !== ''){
      dispatch(validateOTP({"email" : userEmail, "otp": verifyOtp}))
    }
  };

  useEffect(() => {
    dispatch(resetUserInfo())
  }, [])

  useEffect(() => {
    if(!userInfo.loading && userInfo.status === userStatus.otpSuccess){
      navigate(`/change-password?email=${userEmail}`)
    }
  },[userInfo])

  function handleChange(value, index) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }

    if (otp.join("").length === 6) setDisableSubmit(false);

    if (otp.join("").length > 6 || otp.join("").length < 6) setDisableSubmit(true);
  }


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
              <div className="verify-otp px-4 md:px-0 lg:w-7/12 text-black flex justify-center items-center">
                <div className="otp-root w-9/12">
                  <div className="text-center">
                    <div className="flex justify-center items-center">
                     
                      <h4 className="mt-1 pl-3 pb-1 text-xl font-semibold logoColor">
                        MyLogo
                      </h4>
                    </div>

                    <h4 className="mb-6 mt-6 pb-1 text-xl font-semibold defaultTextColor">
                      Verification
                    </h4>
                  </div>

                  <form>
                  {
                      userInfo.error !== '' ? <div className="pb-7">
                        <p className="error" role="alert">
                          {userInfo.error}
                        </p></div> : null
                    }
                    <div className="relative mb-6 flex justify-evenly gap-5  pr-5">
                      {otp.map((digit, index) => (
                        <input
                          type="number"
                          key={index}
                          value={digit}
                          maxLength={1}
                          onChange={(e) => handleChange(e.target.value, index)}
                          onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                          ref={(reference) =>
                            (otpBoxReference.current[index] = reference)
                          }
                          className={`otp-input border w-12 h-auto  p-3 rounded-md block  focus:border-2 focus:outline-none appearance-none`}
                        />
                      ))}
                     
                    </div>

                    <div className="text-center lg:text-left">
                      <button
                        type="button"
                        className="inline-block w-full rounded px-7 pb-3 pt-3 text-sm font-medium text-white"
                        data-twe-ripple-init
                        data-twe-ripple-color="light"
                        style={{
                          background:
                            "linear-gradient(to right, #00AEBD, #1D5BBF)",
                        }}
                        onClick={handleSubmit}
                        disabled={disableSubmit}
                      >
                        Verify
                      </button>

                      <p
                        className="mb-0 mt-2 pt-1 text-sm font-semibold text-center"
                        style={{ color: "#232323" }}
                      >
                        <button
                          className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 pl-1"
                          style={{ color: "#1D5BBF" }}
                          onClick={() => navigate("/")}
                        >
                          Resend OTP
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
