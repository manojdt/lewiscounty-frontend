export const PersonalInformationFields = [{
    type: "input",
    name: "first_name",
    fieldtype: "text",
    label: "First Name",
    placeholder: "Enter First Name",
    inputRules: {
      required: "This field is required",
    },
    size: true,
    disable: true
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
    disable: true
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
  // {
  //   type: "dropdown",
  //   name: "linked_in",
  //   label: "LinkedIn Profile (if available)",
  //   placeholder: "",
  //   inputRules: {
  //     required: "This field is required",
  //   },
  //   options: [{
  //       key: "yes",
  //       value: "Yes"
  //     },
  //     {
  //       key: "no",
  //       value: "No"
  //     },
  //   ],
  //   size: true,
  // },
];

export const ProfessionalBackgroundFields = [{
    type: "input",
    name: "job_title",
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
    name: "current_employer",
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
    name: "industry_type",
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
    name: "linked_in",
    label: "LinkedIn Profile (if available)",
    placeholder: "",
    options: [{
        key: "yes",
        value: "Yes"
      },
      {
        key: "no",
        value: "No"
      },
    ],
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
];

export const EducationalBackgroundFields = [{
    type: "input",
    name: "highest_degree",
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
    name: "field_of_study",
    fieldtype: "text",
    label: "Field of Study",
    placeholder: "Field of Study",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  // {
  //   type: "input",
  //   name: "industry1",
  //   fieldtype: "text",
  //   label: "Industry",
  //   placeholder: "Industry",
  //   inputRules: {
  //     required: "This field is required",
  //   },
  //   size: false,
  // },
];

export const AreaOfExpertiseFields = [{
    type: "input",
    name: "areas_of_expertise",
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
    name: "confident_areas_of_expertise",
    fieldtype: "text",
    label: "What specific skills or knowledge are you most confident in sharing with a mentee?",
    placeholder: "Skils",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const MentorShipExperienceFields = [{
    type: "checkbox",
    name: "prev_mentorship",
    label: "Have you previously mentored someone?",
    options: [{
        key: true,
        value: "Yes"
      },
      {
        key: false,
        value: "No"
      },
    ],
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
  {
    type: "input",
    name: "mentor_exp_desc",
    fieldtype: "text",
    label: "If yes, please briefly describe your mentorship experience",
    placeholder: "mentorship experience",
    size: false,
  },
];

export const MentorshipPreferenceFields = [{
    type: "input",
    name: "interested_mentee_type",
    fieldtype: "text",
    label: "What type of mentee are you most interested in mentoring?",
    placeholder: "(e.g., students, early-career professionals, career changers)",
    inputRules: {
      required: "This field is required",
    },
    size: true,
  },
  {
    type: "input",
    name: "communication_mode",
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
    name: "availability_frequency",
    fieldtype: "text",
    label: "How often are you available to meet with a mentee?",
    placeholder: "(e.g., weekly, bi-weekly, monthly)",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const GoalsandExperienceFields = [{
    type: "input",
    name: "mentorship_achievement",
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
    name: "mentor_expectations",
    fieldtype: "text",
    label: "What are your expectations from the mentee?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const AvailabilityCommitmentFields = [{
    type: "input",
    name: "max_mentee_count",
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
    name: "pref_mentorship_duration",
    fieldtype: "text",
    label: "What is your preferred duration for a mentorship relationship?",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    size: false,
  },
];

export const AdditionalInformationFields = [{
  type: "textbox",
  name: "additional_info",
  label: "Is there any additional information you would like to provide about yourself or your mentorship style?",
  placeholder: "",
  inputRules: {
    required: "This field is required",
  },
}, ];

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


export const ProgramTabs = [{
    name: 'Program Information',
    key: 'program_information'
  },
  {
    name: 'About Program',
    key: 'about_program'
  },
  {
    name: 'Program Outcomes',
    key: 'program_outcomes'
  },
  {
    name: 'Program Testimonials',
    key: 'program_testimonials'
  },
]
export const ProgramInformationFields = [{
    type: "dropdown",
    name: "category",
    label: "Category",
    placeholder: "Select Category",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Category 1"
      },
      {
        key: "no",
        value: "Category 2"
      },
    ],
    width: 'width-32',
  },
  {
    type: "input",
    name: "program_name",
    fieldtype: "text",
    label: "Program Name",
    placeholder: "Enter Program Name",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "dropdown",
    name: "sessions",
    label: "Add Sessions",
    placeholder: "Select Sessions",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Session 1"
      },
      {
        key: "no",
        value: "Session 2"
      },
    ],
    width: 'width-32',
  },
  {
    type: "textbox",
    name: "decription",
    label: "Description",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
  },
  {
    type: "dropdown",
    name: "course_level",
    label: "Course Level",
    placeholder: "Select Course Level",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Medium"
      },
      {
        key: "no",
        value: "Difficult"
      },
    ],
    width: 'width-32',
  },
  {
    type: "date",
    name: "program_start_date",
    label: "Program Start Date and Time",
    placeholder: "Select Program Start Date and Time",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "date",
    name: "program_end_date",
    label: "Program End Date and Time",
    placeholder: "Select Program End Date and Time",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "input",
    name: "learning_materials",
    label: "Learning Materials",
    fieldtype: "text",
    placeholder: "Add Learning Materials",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
    icon: 'add'
  },
  {
    type: "input",
    name: "mentee_limits",
    label: "Maximum Mentee Limits",
    fieldtype: "text",
    placeholder: "Select Mentee Limits",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "dropdown",
    name: "group_discussion",
    label: "If you need Group Chat Discussions for this Program",
    placeholder: "Select",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Yes"
      },
      {
        key: "no",
        value: "No"
      },
    ],
    width: 'width-32',
  },
  {
    type: "dropdown",
    name: "individual_discussion",
    label: "If you need Individual chat discussions for this Program",
    placeholder: "Select",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Yes"
      },
      {
        key: "no",
        value: "No"
      },
    ],
    width: 'width-32',
  },
  {
    type: "input",
    name: "location",
    label: "Add Location for this Program/Events",
    fieldtype: "text",
    placeholder: "Add Location",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
    icon: 'location'
  },
];


export const AboutProgramFields = [{
    type: "textbox",
    name: "about_program",
    label: "About Program",
    placeholder: "Enter this about program details",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-82',
  },
  {
    type: "htmlbuilder",
    name: "html_builder",
    text: "Use HTML Builder",
    width: 'width-17',
  },

  {
    type: "input",
    name: "skills",
    label: "Skills Gain",
    fieldtype: "text",
    placeholder: "Multiple Skills added",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
    icon: 'add'
  },
  {
    type: "file",
    name: "sponsor_logo",
    label: "Add Sponsor Logo/Program Related Image",
    fieldtype: "text",
    placeholder: "Multiple Skills added",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
  },
]


export const ProgramOutcomesFields = [{
    type: "textbox",
    name: "benefits",
    label: "Benefits",
    placeholder: "Enter this about program details",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-82',
  },
  {
    type: "htmlbuilder",
    name: "html_builder",
    text: "Use HTML Builder",
    width: 'width-17',
  },

  {
    type: "input",
    name: "certificates",
    label: "Program Certificates",
    fieldtype: "text",
    placeholder: "Add Certificates",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
    icon: 'add'
  },
]


export const ProgramTestimonialsFields = [{
    type: "input",
    name: "members",
    label: "Members",
    placeholder: "Add request for testimonials",
    fieldtype: 'text',
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
    icon: 'add'
  },
  {
    type: "dropdown",
    name: "testimonials_type",
    label: "Testimonials Type",
    placeholder: "",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Type 1"
      },
      {
        key: "no",
        value: "Type 2"
      },
    ],
    width: 'w-full',
  },
]

export const ProgramFields = [
  ProgramInformationFields,
  AboutProgramFields,
  ProgramOutcomesFields,
  ProgramTestimonialsFields
];




export const AssignMenteesFields = [{
    type: "dropdown",
    name: "category",
    label: "Category",
    placeholder: "Select Category",
    inputRules: {
      required: "This field is required",
    },
    options: [{
        key: "yes",
        value: "Category 1"
      },
      {
        key: "no",
        value: "Category 2"
      },
    ],
    width: 'width-32',
  },
  {
    type: "input",
    name: "program_name",
    fieldtype: "text",
    label: "Program Name",
    placeholder: "Enter Program Name",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "input",
    name: "mentor_name",
    fieldtype: "text",
    label: "Mentor Name",
    placeholder: "Enter Program Name",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "date",
    name: "program_name",
    label: "Program Start Date and Time",
    placeholder: "Select Program Start Date and Time",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "date",
    name: "program_name",
    label: "Program End Date and Time",
    placeholder: "Select Program End Date and Time",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "input",
    name: "program_durations",
    fieldtype: "text",
    label: "Program Durations",
    placeholder: "Enter Program Durations",
    inputRules: {
      required: "This field is required",
    },
    width: 'width-32',
  },
  {
    type: "text",
    name: "mentees_list",
    label: "Add Mentees for this Program",
    width: 'w-full',
  },
  {
    type: "editor",
    name: "task_details",
    fieldtype: "text",
    label: "Task Details",
    placeholder: "List out Task Details",
    inputRules: {
      required: "This field is required",
    },
    width: 'w-full',
  },

];