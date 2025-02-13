import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReactComponent as EyeCloseIcon } from "../../../assets/icons/eyeClose.svg";
import { ReactComponent as EyeOpenIcon } from "../../../assets/icons/eyeOpen.svg";
import { Backdrop } from "@mui/material";
import SuccessTik from "../../../assets/images/blue_tik1x.png";
import { useUpdateUserPasswordMutation } from "../../../features/user/userApi.services"

const PasswordFields = [
  {
    type: "input",
    name: "current_password",
    fieldtype: "password",
    label: "Current Password",
    inputRules: {
      required: "Current Password is required",
    },
  },
  {
    type: "input",
    name: "new_password",
    fieldtype: "password",
    label: "New Password",
    inputRules: {
      required: "New Password is required",
    },
  },
  {
    type: "input",
    name: "confirm_password",
    fieldtype: "password",
    label: "Confirm Password",
    inputRules: {
      required: "Confirm Password is required",
    },
  },
];

function checkPasswordType(newPassword, confirmPassword) {
  let valid = {
    passwordType: "",
    isValid: true,
    label: "",
  };
  if (/\s/.test(newPassword)) {
    valid = {
      passwordType: "new_password",
      isValid: false,
      label: "New Password",
    };
  }
  if (/\s/.test(confirmPassword)) {
    valid = {
      passwordType: "confirm_password",
      isValid: false,
      label: "Confirm Password",
    };
  }
  return valid;
}

const SecurityTab = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm();
  const [passwordError, setPasswordError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [visibility, setVisibility] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  useEffect(() => {
    if (openModal) {
      setTimeout(() => {
        setOpenModal(false);
      }, [3000]);
    }
  }, [openModal]);

  const inputClassName =
    "h-[50px] bg-[#FAFAFA] border-none outline-none text-color[#C0C0C0] text-xs p-2 mt-1 w-full";
  const [updateUserPassword] = useUpdateUserPasswordMutation();
  const onResetPassword = (data) => {
    const { current_password, new_password, confirm_password } = data;
    const passwordValidation = checkPasswordType(
      new_password,
      confirm_password
    );
    const { passwordType, isValid, label } = passwordValidation;
    if (!isValid) {
      setError(passwordType, {
        type: "manual",
        message: `${label} must not contain spaces`,
      });
      return; // Stop further execution if the password contains spaces
    } else if (new_password !== confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "New password and Confirm password should be same",
      });
      return;
    } else if (new_password === current_password) {
      setPasswordError("New password and Current password should not be same");
      return;
    }
    const updatedData = { current_password, new_password };
    updatedData &&
      updateUserPassword(updatedData)
        .then((response) => {
          if (response?.error) {
            const detail =
              response.error.data.detail || response.error.data.message || "";
            setPasswordError(detail);
          } else {
            setOpenModal(true);
            reset();
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onInputChange = () => {
    if (passwordError) {
      setPasswordError("");
    }
  };
  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(onResetPassword)}>
        <div className="font-semibold">Update Password</div>
        {PasswordFields.map((field) => {
          // const height = field.name === 'current_password' ? 120 : 85;
          return (
            <div key={field.name}>
              <div className={`h-[85px] my-5`}>
                <div>{field.label}</div>
                <div className="flex">
                  <input
                    type={visibility[field.name] ? "text" : "password"}
                    className={inputClassName}
                    placeholder={field.label}
                    autoComplete={field.name}
                    style={{
                      color: "#232323",
                      border: errors[field.name]
                        ? `1px solid rgb(239 68 68)`
                        : "none",
                    }}
                    {...register(field.name, {
                      required: `${field.label} is required`,
                    })}
                    aria-invalid={errors[field.name] ? "true" : "false"}
                    onChange={onInputChange}
                  />
                  <button
                    type="button"
                    className="relative top-1 right-14  rounded-e-md"
                    onClick={() => toggleVisibility(field.name)}
                  >
                    {visibility[field.name] ? (
                      <EyeOpenIcon />
                    ) : (
                      <EyeCloseIcon />
                    )}
                  </button>
                </div>

                {/* {field.name === 'current_password' && <div className='text-xs mt-2'>Last Update on 21/08/2024</div>} */}
                {errors[field.name] && (
                  <p className="error" role="alert">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {passwordError !== "" ? (
          <div className="pb-7">
            <p className="error" role="alert">
              {passwordError}
            </p>
          </div>
        ) : null}
        <div className="flex justify-end">
          <button
            btnType="button"
            className="w-[120px] p-[4px] bg-background-primary-main rounded-[3px] h-[45px] text-[12px] text-font-secondary-white mr-5"
            btnCategory="secondary"
          >
            Update Password
          </button>
        </div>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openModal}
      >
        <div className="px-5 py-1 flex justify-center items-center">
          <div
            className="flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20"
            style={{ background: "#fff", borderRadius: "10px" }}
          >
            <img src={SuccessTik} alt="SuccessTik" />
            <p
              className="text-[16px] font-semibold bg-clip-text text-font-primary-main"
              style={{
                fontWeight: 600,
              }}
            >
              Password Updated Successfully
            </p>
          </div>
        </div>
      </Backdrop>
    </div>
  );
};

export default SecurityTab;
