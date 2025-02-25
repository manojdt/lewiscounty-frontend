export const requestPageBreadcrumbs = {
  program_new: "new_program_request",
  program_reschedule: "program_reschedule",
  program_cancel: "program_cancel",
  program_mentee_cancel: "program_mentee_cancel",
  program_join: "program_join",
  member_join_request:"member_join_request",
  testimonial_request:"testimonial_request",
  testimonial_request_admin_my:"testimonial_request_admin_my",
  certificate_request:"certificate_request",
  report_request:"report_request",
  goal_request:"goal_request",
  mentee:"mentee",
  mentor:"mentor",
  program_join_request_admin:'program_join_request_admin',
  main_mentee_tab:"mentee_tab",
  main_admin_test_tab:"my_tab",
  adminReportTab:"all",
  adminApproveReportTab:"approved",
  adminCancelReportTab:"rejected",
  adminCertificateTab:"all",
  waitCertificateTab:"waiting_for_response",
  pendingCertificateTab:"pending",
  approvedCertificateTab:"approved",
  adminCertificateApproveReportTab:"approved",
  adminMemberMentorTab:"mentor",
  adminMemberMenteeTab:"mentee",
  new_goals_request:"new_goals_request",
  feed:'fead',
  dashboardfeed:'dashBoardfead',
  myMentee:"myMentee",
  newFollowRequest:"new_follow_request",
  myMentor:"myMentor",
  topMentor:"topMentor",
  newFollowRequestMentor:"new_follow_request_mentor",
  goalHistory:"goalHistory",
  activeGoal:"active",
  progressGoal:"in_progress",
  completedGoal:"completed",
  cancelledGoal:"cancel",
  programGoalView:"program_goal_view",
  menteeGoalViewMentor:"mentor-view-mentee-goal",
  menteeAllReport:'all',
  menteeNewReport:'new',
  menteePendingReport:'pending',
  menteeCompletedReport:'approved',
  menteeRejectedReport:'rejected',
  menteeDraftReport:'draft',
  taskMenteeAllReport:'all',
  taskMenteeNewReport:'newtask',
  taskMenteeWaitReport:'waiting_for_approval',
  taskMenteeReassignedReport:'reassigned',
  taskMenteePendingReport:'pending',
  taskMenteeCompletedReport:'completed',
  taskMenteeRejectedReport:'rejected',
  taskMenteeDraftReport:'draft',
  dashboardPrograms:'dashboardProgramDetails',
  ticketHistorys:'ticketHistoryView',
  dashboardProgramsCard:'dashboardProgramscard',
  ProgramsCard:'programscard',
  ProgramsDetails:'programDetails',
  dashboardtopmentor : 'dashboardtopmentor',
  dashboardMemberMentor : 'dashboardMemberMentor',
  dashboardMemberMentee : 'dashboardMemberMentee',
  ticketAll : "all",
  ticketNew : "new",
  ticketPending : "pending",
  ticketInprogress : "in_progress",
  ticketClosed : "closed",
  ticketResolved : "resolved",
  ticketReject : "rejected",
  mentorAllEditReport : 'all',
  mentorNewEditReport : 'new',
  mentorPendingEditReport : 'pending',
  mentorDraftEditReport : 'draft',
  mentorDashboardProgram : "mentorDashboardProgram",
  adminMemberChat : "adminMemberchat",
  menteesProfileCounts : "menteesProfileCount",
  // navbarProfile : 'navbarProfile',
};
export const programStatusBreadcrumbs=[
    'All Programs',
    'Active Programs',
    'Recently Joined Programs',
    'Ongoing Programs',
    'Assigned Programs',
    'Admin Assigned Programs',
    'Drafted Programs',
    'Bookmarked Programs',
    'Upcoming Programs',
    'Interested Programs',
    'Rescheduled Programs',
    'Completed Programs',
    'Cancelled Programs'
  ];
  
// Program Request
export const request_newProgramRequest = (name) => {
  return [
    {
      label: "Program Requests",
      path: "/all-request?type=program_request",
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const request_programReschedule = (name) => {
  return [
    {
      label: "Reschedule Requests",
      path: `/all-request?type=program_request&tabType=${requestPageBreadcrumbs?.program_reschedule}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const request_programCancel = (name) => {
  return [
    {
      label: "Cancellation Requests",
      path: `/all-request?type=program_request&tabType=${requestPageBreadcrumbs?.program_cancel}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const request_programMenteeCancel = (name) => {
  return [
    {
      label: "Cancellation Requests",
      path: `/all-request?type=program_request&tabType=${requestPageBreadcrumbs?.program_cancel}&mainTab=${requestPageBreadcrumbs.main_mentee_tab}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};

// Program
export const program_details = (state,name) => {
  return [
    {
      label: state === "category" ? "Category View" : "Program Details",
      path: -1,
    },
    {
      label:  `${name}`,
    },
  ];
};

// Member Join Request

export const request_memberJoin = (name) => {
    return [
    //   {
    //     label: "Requests",
    //     path: `/all-request`,
    //   },
      {
        label: "Member Join Requests",
        path: `/all-request?type=member_join_request`,
      },
      {
        label: `View New Mentor Profile`,
      },
    ];
  };

// Goal Request

export const request_goalMentor = (name,menteeQuery) => {
    const query=menteeQuery?`&tabType=${requestPageBreadcrumbs?.mentor}&mainTab=${requestPageBreadcrumbs.main_mentee_tab}`:""
    return [
      {
        label: "Goal Requests",
        path: `/all-request?type=goal_request${query}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const request_goalMentee = (name,menteeQuery) => {
      const query=menteeQuery?`&mainTab=${requestPageBreadcrumbs.main_mentee_tab}`:""
    return [
      {
        label: "Goal Requests",
        path: `/all-request?type=goal_request&tabType=${requestPageBreadcrumbs?.mentee}${query}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const request_goalNew = (name,menteeQuery) => {
    return [
      {
        label: "Goal Requests",
        path: `/all-request?type=new_goals_request`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };

// Testimonials Requests
export const request_testimonial = (name) => {
    return [
      {
        label: "Testimonial Requests",
        path: `/all-request?type=testimonial_request`,
      },
      {
        label: `View Testimonials`,
      },
    ];
  };
export const request_testimonial_admin = (name) => {
    return [
      {
        label: "Testimonial Requests",
        path: `/all-request?type=testimonial_request&mainTab=${requestPageBreadcrumbs.main_admin_test_tab}`,
      },
      {
        label: `View Testimonials`,
      },
    ];
  };
// Certificate Request

export const request_certificate = (name) => {
    return [
      {
        label: "Certificate Requests",
        path: `/all-request?type=certificate_request`,
      },
      {
        label: `View Request Member List`,
      },
    ];
  };
// Report Request

export const request_report = (name) => {
    return [
      {
        label: "Report Requests",
        path: `/all-request?type=report_request`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };

// Program Join Request

export const request_join = (name) => {
    return [
      {
        label: "Join Requests",
        path: `/all-request?type=program_request&tabType=${requestPageBreadcrumbs?.program_join}&mainTab=${requestPageBreadcrumbs.main_mentee_tab}`,
      },
      {
        label: name?`View ${name}`:`View Mentee Profile`,
      },
    ];
  };

// Admin Report 
export const admin_report = (name) => {
    return [
      {
        label: "Reports",
        path: `/reports`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const admin_Approvedreport = (name) => {
    return [
      {
        label: "Approved Reports",
        path: `/reports?type=${requestPageBreadcrumbs?.adminApproveReportTab}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const admin_Canceledreport = (name) => {
    return [
      {
        label: "Cancelled Reports",
        path: `/reports?type=${requestPageBreadcrumbs?.adminCancelReportTab}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
  export const admin_Allreport = (name) => {
    return [
      {
        label: "My Reports",
        path: `/reports?Type=${requestPageBreadcrumbs?.adminReportTab}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
// Mentor Report
export const mentor_allreport = (name) => {
  return [
    {
      label: "All Reports",
      path: `/reports`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const mentor_Newreport = (name) => {
  return [
    {
      label: "New Reports",
      path: `/reports?tabType=${requestPageBreadcrumbs?.menteeNewReport}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const mentor_Pendingreport = (name) => {
  return [
    {
      label: "Pending Reports",
      path: `/reports?tabType=${requestPageBreadcrumbs?.menteePendingReport}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const mentor_Completedreport = (name) => {
  return [
    {
      label: "Completed Reports",
      path: `/reports?tabType=${requestPageBreadcrumbs?.menteeCompletedReport}&tr=fsdbj`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const mentor_Rejectedreport = (name) => {
  return [
    {
      label: "Rejected Reports",
      path: `/reports?tabType=${requestPageBreadcrumbs?.menteeRejectedReport}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
export const mentor_Draftreport = (name) => {
  return [
    {
      label: "Draft Reports",
      path: `/reports?tabType=${requestPageBreadcrumbs?.menteeDraftReport}`,
    },
    {
      label: `View ${name}`,
    },
  ];
};
//Mentor Edit Report
export const mentor_edit_allreport = (name) => {
  return [
    {
      label: "All Reports",
      path: `/reports`,
    },
    {
      label: `${name}`,
    },
  ];
};
export const mentor_edit_newreport = (name) => {
  return [
    {
      label: " New Reports",
      path: `/reports?type=${requestPageBreadcrumbs?.mentorNewEditReport}`,
    },
    {
      label: `${name}`,
    },
  ];
};
export const mentor_edit_pendingreport = (name) => {
  return [
    {
      label: "Pending Reports",
      path: `/reports?type=${requestPageBreadcrumbs?.mentorPendingEditReport}`,
    },
    {
      label: `${name}`,
    },
  ];
};
export const mentor_edit_draftreport = (name) => {
  return [
    {
      label: "Draft Reports",
      path: `/reports?type=${requestPageBreadcrumbs?.mentorDraftEditReport}`,
    },
    {
      label: `${name}`,
    },
  ];
};
// My Certificate

export const adminMy_certificate = (name) => {
    return [
      {
        label: "Certificate Requests",
        path: `/certificates?tabType=${requestPageBreadcrumbs?.adminCertificateTab}`,
      },
      {
        label: `View Accepted Member List`,
      },
    ];
  };
  export const adminMy_approvedCertificate = (name) => {
    return [
      {
        label: "Approved Certificate Requests",
        path: `/certificates?tabType=${requestPageBreadcrumbs?.adminCertificateApproveReportTab}`,
      },
      {
        label: `View Accepted Member List`,
      },
    ];
  };
// Mentor Certificate
export const wait_certificate = (name) => {
  return [
    {
      label: "Waiting Certificates Request",
      path: `/certificates?tabType=${requestPageBreadcrumbs?.waitCertificateTab}`,
    },
    {
      label: `View Member List`,
    },
  ];
};
export const pending_Certificate = (name) => {
  return [
    {
      label: "Pending Certificates Request",
      path: `/certificates?tabType=${requestPageBreadcrumbs?.pendingCertificateTab}`,
    },
    {
      label: `View Member List`,
    },
  ];
};
export const Approved_Certificate = (name) => {
  return [
    {
      label: "Generated Certificates Request",
      path: `/certificates?tabType=${requestPageBreadcrumbs?.approvedCertificateTab}`,
    },
    {
      label: `View Approved Certificates`,
    },
  ];
};
export const mentorGeneratedCertificate = (name) => {
  return [
    {
      label: "Generated Certificate Requests",
      path: `/certificates?tabType=${requestPageBreadcrumbs?.adminCertificateApproveReportTab}`,
    },
    {
      label: `View Accepted Member List`,
    },
  ];
};

// Mentee Certificate
export const mentee_Certificate_list = (name) => {
  return [
    {
      label: "Certificates",
      path: -1,
    },
    {
      label: `View Certificate`,
    },
  ];
};

// Member List
export const admin_mentorMember = (name) => {
    return [
      {
        label: "Users",
        path: `/members`,
      },
      {
        label: `User Profile`,
      },
    ];
  };
export const admin_menteeMember = (name) => {
    return [
      {
        label: "Users",
        path: `/members`,
      },
      {
        label: `User Profile`,
      },
    ];
  };

// Program Details Page
  export const program_details_main = (name,statusName) => {
    return [
      {
        label: `${statusName}`,
        path: -1,
      },
      {
        label: `${name}`,
      },
    ];
  };
  export const dashboard_program_details_main = (name,statusName) => {
    return [
      {
        label: `Dashboard`,
        path: "/dashboard", // Corrected: Use string instead of navigate function
      },
      {
        label: `${name}`,
      },
    ];
  };


// Feed

export const user_feed = (name) => {
    return [
      {
        label: `Feeds`,
        path: -1,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const dashboard_feed = (name) => {
    return [
      {
        label: `Dashboard`,
        path: -1,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const user_Defaultfeed = (name) => {
    return [
      {
        label: `Feeds`,
        path: `/feeds`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };

// Mentee Nav tab

export const myMneteePage = () => {
    return [
      {
        label: `My Mentees`,
        path: `/mentees?req=my-mentee`,
      },
      {
        label: `View Mentee Profile`,
      },
    ];
  };
export const newFollowRequestPage = (status) => {
    return [
      {
        label: `Follow Requests`,
        path: `/mentees?req=new-request-mentees&status=${status}`,
      },
      {
        label: `View Mentee Profile`,
      },
    ];
  };

// Mentor Nav Tab
export const myMentorPage = () => {
  return [
    {
      label: `My Mentors`,
      path: `/mentors`,
    },
    {
      label: `View Mentors Profile`,
    },
  ];
};
export const topMentorPage = () => {
  return [
    {
      label: `Top Mentors`,
      path: `/mentors?req=topmentor`,
    },
    {
      label: `View Mentors Profile`,
    },
  ];
};
export const newFollowRequestMentorPage = (status) => {
  return [
    {
      label: `Follow Mentors`,
      path: `/mentors?req=requestmentor&status=${status}`,
    },
    {
      label: `View Mentor Profile`,
    },
  ];
};


 // Goals

 export const goal_history = (name, queryString) => {
  // Set label based on queryString value
  let label = queryString === "mentor" ? "Mentor Goals" : "Mentee Goals";

  // Build query string correctly
  const query = queryString === "mentor" || "mentee" ? `?created_by=${queryString}` : `?adminTabType=${queryString}`;

  return [
    {
      label: label,
      path: `/goals${query}`, // Properly concatenated query string
    },
    {
      label: `View ${name}`,
      path: `/goals/view?name=${encodeURIComponent(name)}`, // Optional path for "View"
    },
  ];
};
  export const goal_active = (name,queryString) => {
     const query=queryString?`&adminTabType=${queryString}`:""
    return [
      {
        label: "Active Goals",
        path: `/goals?type=active${query}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
  export const goal_progress = (name,queryString) => {
     const query=queryString?`&adminTabType=${queryString}`:""
    return [
      {
        label: "Goals in Progress",
        path: `/goals?type=in_progress${query}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
  export const goal_completed = (name,queryString) => {
     const query=queryString?`&adminTabType=${queryString}`:""
    return [
      {
        label: "Completed Goals",
        path: `/goals?type=completed${query}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
  export const goal_cancelled = (name,queryString) => {
     const query=queryString?`&adminTabType=${queryString}`:""
    return [
      {
        label: "Cancelled Goals ",
        path: `/goals?type=cancel${query}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
  export const mentee_goal_view = (name) => {
    
    return [
      {
        label: "Mentee Goals",
        path: `/goals?mentortab=mentee`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
  export const goal_program_details = (name) => {
    
    return [
      {
        label: "Program Detail",
        path: -1,
      },
      {
        label: `View ${name}`,
      },
    ];
  };

  // Task
  
  export const allTask = (name) => {
    
    return [
      {
        label: "All Interaction Points",
        path: `/mentee-tasks`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const newTask = (name) => {
    
    return [
      {
        label: "New Interaction Points",
        path: `/mentee-tasks?type=newtask`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const pendingTask = (name) => {
    
    return [
      {
        label: "Pending Interaction Points",
        path: `/mentee-tasks?type=pending`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const waitTask = (name) => {
    
    return [
      {
        label: "Waiting Interaction Points",
        path: `/mentee-tasks?type=waiting_for_approval`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const reassignTask = (name) => {
    
    return [
      {
        label: "Reassigned Interaction Points",
        path: `/mentee-tasks?type=reassigned`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const completedTask = (name) => {
    
    return [
      {
        label: "Completed Interaction Points",
        path: `/mentee-tasks?type=completed`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const rejectedTask = (name) => {
    
    return [
      {
        label: "Cancelled Interaction Points",
        path: `/mentee-tasks?type=rejected`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const draftTask = (name) => {
    
    return [
      {
        label: "Draft Interaction Points",
        path: `/mentee-tasks?type=draft`,
      },
      {
        label: `View ${name}`,
      },
    ];
  }; 
  export const viewTasksDetails = (name,taskName) => {
    
    return [
      {
        label: "Mentees Interaction Points",
        path: "/mentor-tasks?type=menteetask",
      },
      {
        label: `${name}`,
        path:-1
      },
      {
        label: `View ${taskName}`,
      },
    ];
  }; 

// Program Completion Page
export const programCompletionPage = (name) => {
    
  return [
    {
      label: "Programs",
      path: `/programs`,
    },
    {
      label: `${name}`,
      path: -1,
    },
    {
      label: `Completed`,
    },
  ];
}; 
// Category View

export const categoryMentee = (name) => {
    
  return [
    {
      label: "Category",
      path: `/mentee-tasks?type=completed`,
    },
    {
      label: `View ${name}`,
    },
  ];
}; 
export const categoryMentor = (name) => {
  
  return [
    {
      label: "Category",
      path: `/mentee-tasks?type=rejected`,
    },
    {
      label: `View ${name}`,
    },
  ];
}; 
export const categoryProgramList = (name) => {
  
  return [
    {
      label: "Category",
      path: `/mentee-tasks?type=draft`,
    },
    {
      label: `View ${name}`,
    },
  ];
}; 
// Tickets History View
export const ticketHistoryView = (name) => {
  
  return [
    {
      label: "History",
      path:-1,
    },
    {
      label: `View New Ticket`,
    },
  ];
}; 

export const tabQuertyData = (role, tab) => {
  if (role === "admin") {
    return requestPageBreadcrumbs[tab];
  }
};
export const tabQuertyDataMentor = (role, tab) => {
  if (role === "mentor") {
    return requestPageBreadcrumbs[tab];
  }
};

export const programProfileBreadCrumb = () => {
  return [
    {
      label: `Program`,
      path: `/programs`,
    },
    {
      label: `View Mentee Profile`,
    },
  ];
};
export const programcardDashBoard = () => {
  return [
    {
      label: `Dashboard`,
      path: -1,
    },
    {
      label: `View Profile`,
    },
  ];
};
export const programcardProgrampage = () => {
  return [
    {
      label: `Programs`,
      path: -1,
    },
    {
      label: `View Profile`,
    },
  ];
};
export const programDetailsProfile = () => {
  return [
    {
      label: `Program Details`,
      path: -1,
    },
    {
      label: `View Profile`,
    },
  ];
};

export const topmentorDashBoard = () => {
  return [
    {
      label: `Dashboard`,
      path: -1,
    },
    {
      label: `View Profile`,
    },
  ];
};

export const memberMentorDashBoard = () => {
  return [
    {
      label: `Dashboard`,
      path: -1,
    },
    {
      label: `Users`,
    },
  ];
};
export const memberMenteeDashBoard = () => {
  return [
    {
      label: `Dashboard`,
      path: -1,
    },
    {
      label: `Users`,
    },
  ];
};

// export const navbarProfile = () => {
//   return [
//     {
//       label: `Dashboard`,
//       path: -1,
//     },
//     {
//       label: `Profile`,
//     },
//   ];
// };

//Tickets Breadcrumbs
export const allTicket = (name) => {
    
  return [
    {
      label: "All Tickets",
      path: `/ticket-history?tab=all`,
    },
    {
      label: `View Tickets`,
    },
  ];
};

export const newTicket = (name) => {
    
  return [
    {
      label: "New Tickets",
      path: `/ticket-history?tab=new`,
    },
    {
      label: `View Tickets`,
    },
  ];
}; 
export const pendingTicket = (name) => {
  
  return [
    {
      label: "Pending Tickets",
      path: `/ticket-history?tab=pending`,
    },
    {
      label: `View Tickets`,
    },
  ];
}; 
export const inprogressTicket = (name) => {
  
  return [
    {
      label: "Inprogress Tickets",
      path: `/ticket-history?tab=in_progress`,
    },
    {
      label: `View Tickets`,
    },
  ];
}; 
export const closedTicket = (name) => {
  
  return [
    {
      label: "Closed Tickets",
      path: `/ticket-history?tab=closed`,
    },
    {
      label: `View Tickets`,
    },
  ];
}; 
export const resolvedTickets = (name) => {
  
  return [
    {
      label: "Resolved Tickets",
      path: `/ticket-history?tab=resolved`,
    },
    {
      label: `View Tickets`,
    },
  ];
}; 
 
export const rejectedTicket = (name) => {
  
  return [
    {
      label: "Rejected Tickets",
      path: `/ticket-history?tab=rejected`,
    },
    {
      label: `View Tickets`,
    },
  ];
}; 

//mentor dashboard program
export const request_mentor_dashboardprogram = (name, type, typeLabel) => {
  const path = type ? `/dashboard?type=${type}` : `/dashboard`; // Fallback if type is null

  return [
    {
      label: typeLabel, // Correct label
      path: path,       // Dynamic path with fallback
    },
    {
      label: `View ${name}`,
    },
  ];
};

//Admin Member Chat

export const adminMemberChat = (name) => {
  
  return [
    {
      label: "Members",
      path: `/members`,
    },
    {
      label: `View Chat`,
    },
  ];
}; 

export const menteesProfileCounts = (name) => {
  
  return [
    {
      label: "Joined Mentees",
      path: -1,
    },
    {
      label: `Profile`,
    },
  ];
}; 