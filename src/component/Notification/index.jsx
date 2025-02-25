import React, { useEffect } from "react";
import MaleIcon from "../../assets/images/male-profile1x.png";
import FemaleIcon from "../../assets/images/female-profile1x.png";
import RightArrowIcon from "../../assets/icons/RightSingleArrow.svg";
import { useNavigate } from "react-router-dom";
import { getTimeFromDate, NotificationImg } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  userActivities,
  userActivitiyVisited,
} from "../../services/activities";
import UserIcon from "../../assets/icons/user-icon.svg";
import { handleNotificationNavigation } from "./CommenFunction";
export default function Notification({ handleClose }) {
  const { activity, loading } = useSelector((state) => state.activity);
  const { data } = useSelector((state) => state.userInfo);
  const role = data?.role || "";
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleNavigation = () => {
    handleClose && handleClose();
    navigate("/notification");
  };

  const handleVisitActivity = (notificationData) => {
    handleNotificationNavigation(notificationData, navigate, role, dispatch, userActivitiyVisited, handleClose);
  };

  useEffect(() => {
    dispatch(userActivities());
  }, []);

  return (
    <div className="notification-container">
      <div className="title">Notifications</div>
      {
        // !loading ? (
        <>
          {activity?.notifications?.length ? (
            <ul>
              {activity?.notifications?.map((list, index) => {
                return (
                  <li
                    className="notification-list cursor-pointer items-center"
                    onClick={() => handleVisitActivity(list)}
                    key={index}
                  >
                    <img
                      src={list?.profile_details?.profile_image?list?.profile_details?.profile_image:UserIcon}
                      alt="MaleIcon"
                      className="w-[40px] h-[40px]" 
                    />
                         {/* <NotificationImg data={list?.profile_details?.profile_image?list?.profile_details?.profile_image:UserIcon}/> */}
                    <p className="notification-message">{list.content}</p>
                    <p className="text-[12px]">{list.created_time}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-2 py-3">No activities found</div>
          )}
          {activity?.notifications?.length ? (
            <div className="py-4 w-full">
              <button
                className="py-3 px-16 bg-gradient-to-br from-[#1D5BBF] to-[#00AEBD] text-white text-[14px] w-full flex items-center justify-center"
                style={{
                  // background: '#EEF5FF',
                  borderRadius: "5px",
                }}
                onClick={handleNavigation}
              >
                See all notifications
                <span className="pl-8 pt-1">
                  <img
                    style={{ width: "22px", height: "22px" }}
                    src={RightArrowIcon}
                    alt="RightArrowIcon"
                  />
                </span>
              </button>
            </div>
          ) : null}
        </>
        // ) : (
        //   <div>Loading...</div>
        // )
      }
    </div>
  );
}
