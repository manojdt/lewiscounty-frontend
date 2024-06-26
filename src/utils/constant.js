export const StepsList = [{
    name: "Personal Information",
    status: "In-Progress",
    key: 'personal_information'
  },
  {
    name: "Professional Background",
    status: "",
    key: 'professional_information'
  },
  {
    name: "Educational Background",
    status: "",
    key: 'educational_background'
  },
  {
    name: "Area Of Expertise",
    status: "",
    key: 'area_of_expertise'
  },
  {
    name: "Mentorship Experience",
    status: "",
    key: 'mentor_ship_experience'
  },
  {
    name: "Mentorship Preference",
    status: "",
    key: 'mentor_ship_preference'
  },
  {
    name: "Goals and Expectations",
    status: "",
    key: 'goals_expectations'
  },
  {
    name: "Availability and Commitment",
    status: "",
    key: 'availability_commitment'
  },
  {
    name: "Additional Information",
    status: "",
    key: 'additional_information'
  },
];

export const userStatus = {
  create: 'created',
  login: 'loggedin',
  token: 'tokenfetched',
  getToken: 'getToken',
  role : 'roleUpdated',
  otp : 'otpTriggered',
  otpSuccess : 'otpVerified',
  changePassword : 'passwordUpdated',
  questions : 'questionsUpdated',
}

export const programStatus = {
  create: 'programCreated',
}

export const PasswordRulesSet = {
  character : 'character',
  upperlowercase : 'upperlowercase',
  number : 'number',
  email : 'email',
  common : 'common',
}