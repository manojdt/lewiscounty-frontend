import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/SearchColor.svg";
import MaleIcon from "../../assets/images/male-profile1x.png";
import FemaleIcon from "../../assets/images/female-profile1x.png";
import { useDispatch, useSelector } from "react-redux";
import {
  userActivities,
  userActivitiyVisited,
} from "../../services/activities";
import { getTimeFromDate, useDebounce } from "../../utils";
import { useNavigate } from "react-router-dom";

export default function NotificationMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.userInfo);
  const role = data?.role || "";
  const [searchKey, setSearchKey] = useState("");
  const { activity } = useSelector((state) => state.activity);
  const debouncedSearchTerm = useDebounce(searchKey, 500);
  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };
  useEffect(() => {
    dispatch(userActivities({ search: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);
  useEffect(() => {
    dispatch(userActivities());
  }, []);

  const handleNavigation = () => {
    // handleClose && handleClose();
    navigate("/notification");
  };

  const handleVisitActivity = (data) => {
    dispatch(userActivitiyVisited(data.id));
    // console.log(data, "notification");
    const actionType = data?.notification_type;
    switch (actionType) {
      case "program":
        const baseUrl = `/program-details/${data.related_data?.program_id}`;
        const requestId = data.related_data?.program_request_id;
        const requestType = data.related_data?.request_type;
        navigate(requestId ? `${baseUrl}?request_id=${requestId}${requestType ? `&type=${requestType}` : ''}` : baseUrl);
        break;
      case "task":
        const url =
          role === "mentee"
            ? `mentee-tasks-details/${data.related_data.task_id}`
            : `/viewTask/${data.related_data.task_id}`;
        //handleClose && handleClose();
        navigate(url);
        break;
      case "goal":
        const Goalurl =
          role === "mentee" || role === "mentor"
            ? `/view-goal/${data.related_data.goal_id}`
            : `/view-goal/${data.related_data.goal_id}?requestId=${data.related_data.goal_request_id}`;
        //handleClose && handleClose();
        navigate(Goalurl);
        break;
      case "report":
        const reporturl =
          role === "mentor"
            ? `/view-report/${data.related_data.report_id}`
            : `/view-report/${data.related_data.report_id}`;
        //handleClose && handleClose();
        navigate(reporturl);
        break;
      // case 'report':
      //     const reporturl = role === 'mentor' ? `view-report/${data.related_data.report_id}` : `mentor-tasks-details/${data.related_data.report_id}?request_id=${data.related_data?.report_request_id}`
      //     handleClose && handleClose()
      //     navigate(reporturl)
      //     break;
      case "member":
        const memberurl =
        role === "mentor"|| role==="admin"
          ?data.related_data?.program_request_id? `/mentee-details/${data.related_data.member_id}?type=mentee_request&request_id=${data.related_data?.program_request_id}${role==="admin"?'&from=program_join':""}`:`/mentee-details/${data.related_data.member_id}`
          : `mentor-details/${data.related_data.member_id}?request_id=${data.related_data?.member_request_id}`;
      // handleClose && handleClose();
      navigate(
        memberurl,
        (role === "mentor"||role==="admin")&&data.related_data?.program_request_id
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
        navigate(followurl);
        break;
      case "certificate":
        const certificateurl =
          role === "mentor" || role === "mentee"
            ? `/certificate_mentees/${data.related_data.program_id}`
            : `/certificate_mentees/${data.related_data.program_id}?request_id=${data.related_data?.certificate_id}`;
        //handleClose && handleClose();
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
        handleNavigation();
        break;
    }
  };

  return (
    <div className="nofification px-9 py-9">
      <div
        className="px-3 py-5"
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        <div className="flex justify-between px-5 pb-4 mb-8 items-center border-b-2">
          <div className="flex w-full gap-5 items-center justify-between">
            <p style={{ color: "rgba(24, 40, 61, 1)", fontWeight: 700 }}>
              Notification
            </p>
          </div>
        </div>

        <div className="notification-content">
          {activity?.notifications?.length || searchKey !== "" ? (
            <div className="nofification-action">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full p-2 text-sm text-gray-900 border-none bg-background-primary-light"
                  placeholder="Search notification"
                  style={{
                    height: "55px",
                    width: "400px",
                    borderRadius: "6px",
                  }}
                  value={searchKey}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                  <img src={SearchIcon} alt="SearchIcon" />
                </div>
              </div>
            </div>
          ) : null}

          <div className="notification-container">
            {activity?.notifications?.length ? (
              <ul>
                {activity?.notifications?.map((list, index) => (
                  <li
                    key={index}
                    onClick={() => handleVisitActivity(list)}
                    className="cursor-pointer"
                  >
                    <img
                      src={index % 2 === 0 ? MaleIcon : FemaleIcon}
                      alt="MaleIcon"
                    />
                    <div className="flex justify-between w-full">
                      <p className="notification-message">
                        <p className="font-semibold">{list.content}</p>
                        {/* <p className='text-[14px] pt-4 leading-6'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                        nisi ut aliquip ex ea commodo consequat.
                                                    </p> */}
                      </p>
                      <p className="text-[14px]">{list.created_time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No activities found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
