import { emailPattern } from "./InputRules";

export const SignupFields = [
  {
    type: "input",
    name: "user_firstname",
    fieldtype: "text",
    label: "Full Name",
    placeholder: "Full Name",
    inputRules: {
      required: "Fullname is required",
    },
  },
  {
    type: "input",
    name: "user_lastname",
    fieldtype: "text",
    label: "Last Name",
    placeholder: "Last Name",
    inputRules: {
      required: "Fullname is required",
    },
  },
  {
    type: "input",
    name: "user_phonenumber",
    fieldtype: "number",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    inputRules: {
      required: "Phone Number is required",
    },
  },
  {
    type: "input",
    name: "user_email",
    fieldtype: "email",
    label: "Email",
    placeholder: "Enter your email",
    inputRules: {
      required: "Email is required",
      pattern: {
        value: emailPattern,
        message: "Invalid email address",
      },
    },
  },
  {
    type: "input",
    name: "user_password",
    fieldtype: "password",
    label: "Password",
    placeholder: "Enter your password",
    inputRules: {
      required: "Password is required",
    },
  },
  {
    type: "input",
    name: "user_confirm_password",
    fieldtype: "password",
    label: "Confirm Password",
    placeholder: "Enter your confirm password",
    inputRules: {
      required: "Confirm Password is required",
    },
  },
];

export const LoginFields = [
  {
    type: "input",
    name: "email",
    fieldtype: "email",
    label: "Email",
    placeholder: "Enter your email",
    inputRules: {
      required: "Email is required",
      pattern: {
        value: emailPattern,
        message: "Invalid email address",
      },
    },
  },
  {
    type: "input",
    name: "password",
    fieldtype: "password",
    label: "Password",
    placeholder: "Enter your password",
    inputRules: {
      required: "Password is required",
    },
  },
];
