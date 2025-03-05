export const handleNotificationNavigation = (data, navigate, role, dispatch, userActivitiyVisited, handleClose = null) => {
    // Mark notification as visited
    // dispatch(userActivitiyVisited(data.id));
    // console.log(data,"notifications")
    const actionType = data?.notification_type;
    
    switch (actionType) {
      case "program":
        const baseUrl = `/program-details/${data.related_data?.program_id}`;
        const requestId = data.related_data?.program_request_id;
        const requestType = data.related_data?.request_type;
        
        handleClose && handleClose();
        
        navigate(
          requestId
            ? `${baseUrl}?request_id=${requestId}${
                requestType ? `&type=${requestType}` : ""
              }`
            : baseUrl
        );
        break;
        
      case "task":
        const url =
          role === "mentee"
            ? `/mentee-tasks-details/${data.related_data.task_id}`
            : `/viewTask/${data.related_data.task_id}`;
        
        handleClose && handleClose();
        navigate(url);
        break;
        
      case "goal":
        const Goalurl =
          role === "mentee" || role === "mentor"
            ? `/view-goal/${data.related_data.goal_id}`
            : `/view-goal/${data.related_data.goal_id}?requestId=${data.related_data.goal_request_id}`;
        
        handleClose && handleClose();
        navigate(Goalurl);
        break;
        
      case "report":
        const reporturl =
          role === "mentor"
            ? `/view-report/${data.related_data.report_id}`
            : `/view-report/${data.related_data.report_id}`;
        
        handleClose && handleClose();
        navigate(reporturl);
        break;
        
      case "member":
        const memberurl =
          role === "mentor" || role === "admin"
            ? data.related_data?.program_request_id
              ? `/mentee-details/${data.related_data.member_id}?type=mentee_request&request_id=${
                  data.related_data?.program_request_id
                }${role === "admin" ? "&from=program_join" : ""}`
              : `/mentee-details/${data.related_data.member_id}`
            : `mentor-details/${data.related_data.member_id}?request_id=${data.related_data?.member_request_id}`;
        
        handleClose && handleClose();
        
        navigate(
          memberurl,
          (role === "mentor" || role === "admin") &&
            data.related_data?.program_request_id
            ? {
                state: {
                  data: {
                    id: data.related_data?.program_request_id,
                    status: "new",
                  },
                },
              }
            : {}
        );
        break;
        
      case "follow":
        const followurl =
          role === "mentor"
            ? `/mentee-details/${data.related_data.member_id}`
            : `/mentee-details/${data.related_data.member_id}`;
        
        handleClose && handleClose();
        navigate(followurl);
        break;
        
      case "certificate":
        const certificateurl =
          role === "mentor"
            ? `/certificate_mentees/${data.related_data.program_id}`
            : role === "mentee"
            ? "/certificates"
            : `/certificate_mentees/${data.related_data.program_id}?request_id=${data.related_data?.certificate_id}`;
        
        handleClose && handleClose();
        
        navigate(
          certificateurl,
          role === "mentor"
            ? {
                state: {
                  status: "approved",
                },
              }
            : role === "admin"
            ? {
                state: {
                  rowId: data.related_data?.certificate_id,
                  status: "new",
                },
              }
            : {}
        );
        break;
        
      default:
        // Navigate to the all notifications page
        handleClose && handleClose();
        navigate("/notification");
        break;
    }
  };