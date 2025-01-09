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
  main_mentee_tab:"mentee_tab"
};

// Program Request
export const request_newProgramRequest = (name) => {
  return [
    {
      label: "New Program Request",
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
      label: "Program Reschedule Request",
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
      label: "Program Cancel Request",
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
      label: "Program Cancel Request",
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
        label: "Member Join Request",
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
        label: "Goal Request",
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
        label: "Goal Request",
        path: `/all-request?type=goal_request&tabType=${requestPageBreadcrumbs?.mentee}${query}`,
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
        label: "Testimonials Request",
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
        label: "Certificate Request",
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
        label: "Report Request",
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
        label: "Program Join Request",
        path: `/all-request?type=program_request&tabType=${requestPageBreadcrumbs?.program_join}&mainTab=${requestPageBreadcrumbs.main_mentee_tab}`,
      },
      {
        label: `View Mentee Profile ${name}`,
      },
    ];
  };
export const tabQuertyData = (role, tab) => {
  if (role === "admin") {
    return requestPageBreadcrumbs[tab];
  }
};
