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
  categoryPrograms: 'categoryprogramloaded'
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
  completed: 'completed',
  taskassigned: 'taskassigned',
  taskstarted: 'taskstarted',
  tasksubmitted: 'tasksubmitted'
}

export const goalStatus = {
  load: 'loaded',
  create: 'created',
  statusupdate: 'statusupdate',
  active: 'active',
  start: 'start',
  abort: 'abort',
  complete: 'complete',
  update: 'updated',
  delete: 'deleted',
}


export const reportsStatus = {
  load: 'loaded',
}


export const goalPeriods = [{
    name: '1 Month',
    value: 1
  },
  {
    name: '3 Months',
    value: 3
  },
  {
    name: '6 Months',
    value: 6
  },
  {
    name: '12 Months',
    value: 12
  },

]


export const goalActivityStatus = {
  create: 'rgba(29, 91, 191, 1)',
  active: 'rgba(18, 179, 71, 1)',
  delete: 'rgba(224, 56, 45, 1)',
  complete: 'rgba(0, 174, 189, 1)',
  ongoing: 'rgba(255, 212, 27, 1)',
  abort: 'rgba(255, 0, 215, 1)',
  update: 'rgba(255, 118, 0, 1)'
}


export const goalDataStatus = {
  inactive: 'Not Active Goal',
  active: 'Active',
  ongoing: 'Ongoing',
  completed: 'Completed',
  aborted: 'Aborted',
}

export const goalStatusColor = {
  inactive: {
    color: '#000',
    bg: '#fff'
  },
  active: {
    color: 'rgba(255, 212, 27, 1)',
    bg: 'rgba(255, 247, 216, 1)'
  },
  ongoing: {
    color: 'rgba(255, 118, 0, 1)',
    bg: 'rgba(255, 242, 231, 1)'
  },
  completed: {
    color: 'rgba(47, 147, 132, 1)',
    bg: 'rgba(218, 252, 231, 1)'
  },
  aborted: {
    color: 'rgba(224, 56, 45, 1)',
    bg: 'rgba(255, 231, 231, 1)'
  },
}

export const goalRequestStatus = {
  new: 'New',
  pending: 'Pending',
  accept: 'Accept',
  decline: 'Decline'
}

export const goalRequestColor = {
  new: {
    color: 'rgba(29, 91, 191, 1)',
    bg: 'rgba(238, 245, 255, 1)'
  },
  accept: {
    color: 'rgba(22, 182, 129, 1)',
    bg: 'rgba(235, 255, 243, 1)'
  },
  pending: {
    color: 'rgba(255, 213, 0, 1)',
    bg: 'rgba(255, 251, 233, 1)'
  },
  decline: {
    color: 'rgba(224, 56, 45, 1)',
    bg: 'rgba(255, 231, 231, 1)'
  }

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
  assignmentess: '/assign-mentees',
  createprogram: '/create-program',
  startprogram: '/start-program',
  reports: '/reports'
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

export const menteeCountStatus = {
  all: 'allprogram',
  [programActionStatus.inprogress]: 'ongoing',
  [programActionStatus.completed]: 'completed',
  [programActionStatus.yettojoin]: 'curated',
  [programActionStatus.learning]: 'mylearning',
  [programActionStatus.bookmark]: 'bookmark',
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




export const requestOverview = [{
    name: "Program Request",
    count: 0,
    status: 'all'
  },
  {
    name: "Resource Access Requests",
    count: 0,
    status: programActionStatus.yettostart
  },
  {
    name: "Technical Support Requests",
    count: 0,
    status: programActionStatus.yettojoin
  },
  {
    name: "New Goals Requests",
    count: 0,
    status: programActionStatus.learning
  },
  {
    name: "Request Testimonials",
    count: 0,
    status: programActionStatus.inprogress
  }
]

export const allowedImagesTypes = ['png', 'jpeg', 'jpg'];

export const allowedDocTypes = ['pdf', 'doc','docx']

export const allowedVideoTypes = ['avi','mp4','mov']


export const TaskFileTypes =  [...allowedImagesTypes, ...allowedDocTypes, ...allowedVideoTypes]

export const TaskAllStatus = {
  yettostart: 'yettostart',
  start: 'start',
  submitted: 'submitted',
  completed: 'completed'
}

export const TaskStatus = {
  start: 'In-Progress',
}
