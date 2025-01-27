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
};
export const programStatusBreadcrumbs=[
    'All Programs',
    'Active Programs',
    'Recently Joined Programs',
    'Ongoing Programs',
    'Assign Programs',
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
      label: "New Program Requests",
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
      label: "Program Reschedule Requests",
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
      label: "Program Cancel Requests",
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
      label: "Program Cancel Requests",
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
      label: state === "category" ? "Category View" : "Program",
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
        label: "New Goal Requests",
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
        label: "Program Join Requests",
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
        label: "Reports",
        path: `/reports?tabType=${requestPageBreadcrumbs?.adminApproveReportTab}`,
      },
      {
        label: `View ${name}`,
      },
    ];
  };
export const admin_Canceledreport = (name) => {
    return [
      {
        label: "Reports",
        path: `/reports?tabType=${requestPageBreadcrumbs?.adminCancelReportTab}`,
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
      label: "Reports",
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
      label: "Reports",
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
      label: "Reports",
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
      label: "Reports",
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
      label: "Reports",
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
      label: "Reports",
      path: `/reports?tabType=${requestPageBreadcrumbs?.menteeDraftReport}`,
    },
    {
      label: `View ${name}`,
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
        label: "Certificate Requests",
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
      label: "Generate Certificates Request",
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
      label: "Generate Certificates Request",
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
      label: "Generate Certificates Request",
      path: `/certificates?tabType=${requestPageBreadcrumbs?.approvedCertificateTab}`,
    },
    {
      label: `View Approved Certificates`,
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
        label: "Members",
        path: `/members?tabType=${requestPageBreadcrumbs?.adminMemberMentorTab}`,
      },
      {
        label: `Mentor Profile`,
      },
    ];
  };
export const admin_menteeMember = (name) => {
    return [
      {
        label: "Members",
        path: `/members?tabType=${requestPageBreadcrumbs?.adminMemberMenteeTab}`,
      },
      {
        label: `Mentee Profile`,
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
        path: -1,
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
        path: `/feeds`,
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

  export const goal_history = (name,queryString) => {
      const query=queryString?`?adminTabType=${queryString}`:""
    return [
      {
        label: "Goals",
        path: `/goals${query}`,
      },
      {
        label: `View ${name}`,
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "Tasks",
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
        label: "MenteesTask",
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