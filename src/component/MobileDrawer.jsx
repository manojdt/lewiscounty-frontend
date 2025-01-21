import React, { useState } from "react";
import { Backdrop } from "@mui/material";
import { Button } from "../shared";
import LogoutIcon from "../assets/icons/Logout.svg";
import LogoutColorIcon from "../assets/icons/Logoutpop.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import TaskIcon from "../assets/icons/TaskMenu.svg";
import GoalIcon from "../assets/icons/GoalMenu.svg";
import DiscussionIcon from "../assets/icons/discussionIcon.svg";
import FeedbackIcon from "../assets/icons/FeedbackMenu.svg";
import CertificateIcon from "../assets/icons/Certificates.svg";
import FeedIcon from "../assets/icons/Feed.svg";
import ReportIcon from "../assets/icons/Reports.svg";
import HelpIcon from "../assets/icons/Help.svg";
import ProfileIcon from "../assets/icons/Profile.svg";
import UserImage from '../assets/icons/user-icon.svg';


const MenuItem = ({ label, path, icon, onClick, isNested = false, children }) => {
    // If children prop is provided, wrap it with the click handler
    if (children) {
      return (
        <button
          onClick={onClick}
          className={`w-full text-base flex items-center p-4 hover:bg-gray-50 ${
            // isNested ? "pl-8" : ""
            isNested ? "pl-4" : ""

          }`}
        >
          {children}
        </button>
      );
    }
    // Regular menu item without children
  return (
    <button
      onClick={onClick}
      className={`w-full text-base flex items-center p-4 hover:bg-gray-50 ${
        // isNested ? "pl-8" : ""
        isNested ? "pl-4" : ""
      }`}
    >
      {icon && <img src={icon} className="w-6 h-6 mr-3" alt={label} />}
      {label}
    </button>
  );
};

const MobileDrawer = ({ isOpen, onClose }) => {
  const [isLogout, setIsLogout] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state.userInfo);
  const { profile } = useSelector((state) => state.profileInfo);
  const role = userInfo.data.role || "";
  const { pathname } = location;
  const documentUpload =
  window.location.href.includes('mentor-doc-upload') ||
  window.location.href.includes('mentee-doc-upload');

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setIsLogout(true);
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    onClose();
  };

  const getMoreMenuItems = () => {
    const items = [
      {
        label: "Discussions",
        path: "/discussions",
        icon: DiscussionIcon,
      },
      {
        label: "Feedback",
        path: "/feedback",
        icon: FeedbackIcon,
      },
      {
        label: "Certificate",
        path: "/certificates",
        icon: CertificateIcon,
      },
      {
        label: "Feed",
        path: "/feeds",
        icon: FeedIcon,
      },
    ];

    if (role !== "mentee") {
      items.unshift({
        label: "Reports",
        path: "/reports",
        icon: ReportIcon,
      });
    }

    if (role === "admin") {
      items.push(
        {
          label: "BG Verification",
          path: "/bgVerify",
          icon: ReportIcon,
        },
        {
          label: "Mentee Report",
          path: "https://app.powerbi.com/reportEmbed?reportId=6590f3d3-161e-48a2-8481-94d95328eb36&autoAuth=true&ctid=4673b081-e64e-481e-82c9-1eecd44c322a",
          icon: ReportIcon,
          isExternal: true,
        },
        {
          label: "Mentor Report",
          path: "https://app.powerbi.com/reportEmbed?reportId=ad0defeb-0f1e-4556-9e3a-ac7017c87c93&autoAuth=true&ctid=4673b081-e64e-481e-82c9-1eecd44c322a",
          icon: ReportIcon,
          isExternal: true,
        }
      );
    }

    return items;
  };

  const handleHelpClick = () => {
    onClose();
    if (
      userInfo?.data?.role === 'super_admin' &&
      userInfo?.data?.is_registered === true
    ) {
      navigate('/help-admin');
    } else {
      navigate('/help');
    }
  };

  return (
    <div className="contents">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLogout}
      >
        <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
          <img src={LogoutColorIcon} alt="LogoutColorIcon" />
          <span style={{ color: "#232323", fontWeight: 600, fontSize: "24px" }}>
            Log out
          </span>

          <div className="py-5">
            <p
              style={{
                color: "rgba(24, 40, 61, 1)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              Are you sure you want to log out ?
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-6 justify-center align-middle">
              <Button
                btnName="Cancel"
                btnCategory="secondary"
                onClick={() => setIsLogout(false)}
              />
              <Button
                btnType="button"
                btnCls="w-[110px]"
                btnName="Logout"
                btnCategory="primary"
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </Backdrop>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="h-full w-full pl-0">
          <div
            className={`pointer-events-auto h-full w-80 bg-white transform transition-transform duration-300 ease-in-out rounded-r-3xl shadow-xl overflow-y-auto ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col">
              {/* Help and Profile Items */}
              {userInfo?.data?.is_registered && !documentUpload && (
                <div className="border-b">
                  <MenuItem onClick={handleProfile}>
                    <div className="flex items-center w-full">
                      <img
                        src={profile?.image || UserImage}
                        alt="ProfileIcon"
                        className='rounded-3xl object-cover h-8 w-8 cursor-pointer mr-3'
                      />
                      <span>Profile</span>
                    </div>
                  </MenuItem>
                </div>
              )}

              {/* Main Navigation Items */}
              {userInfo?.data?.is_registered && (
                <>
                  <MenuItem
                    label="Dashboard"
                    path="/dashboard"
                    onClick={() => handleNavigation("/dashboard")}
                  />
                  <MenuItem
                    label="Programs"
                    path="/programs"
                    onClick={() => handleNavigation("/programs")}
                  />
                  
                  {role === "mentee" && (
                    <MenuItem
                      label="Mentors"
                      path="/mentors"
                      onClick={() => handleNavigation("/mentors")}
                    />
                  )}
                  
                  {role === "mentor" && (
                    <MenuItem
                      label="Mentees"
                      path="/mentees"
                      onClick={() => handleNavigation("/mentees")}
                    />
                  )}
                  
                  {role === "admin" && (
                    <MenuItem
                      label="Members"
                      path="/members"
                      onClick={() => handleNavigation("/members")}
                    />
                  )}
                  
                  <MenuItem
                    label="My Requests"
                    path="/all-request"
                    onClick={() => handleNavigation("/all-request")}
                  />
                  
                  <MenuItem
                    label="Tasks"
                    path={role === "mentee" ? "/mentee-tasks" : "/mentor-tasks"}
                    // icon={TaskIcon}
                    onClick={() => handleNavigation(role === "mentee" ? "/mentee-tasks" : "/mentor-tasks")}
                  />
                  
                  <MenuItem
                    label="Goals"
                    path="/goals"
                    // icon={GoalIcon}
                    onClick={() => handleNavigation("/goals")}
                  />
                  
                  <MenuItem
                    label="Scheduler"
                    path="/calendar"
                    onClick={() => handleNavigation("/calendar")}
                  />

                  {/* More Menu Button */}
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className="w-full text-base flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <span>More</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isMoreMenuOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* More Menu Items */}
                  {isMoreMenuOpen && (
                    <div className="bg-gray-50">
                      {getMoreMenuItems().map((item, index) => (
                        <MenuItem
                          key={index}
                          label={item.label}
                          path={item.path}
                        //   icon={item.icon}
                          onClick={() => {
                            if (item.isExternal) {
                              window.open(item.path, "_blank");
                            } else {
                              handleNavigation(item.path);
                            }
                          }}
                          isNested={true}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
               <MenuItem onClick={handleHelpClick}>
                    <div className="flex items-center w-full">
                      <img
                        src={HelpIcon}
                        alt="HelpIcon"
                        className="pr-3 w-[30px]"
                      />
                      <span>Help</span>
                    </div>
                  </MenuItem>

              {/* Logout Button */}
              
            </div>
            <div className="flex-1">
            <div className="border-t mt-auto">
                <MenuItem
                  label="Logout"
                  icon={LogoutIcon}
                  onClick={handleLogoutClick}
                />
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;