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
  load: 'loaded',
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

export const feedStatus = {
  load: 'loaded',
  create: 'created',
  update: 'updated',
  delete: 'deleted',
}


export const reportsStatus = {
  load: 'loaded',
  create: 'created',
  update: 'updated',
  delete: 'deleted'
}

export const calendarStatus = {
  load: 'loaded',
  create: 'created',
}

export const profileStatus = {
  load: 'loaded',
  update: 'updated',
  image: 'imageupdated',
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


export const activityStatusColor = {
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

export const certificateText = {
  inprogress: 'In-Progress',
  yettoapprove: 'Yet to Approve',
  yettojoin: 'Yet to Join',
  yettostart: 'Yet to Start',
  assigned: 'Assigned',
  paused: 'Paused',
  completed: 'Completed',
  cancelled: 'Cancelled',
}


export const certificateColor = {
  yettoapprove: {
    color: '#000',
    bg: '#fff'
  },
  yettostart: {
    color: '#000',
    bg: '#fff'
  },
  assigned: {
    color: '#000',
    bg: '#fff'
  },
  yettojoin: {
    color: 'rgba(255, 212, 27, 1)',
    bg: 'rgba(255, 247, 216, 1)'
  },
  inprogress: {
    color: 'rgba(255, 118, 0, 1)',
    bg: 'rgba(255, 242, 231, 1)'
  },
  completed: {
    color: 'rgba(47, 147, 132, 1)',
    bg: 'rgba(218, 252, 231, 1)'
  },
  paused: {
    color: 'rgba(224, 56, 45, 1)',
    bg: 'rgba(255, 231, 231, 1)'
  },
  cancelled: {
    color: 'rgba(224, 56, 45, 1)',
    bg: 'rgba(255, 231, 231, 1)'
  },
}

export const taskStatusText = {
  draft: 'Draft',
  rejected: 'Cancel',
  pending: 'Pending',
  newtask: 'New',
  completed: 'Completed',
}

export const taskStatusColor = {
  draft: {
    color: 'rgba(255, 212, 27, 1)',
    bg: 'rgba(255, 247, 216, 1)'
  },
  rejected: {
    color: 'rgba(224, 56, 45, 1)',
    bg: 'rgba(255, 231, 231, 1)'
  },
  pending: {
    color: 'rgba(255, 213, 0, 1)',
    bg: 'rgba(255, 251, 233, 1)'
  },
  newtask: {
    color: 'rgba(29, 91, 191, 1)',
    bg: 'rgba(207, 225, 255, 1)'
  },
  completed: {
    color: 'rgba(22, 182, 129, 1)',
    bg: 'rgba(235, 255, 243, 1)'
  },
}


export const reportStatusColor = {
  draft: {
    color: 'rgba(224, 56, 45, 1)',
    bg: '#fff'
  },
  pending: {
    color: 'rgba(255, 213, 0, 1)',
    bg: 'rgba(255, 251, 233, 1)'
  },
  accept: {
    color: 'rgba(22, 182, 129, 1)',
    bg: 'rgba(235, 255, 243, 1)'
  },
  cancel: {
    color: 'rgba(224, 56, 45, 1)',
    bg: 'rgba(255, 231, 231, 1)'
  },
}

export const reportStatus = {
  pending: 'Pending',
  accept: 'Accept',
  cancel: 'Cancel',
  draft: 'Draft',
}


export const reportAllStatus = {
  pending: 'pending',
  accept: 'accept',
  cancel: 'cancel',
  draft: 'draft',
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
  bookmark: 'bookmarked',
  planned: 'planned'
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
  reports: '/reports',
  menteetask: '/mentee-tasks',
  mentortask: '/mentor-tasks'
}

export const programFilterUrls = {
  yettoapprove: `?type=${programActionStatus.yettoapprove}`,
  yettojoin: `?type=${programActionStatus.yettojoin}`,
  planned: `?type=${programActionStatus.planned}`,
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
  [programActionStatus.planned]: 'planned',
}

export const programMenus = (page = 'dashboard') => {
  const pipeUrl = page === 'program' ? pipeUrls.programs : pipeUrls.dashboard
  return [{
      name: "All Programs",
      count: 0,
      page: pipeUrls.programs,
      for: ['mentor', 'mentee', 'admin'],
      status: 'all'
    },
    {
      name: "Planned Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.planned}`,
      for: ['admin'],
      status: programActionStatus.planned
    },
    {
      name: "Recent Join Programs",
      count: 0,
      page: `${pipeUrl}${programFilterUrls.yettostart}`,
      for: ['mentor', 'admin'],
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
      for: ['mentor', 'admin'],
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

export const RequestStatusArray = [{
    key: 'program_request',
    name: 'Program Request'
  },
  {
    key: 'member_join_request',
    name: 'Member Join Requests'
  },
  {
    key: 'goal_request',
    name: 'Goals Requests'
  },
  {
    key: 'resource_access_request',
    name: 'Resource Access Requests'
  },
  {
    key: 'technical_support_request',
    name: 'Technical Support Requests'
  },
  {
    key: 'testimonial_request',
    name: 'Testimonials Requests'
  },
  {
    key: 'certificate_request',
    name: 'Certificate Requests'
  },
  {
    key: 'report_request',
    name: 'Report Requests'
  },
]

export const RequestStatus = {
  programRequest: {
    key: 'program_request',
    name: 'Program Request'
  },
  memberJoinRequest: {
    key: 'member_join_request',
    name: 'Member Join Requests'
  },
  goalRequest: {
    key: 'goal_request',
    name: 'Goals Requests'
  },
  resourceAccessRequest: {
    key: 'resource_access_request',
    name: 'Resource Access Requests'
  },
  technicalSupportRequest: {
    key: 'technical_support_request',
    name: 'Technical Support Requests'
  },
  testimonicalRequest: {
    key: 'testimonial_request',
    name: 'Testimonials Requests'
  },
  certificateRequest: {
    key: 'certificate_request',
    name: 'Certificate Requests'
  },
  reportRequest: {
    key: 'report_request',
    name: 'Report Requests'
  },
}


export const requestOverview = [{
    name: "Program Request",
    key: RequestStatus.programRequest.key,
    count: 0,
    status: RequestStatus.programRequest.key,
    for: ['admin', 'mentor', 'mentee']
  },
  {
    name: "Member Join Requests",
    key: RequestStatus.memberJoinRequest,
    count: 0,
    status: RequestStatus.memberJoinRequest.key,
    for: ['admin']
  },
  {
    name: "Goals Requests",
    key: RequestStatus.goalRequest,
    count: 0,
    status: RequestStatus.goalRequest.key,
    for: ['admin']
  },
  {
    name: "Resource Access Requests",
    key: RequestStatus.resourceAccessRequest,
    count: 0,
    status: RequestStatus.resourceAccessRequest.key,
    for: ['admin', 'mentor']
  },
  {
    name: "Technical Support Requests",
    key: RequestStatus.technicalSupportRequest,
    count: 0,
    status: RequestStatus.technicalSupportRequest.key,
    for: ['admin', 'mentor']
  },
  {
    name: "Testimonials Requests",
    key: RequestStatus.testimonicalRequest,
    count: 0,
    status: RequestStatus.testimonicalRequest.key,
    for: ['admin', 'mentor']
  },
  {
    name: "Certificate Requests",
    key: RequestStatus.certificateRequest,
    count: 0,
    status: RequestStatus.certificateRequest.key,
    for: ['admin', 'mentor']
  },
  {
    name: "Report Requests",
    key: RequestStatus.reportRequest,
    count: 0,
    status: RequestStatus.reportRequest.key,
    for: ['admin', 'mentor']
  }
]

export const allowedImagesTypes = ['png', 'jpeg', 'jpg'];

export const allowedDocTypes = ['pdf', 'doc', 'docx']

export const allowedVideoTypes = ['avi', 'mp4', 'mov']


export const TaskFileTypes = [...allowedImagesTypes, ...allowedDocTypes, ...allowedVideoTypes]

export const TaskAllStatus = {
  yettostart: 'yettostart',
  start: 'start',
  pending: 'pending',
  submitted: 'submitted',
  completed: 'completed',
  rejected: 'rejected',
  draft: 'draft',
  newtask: 'newtask',
  inprogress: 'inprogress',
}

export const TaskStatus = {
  newtask: 'New',
  yettostart: 'Start',
  rejected: 'Cancelled',
  start: 'In-Progress',
  inprogress: 'In-Progress',
  pending: 'Pending',
  completed: 'Completed',
  submitted: 'Submitted',
  cancelled: 'Cancelled',
  draft: 'Draft'
}


export const TaskApiStatus = {
  update: 'update',
  create: 'create',
  load: 'loaded',
  updatemark: 'updatemark'
}