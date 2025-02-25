import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/SearchColor.svg";
import MaleIcon from "../../assets/images/male-profile1x.png";
import FemaleIcon from "../../assets/images/female-profile1x.png";
import UserIcon from "../../assets/icons/user-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  userActivities,
  userActivitiyVisited,
} from "../../services/activities";
import { getTimeFromDate, NotificationImg, useDebounce } from "../../utils";
import { useNavigate } from "react-router-dom";
import { handleNotificationNavigation } from "./CommenFunction";

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

  const handleVisitActivity = (notificationData) => {
    handleNotificationNavigation(notificationData, navigate, role, dispatch, userActivitiyVisited,);
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
                      src={
                        list?.profile_details?.profile_image
                          ? list?.profile_details?.profile_image
                          : UserIcon
                      }
                      alt="MaleIcon"
                      className="w-[40px] h-[40px]"
                    />
                    {/* <NotificationImg data={list?.profile_details?.profile_image?data?.profile_details?.profile_image:UserIcon}/> */}
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
