import { emailPattern } from "./InputRules";

export const SignupFields = [
  {
    type: "input",
    name: "first_name",
    fieldtype: "text",
    label: "First Name",
    placeholder: "Enter your first name",
    inputRules: {
      required: "First name is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "last_name",
    fieldtype: "text",
    label: "Last Name",
    placeholder: "Enter your last name",
    inputRules: {
      required: "Last name is required",
    },
    size: true,
  },
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
    size: false,
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
    size: false,
  }
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
