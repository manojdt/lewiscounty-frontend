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



export const MenteeStepsList = [{
    name: "Personal Information",
    status: "In-Progress",
    key: 'personal_information'
  },
  {
    name: "Career/Academic Goals",
    status: "",
    key: 'career_goals'
  },
  {
    name: "Current Status",
    status: "",
    key: 'current_status'
  },
  {
    name: "Mentoring Preferences",
    status: "",
    key: 'mentoring_preference'
  },
  {
    name: "Skills and Interests",
    status: "",
    key: 'skills_and_interests'
  },
  {
    name: "Expectations & Goals",
    status: "",
    key: 'expectations_goals'
  },
  {
    name: "Availability",
    status: "",
    key: 'availability'
  },
  {
    name: "Detailed Career",
    status: "",
    key: 'detailed_career'
  },
  {
    name: "Challenges & Obstacles",
    status: "",
    key: 'challenges_obstacles'
  },
  {
    name: "Mentoring Experience",
    status: "",
    key: 'mentoring_experience'
  },
  {
    name: "Learning Style & Preference",
    status: "",
    key: 'learning_style_preference'
  },
  {
    name: "Network & Preference",
    status: "",
    key: 'network_preference'
  },
  {
    name: "Personal Development",
    status: "",
    key: 'personal_development'
  },
  {
    name: "Mentoring Relationship",
    status: "",
    key: 'mentoring_relationship'
  },
  {
    name: "Long-term Vision",
    status: "",
    key: 'long_term_vision'
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
  role: 'roleUpdated',
  otp: 'otpTriggered',
  otpSuccess: 'otpVerified',
  changePassword: 'passwordUpdated',
  questions: 'questionsUpdated',
}

export const programStatus = {
  load: 'loaded',
  create: 'programcreated',
  exist: 'alreadyexist',
  error: 'error',
  curated: 'curated',
  yetToPlan: 'yettoplan',
  bookmarked: 'bookmarked',
  planned: 'planned',
  assigned: 'assigned',
  inProgress: 'inprogress',
  start: 'start',
  paused: 'paused',
  completed: 'completed'
}

export const PasswordRulesSet = {
  character: 'character',
  upperlowercase: 'upperlowercase',
  number: 'number',
  email: 'email',
  common: 'common',
}

export const statusAction = ['yettoapprove', 'yettojoin', 'yettostart', 'inprogress', 'completed', 'cancelled', 'bookmarked']

export const programActionStatus = {
  all: 'all',
  yettoapprove: 'yettoapprove',
  yettojoin: 'yettojoin',
  yettostart: 'yettostart',
  assigned: 'assigned',
  paused: 'paused',
  inprogress: 'inprogress',
  completed: 'completed',
  cancelled: 'cancelled',
  learning: 'learning',
  bookmark: 'bookmarked'
}



export const pipeUrls = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  programs: '/programs',
  programdetails: '/program-details',
  programtask: '/program-task',
  assigntask: '/assign-task',
  assignmentess : '/assign-mentees',
  createprogram: '/create-program',
  startprogram: '/start-program'
}

export const programFilterUrls = {
  yettoapprove: `?type=${programActionStatus.yettoapprove}`,
  yettojoin: `?type=${programActionStatus.yettojoin}`,
  yettostart: `?type=${programActionStatus.yettostart}`,
  inprogress: `?type=${programActionStatus.inprogress}`,
  completed: `?type=${programActionStatus.completed}`,
  cancelled: `?type=${programActionStatus.cancelled}`,
  learning: `?type=${programActionStatus.learning}`,
  bookmark: '?is_bookmark=true',
}

export const programMenus = (page = 'dashboard') => {
  const pipeUrl = page === 'program' ? pipeUrls.programs : pipeUrls.dashboard
  return [{
      name: "All Programs",
      count: 0,
      page: pipeUrls.programs,
      for: ['mentor', 'mentee'],
      status: 'all'
    },
    {
      name: "Recent Join Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.yettostart}`,
      for: ['mentor'],
      status: programActionStatus.yettostart
    },
    {
      name: "Curated Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.yettojoin}`,
      for: ['mentor', 'mentee'],
      status: programActionStatus.yettojoin
    },
    {
      name: "My Learning Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.learning}`,
      for: ['mentee'],
      status: programActionStatus.learning
    },
    {
      name: "Ongoing Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.inprogress}`,
      for: ['mentor'],
      status: programActionStatus.inprogress
    },
    {
      name: "Bookmarked Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.bookmark}`,
      for: ['mentor', 'mentee'],
      status: programActionStatus.bookmark
    },
    {
      name: "Completed Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.completed}`,
      for: ['mentor', 'mentee'],
      status: programActionStatus.completed
    },
    {
      name: "Aborts Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.cancelled}`,
      for: ['mentee'],
      status: programActionStatus.cancelled
    }
  ]
}