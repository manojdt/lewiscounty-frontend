export const requestPageBreadcrumbs = {
  program_new: "new_program_request",
  program_reschedule: "program_reschedule",
  program_cancel: "program_cancel",
  program_mentee_cancel: "program_mentee_cancel",
  program_join: "program_join",
  member_join_request:"member_join_request",
  testimonial_request:"testimonial_request",
  certificate_request:"certificate_request",
  report_request:"report_request",
  goal_request:"goal_request",
  mentee:"mentee",
  mentor:"mentor",
  program_join_request_admin:'program_join_request_admin',
  main_mentee_tab:"mentee_tab",
  adminReportTab:"all",
  adminApproveReportTab:"approved",
  adminCancelReportTab:"rejected",
  adminCertificateTab:"all",
  adminCertificateApproveReportTab:"approved",
  adminMemberMentorTab:"mentor",
  adminMemberMenteeTab:"mentee",
  new_goals_request:"new_goals_request",
  feed:'fead',
};
export const programStatusBreadcrumbs=[
    'All Programs',
    'Active Programs',
    'Recently Joined Programs',
    'Ongoing Programs',
    'Assign Programs',
    'Drafted Programs',
    'Bookmarked Programs',
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
export const program_details = (state) => {
  return [
    {
      label: state === "category" ? "Category View" : "Program",
      path: "/programs",
    },
    {
      label: "Program Details",
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
        label: "Testimonials Requests",
        path: `/all-request?type=testimonial_request`,
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
        label: `View Mentee Profile ${name}`,
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
        label: `View ${name}`,
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
