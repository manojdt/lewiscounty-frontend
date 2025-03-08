export const MentorFormData = {
  // Personal Information
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "",
  dob: null,
  address: "",
  city: "",
  state: "",
  zip_code: "",
  phone_number: "",
  email: "",
  languages_known: [],
  other_language: "",
  marital_status: "",

  // Background Questions
  known_about_program: "",
  motivation_description: "",
  offer_mentees: "",
  mentorship_achievement: "",
  mentor_exp_desc: "",
  program_commitment: false,
  is_convicted: false,
  convicted_reason: "",

  // References
  references: [
    {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      relationship: "",
    },
  ],

  documents: null,

  error: {},
};

export const MentorFormSection = [
  {
    title: "Personal Information",
    expanded: true,
    fields: [
      {
        type: "textbox",
        label: "First Name",
        placeholder: "Enter First Name",
        isRequired: true,
        col: 4,
        key: "first_name",
      },
      {
        type: "textbox",
        label: "Middle Name",
        placeholder: "Enter Middle Name",
        isRequired: false,
        col: 4,
        key: "middle_name",
      },
      {
        type: "textbox",
        label: "Last Name",
        placeholder: "Enter Last Name",
        isRequired: true,
        col: 4,
        key: "last_name",
      },
      {
        type: "custom_date",
        label: "Date of Birth",
        placeholder: "Select Date",
        isRequired: true,
        col: 6,
        key: "dob",
      },
      {
        type: "radio",
        label: "Gender",
        isRequired: true,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Unspecified", value: "unspecified" },
        ],
        col: 6,
        key: "gender",
      },

      {
        type: "textbox",
        label: "Street Address",
        placeholder: "Enter Address",
        isRequired: false,
        col: 12,
        key: "address",
      },
      {
        type: "textbox",
        label: "City",
        placeholder: "Enter City",
        isRequired: false,
        col: 6,
        key: "city",
      },
      {
        type: "textbox",
        label: "State",
        placeholder: "Enter State",
        isRequired: false,
        col: 6,
        key: "state",
      },
      {
        type: "textbox",
        label: "Zip Code",
        placeholder: "Enter Zip Code",
        isRequired: false,
        col: 6,
        key: "zip_code",
        is_pattern: true,
        format_type: "zip_code",
      },
      {
        type: "textbox",
        label: "Phone Number",
        placeholder: "Enter Phone Number",
        isRequired: false,
        col: 6,
        key: "phone_number",
        is_pattern: true,
        pattern: "\\(\\d{3}\\) \\d{3}-\\d{4}|\\d{3}-\\d{3}-\\d{4}",
      },
      {
        type: "textbox",
        label: "Email",
        isDisable: true,
        placeholder: "Enter Email Address",
        isRequired: true,
        col: 6,
        key: "email",
      },
      {
        type: "checkbox",
        label: "What languages are you comfortable speaking?",
        isRequired: false,
        isMultiple: true,
        options: [
          { label: "English", value: "english" },
          { label: "Spanish", value: "spanish" },
          { label: "Tamil", value: "tamil" },
          { label: "Other", value: "other" },
        ],
        col: 4,
        key: "languages_known",
        isMultiSelect: true,
      },
      {
        type: "selectBox",
        label: "Select Language",
        placeholder: "Select Language",
        isRequired: false,
        col: 2,
        key: "other_language",
        options: [],
        conditionalDisplay: "languages_known",
        conditionalValue: "other", // This will only display the field when "other" is selected
      },
      {
        type: "selectBox",
        label: "Marital Status",
        placeholder: "Select Marital Status",
        isRequired: false,
        col: 12,
        key: "marital_status",
        options: [
          { label: "Single", value: "single" },
          { label: "Married", value: "married" },
          { label: "Domestic Partnership", value: "domestic_partnership" },
          { label: "Widowed", value: "widowed" },
          { label: "Divorced", value: "divorced" },
          { label: "Separated", value: "separated" },
        ],
      },
      {
        type: "textarea",
        label: "How did you learn about our program?",
        placeholder: "Type here...",
        isRequired: false,
        col: 12,
        key: "known_about_program",
      },
      {
        type: "textarea",
        label:
          "Briefly describe your motivation for applying to become a mentor",
        placeholder: "Type here...",
        isRequired: false,
        col: 12,
        key: "motivation_description",
      },
      {
        type: "textarea",
        label: "What do you feel you have to offer a Mentee?",
        placeholder: "Type here...",
        isRequired: false,
        col: 12,
        key: "offer_mentees",
      },
      {
        type: "textarea",
        label:
          "What expectations do you have for your experience as a Mentor in this program?",
        placeholder: "Type here...",
        isRequired: false,
        col: 12,
        key: "mentorship_achievement",
      },
      {
        type: "textarea",
        label:
          "Please list any volunteer experience that included interaction with youth.",
        placeholder: "Type here...",
        isRequired: false,
        col: 12,
        key: "mentor_exp_desc",
      },
      {
        type: "checkbox",
        label:
          "The mentor program requires a minimum commitment of one year once you are matched with a youth. Are you able and willing to commit to this time frame?",
        isRequired: true,
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
        col: 12,
        key: "program_commitment",
      },
      {
        type: "checkbox",
        label: "Have you ever been convicted of a crime?",
        isRequired: true,
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
        col: 12,
        key: "is_convicted",
      },
      {
        type: "textarea",
        label:
          "If yes, please explain (offense, date, location, circumstance, and outcome)",
        placeholder: "Type here...",
        isRequired: false,
        col: 12,
        key: "convicted_reason",
        conditionalDisplay: "is_convicted",
        conditionalValue: true,
      },
    ],
  },
  {
    title: "References",
    expanded: true,
    isReference: true,
    fields: [],
  },
  {
    title: "E-sign",
    expanded: true,
    isSignature: true,
    fields: [],
  },
];

export const ReferenceFields = [
  {
    type: "textbox",
    label: "First Name",
    placeholder: "Enter First Name",
    isRequired: false,
    col: 6,
    key: "first_name",
  },
  {
    type: "textbox",
    label: "Last Name",
    placeholder: "Enter Last Name",
    isRequired: false,
    col: 6,
    key: "last_name",
  },
  {
    type: "textbox",
    label: "Email Address",
    placeholder: "Enter Email Address",
    isRequired: false,
    col: 6,
    key: "email",
  },
  {
    type: "textbox",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    isRequired: false,
    col: 6,
    key: "phone_number",
    is_pattern: true,
    pattern: "\\(\\d{3}\\) \\d{3}-\\d{4}|\\d{3}-\\d{3}-\\d{4}",
  },
  {
    type: "selectBox",
    label: "Relationship",
    placeholder: "Select Relationship",
    isRequired: false,
    col: 12,
    key: "relationship",
    options: [
      { label: "Personal", value: "personal" },
      { label: "Professional", value: "professional" },
      { label: "Family", value: "family" },
      { label: "Friend", value: "friend" },
      { label: "Other", value: "other" },
    ],
  },
];

export const statusConfig = {
  'in-review': {
    label: 'In-Review',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-300'
  },
  'not-started': {
    label: 'Background verification not started',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-300'
  },
  'verified': {
    label: 'Verified',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    borderColor: 'border-green-300'
  }
};