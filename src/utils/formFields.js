export const PersonalInformationFields = [
  {
    type: "input",
    name: "first_name",
    fieldtype: "text",
    label: "First Name",
    placeholder: "Enter First Name",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "email",
    fieldtype: "email",
    label: "E-mail",
    placeholder: "Enter Email",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "phone_number",
    fieldtype: "number",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "dropdown",
    name: "is_linkedin_available",
    label: "LinkedIn Profile (if available)",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    options: [
      { key: "yes", value: "Yes" },
      { key: "no", value: "No" },
    ],
    size: true,
  },
];

export const ProfessionalBackgroundFields = [
  {
    type: "input",
    name: "current_job_title",
    fieldtype: "text",
    label: "Current Job Title",
    placeholder: "Current Job Title",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label: "Current Employee ",
    placeholder: "Current Employee ",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "industry",
    fieldtype: "text",
    label: "Industry",
    placeholder: "Industry",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "dropdown",
    name: "is_linkedin_available",
    label: "LinkedIn Profile (if available)",
    placeholder: "",
    options: [
      { key: "yes", value: "Yes" },
      { key: "no", value: "No" },
    ],
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
];

export const EducationalBackgroundFields = [
  {
    type: "input",
    name: "current_job_title",
    fieldtype: "text",
    label: "Highest Degree Achieved",
    placeholder: "Highest Degree Achieved",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label: "Field of Study",
    placeholder: "Field of Study",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "industry",
    fieldtype: "text",
    label: "Industry",
    placeholder: "Industry",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const AreaOfExpertiseFields = [
  {
    type: "input",
    name: "current_job_title",
    fieldtype: "text",
    label: "Please list your areas of expertise",
    placeholder: "(e.g., project management, software development, marketing)",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label:
      "What specific skills or knowledge are you most confident in sharing with a mentee?",
    placeholder: "Skils",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const MentorShipExperienceFields = [
  {
    type: "checkbox",
    name: "current_job_title",
    label: "Have you previously mentored someone?",
    options: [
      { key: "yes", value: "Yes" },
      { key: "no", value: "No" },
    ],
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label: "If yes, please briefly describe your mentorship experience",
    placeholder: "mentorship experience",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const MentorshipPreferenceFields = [
  {
    type: "input",
    name: "current_job_title",
    fieldtype: "text",
    label: "What type of mentee are you most interested in mentoring?",
    placeholder:
      "(e.g., students, early-career professionals, career changers)",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label: "Preferred method of communication",
    placeholder: "(e.g., email, video calls, in-person meetings)",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "industry",
    fieldtype: "text",
    label: "How often are you available to meet with a mentee?",
    placeholder: "(e.g., weekly, bi-weekly, monthly)",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const GoalsandExperienceFields = [
  {
    type: "input",
    name: "current_job_title",
    fieldtype: "text",
    label: "What do you hope to achieve through this mentorship program?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label: "What are your expectations from the mentee?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const AvailabilityCommitmentFields = [
  {
    type: "input",
    name: "current_job_title",
    fieldtype: "text",
    label: "How many mentees are you willing to take on at a time?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
  {
    type: "input",
    name: "current_employee",
    fieldtype: "text",
    label: "What is your preferred duration for a mentorship relationship?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const AdditionalInformationFields = [
  {
    type: "textbox",
    name: "current_job_title",
    label:
      "Is there any additional information you would like to provide about yourself or your mentorship style?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
  },
];

export const StepFormFields = [
  PersonalInformationFields,
  ProfessionalBackgroundFields,
  EducationalBackgroundFields,
  AreaOfExpertiseFields,
  MentorShipExperienceFields,
  MentorshipPreferenceFields,
  GoalsandExperienceFields,
  AvailabilityCommitmentFields,
  AdditionalInformationFields,
];

export const Stepname = [
  "personal_information",
  "professional_information",
  "educational_background",
  "area_of_expertise",
  "mentor_ship_experience",
  "mentor_ship_preference",
  "goals_expectations",
  "availability_commitment",
  "additional_information",
];
