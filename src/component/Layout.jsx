import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../shared";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "primereact/menu";
import ReportIcon from "../assets/icons/Reports.svg";
import FeedbackIcon from "../assets/icons/FeedbackMenu.svg";
import CertificateIcon from "../assets/icons/Certificates.svg";
import ProgramRequestIcon from "../assets/icons/ProgramRequest.svg";
import FeedIcon from "../assets/icons/Feed.svg";
import TaskIcon from "../assets/icons/TaskMenu.svg";
import GoalIcon from "../assets/icons/GoalMenu.svg";
import DiscussionIcon from "../assets/icons/discussionIcon.svg";
import { user } from "../utils/constant";
import { docuSign } from "../services/activities";

export default function Layout({ subheader }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state.userInfo);

  const { pathname } = location;
  const role = userInfo.data.role || "";

  // useEffect(() => {
  //   if (userInfo.data.role === 'fresher') { navigate('/login-type'); }
  //   if(!userInfo.data.is_registered) navigate('/questions')
  // }, [])

  const requestMenu = useRef(null);
  const moreMenu = useRef(null);

  const handleRedirectDocuSign = () => {
    dispatch(docuSign()).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        const url = res?.payload?.url ?? "#";
        window.open(url, "_blank");
      }
    });
  };

  let items = [
    {
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={TaskIcon} alt="TaskIcon" />
          <p>Interaction Point/Task</p>
        </div>
      ),
      command: () =>
        navigate(role === "mentee" ? "/mentee-tasks" : "/mentor-tasks"),
    },
    {
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={GoalIcon} alt="GoalIcon" />
          <p>Goal</p>
        </div>
      ),
      command: () => navigate("/goals"),
    },
  ];

  if (role === "admin") {
    items.unshift({
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={TaskIcon} alt="TaskIcon" />
          <p>Launch Program</p>
        </div>
      ),
      command: () => navigate("/launch-program"),
    });
  }

  let requestMoreItem = [
    {
      label: (
        <div className="flex gap-4 items-center">
          {/* <img className="p-2 h-8" src={DiscussionIcon} alt="DiscussionIcon" /> */}
          <p>Onboarding</p>
        </div>
      ),
      command: () => navigate("/admin-requests?request_type=onboarding"),
    },
    {
      label: (
        <div className="flex gap-4 items-center">
          {/* <img className="p-2 h-8" src={FeedbackIcon} alt="FeedbackIcon" /> */}
          <p>Discharge</p>
        </div>
      ),
      command: () => navigate("/admin-requests?request_type=discharge"),
    },
  ];
  let moreitems = [
    // {
    //   label: (
    //     <div className="flex gap-4 items-center">
    //       <img className="p-2 h-8" src={DiscussionIcon} alt="DiscussionIcon" />
    //       <p>Discussions</p>
    //     </div>
    //   ),
    //   command: () => navigate("/discussions"),
    // },
    {
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={FeedbackIcon} alt="FeedbackIcon" />
          <p>Feedback</p>
        </div>
      ),
      command: () => navigate("/feedback"),
    },
    {
      label: (
        <div className="flex gap-4 items-center">
          <img
            className="p-2 h-8"
            src={CertificateIcon}
            alt="CertificateIcon"
          />
          <p>Certificate</p>
        </div>
      ),
      command: () => navigate("/certificates"),
    },
    {
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={FeedIcon} alt="FeedIcon" />
          <p>Channel</p>
        </div>
      ),
      command: () => navigate("/feeds"),
    },
  ];
  // if (role === "admin") {
  //   moreitems.push({
  //     label: (
  //       <div className="flex gap-4 items-center">
  //         <img className="p-2 h-8" src={ReportIcon} alt="FeedIcon" />
  //         <p>BG Verification</p>
  //       </div>
  //     ),
  //     command: () => navigate("/bgVerify"),
  //   });
  // }

  // if (role === "admin") {
  //   moreitems.push({
  //     label: (
  //       <div className="flex gap-4 items-center">
  //         <img className="p-2 h-8" src={ReportIcon} alt="FeedIcon" />
  //         <p>DocuSign</p>
  //       </div>
  //     ),
  //     command: () => handleRedirectDocuSign(),
  //   });
  // }

  if (role === "admin") {
    moreitems.push({
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={ReportIcon} alt="FeedIcon" />
          <p>Mentee Report</p>
        </div>
      ),
      command: () => {
        window.open(
          "https://app.powerbi.com/reportEmbed?reportId=6590f3d3-161e-48a2-8481-94d95328eb36&autoAuth=true&ctid=4673b081-e64e-481e-82c9-1eecd44c322a",
          "_blank"
        );
      },
    });
  }

  if (role === "admin") {
    moreitems.push({
      label: (
        <div className="flex gap-4 items-center">
          <img className="p-2 h-8" src={ReportIcon} alt="FeedIcon" />
          <p>Mentor Report</p>
        </div>
      ),
      command: () => {
        window.open(
          "https://app.powerbi.com/reportEmbed?reportId=ad0defeb-0f1e-4556-9e3a-ac7017c87c93&autoAuth=true&ctid=4673b081-e64e-481e-82c9-1eecd44c322a",
          "_blank"
        );
      },
    });
  }

  // if (role !== "mentee") {
  //   moreitems.unshift({
  //     label: (
  //       <div className="flex gap-4 items-center">
  //         <img className="p-2 h-8" src={ReportIcon} alt="ReportIcon" />
  //         <p>Reports</p>
  //       </div>
  //     ),
  //     command: () => navigate("/reports"),
  //   });
  // }

  const notValidUser = (userInfo) => {
    if (Object.keys(userInfo?.data).length && !userInfo?.data?.is_registered)
      return true;
  };

  const documentUpload =
    window.location.href.includes("mentor-doc-upload") ||
    window.location.href.includes("mentee-doc-upload") ||
    userInfo?.data?.document_upload;

  // console.log("documentUpload ===>", documentUpload)

  useEffect(() => {
    // if ((userInfo?.data?.userinfo?.approve_status === 'new' || notValidUser(userInfo)) && role !== 'mentee') {
    //   localStorage.removeItem('access_token');
    //   localStorage.removeItem('refresh_token');
    //   navigate('/logout');
    // }
    if (role === "mentor") {
      if (!userInfo.data.is_registered) {
        navigate("/mentor-application-form");
      }
      // if (!userInfo.data.document_upload) {
      //   navigate('/mentor-doc-upload');
      // }
    }

    if (role === "mentee" && !userInfo?.data?.is_registered) {
      navigate("/mentee-questions");
      
    }
  }, [userInfo]);

  return (
    <div>
      <Navbar />
      {!subheader &&
      userInfo?.data?.is_registered &&
      (userInfo?.data?.userinfo?.approve_status === "accept" ||
        role === "admin") &&
      userInfo.data.role !== user.super_admin ? (
        <div
          className="secondary-menu py-8 sm:py-2 md:py-4"
          style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)" }}
        >
          <ul
            // style={{ gap: "40px" }}
            className={`flex ${
              !userInfo?.data?.is_registered ? "ml-[150px]" : "justify-center"
            } items-center p-2 md:p-0 mt-4 border border-gray-100 
          rounded-lg md:space-x-8 rtl:space-x-reverse flex-row md:mt-0 md:border-0`}
          >
            {userInfo?.data?.is_registered && (
              <li
                className={`transition-all duration-300 ${
                  pathname === "/dashboard" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/dashboard?type=yettojoin")}
                  className="block py-2 px-3 sm:py-0 sm:px-0 rounded md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                  aria-current="page"
                >
                  Dashboard
                </span>
              </li>
            )}

            <li
              className={`transition-all duration-300 ${
                pathname === "/programs" ? "dashboard-menu-active" : ""
              }`}
            >
              <span
                onClick={() => navigate("/programs")}
                className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
              >
                Programs
              </span>
            </li>
            {role === "mentee" && userInfo?.data?.is_registered && (
              <li
                className={`transition-all duration-300 ${
                  pathname === "/mentors" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/mentors")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                >
                  Mentors
                </span>
              </li>
            )}

            {role === "mentor" && userInfo?.data?.is_registered && (
              <li
                className={`transition-all duration-300 ${
                  pathname === "/mentees" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/mentees")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                >
                  Mentees
                </span>
              </li>
            )}

            {role === "admin" && (
              <li
                className={`transition-all duration-300 ${
                  pathname === "/members" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/members")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                >
                  Users
                </span>
              </li>
            )}

            {userInfo?.data?.is_registered && (
              <li
                className={`transition-all duration-300 ${
                  pathname === "/all-request" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={(event) => requestMenu.current.toggle(event)}
                  className="py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px] inline-flex w-full justify-center"
                >
                  Requests
                  <svg
                    className="-mr-1 h-6 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <Menu
                  className="custom-menu w-[220px]"
                  model={requestMoreItem}
                  popup
                  ref={requestMenu}
                  popupAlignment="right"
                />
              </li>
            )}

            {/* <li>

              <div className="relative inline-block text-left">
                <div className='drodown'>
                  <button type="button" className="submenu inline-flex w-full justify-center gap-x-1.5  px-3 py-2 text-gray-900"

                    onClick={(event) => menuRight.current.toggle(event)}
                    id="menu-button" aria-expanded="true" aria-haspopup="true">
                    Objectives
                    <svg className="-mr-1 h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <Menu model={items} popup ref={menuRight} popupAlignment="right" />
                </div>

              </div>
            </li> */}

            {userInfo?.data?.is_registered && (
              <>
                <li
                  className={`transition-all duration-300 ${
                    pathname === "/mentee-tasks" || pathname === "/mentor-tasks"
                      ? "dashboard-menu-active"
                      : ""
                  }`}
                >
                  <span
                    onClick={() =>
                      navigate(
                        role === "mentee" ? "/mentee-tasks" : "/mentor-tasks"
                      )
                    }
                    className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                  >
                    Interaction Points/Tasks
                  </span>
                </li>

                {/* <li
                  className={`transition-all duration-300 ${pathname === "/goals" ? "dashboard-menu-active" : ""
                    }`}
                >
                  <span
                    onClick={() => navigate("/goals")}
                    className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                  >
                    Goals
                  </span>
                </li> */}
                {(role === user.admin || role === user.mentor) && (
                  <li
                    className={`transition-all duration-300 ${
                      pathname === "/reports" ? "dashboard-menu-active" : ""
                    }`}
                  >
                    <span
                      onClick={() => navigate("/reports")}
                      className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                    >
                      Reports
                    </span>
                  </li>
                )}
                <li
                  className={`transition-all duration-300 ${
                    pathname === "/calendar" ? "dashboard-menu-active" : ""
                  }`}
                >
                  <span
                    onClick={() => navigate("/calendar")}
                    className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer md:text-[14px] lg:text-[16px]"
                  >
                    Scheduler
                  </span>
                </li>

                <li>
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5  px-3 py-2  text-gray-900 md:text-[14px] lg:text-[16px]"
                        id="menu-button"
                        aria-expanded="true"
                        aria-haspopup="true"
                        onClick={(event) => moreMenu.current.toggle(event)}
                      >
                        More
                        <svg
                          className="-mr-1 h-6 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <Menu
                        className="custom-menu w-[220px]"
                        model={moreitems}
                        popup
                        ref={moreMenu}
                        popupAlignment="right"
                      />
                    </div>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
      <Outlet />
    </div>
  );
}
