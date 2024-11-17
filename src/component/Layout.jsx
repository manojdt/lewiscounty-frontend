import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from '../shared'
import { useSelector } from 'react-redux';
import { Menu } from 'primereact/menu';
import ReportIcon from '../assets/icons/Reports.svg'
import FeedbackIcon from '../assets/icons/FeedbackMenu.svg'
import CertificateIcon from '../assets/icons/Certificates.svg'
import ProgramRequestIcon from '../assets/icons/ProgramRequest.svg'
import FeedIcon from '../assets/icons/Feed.svg'
import TaskIcon from '../assets/icons/TaskMenu.svg'
import GoalIcon from '../assets/icons/GoalMenu.svg'
import DiscussionIcon from '../assets/icons/discussionIcon.svg'

export default function Layout({ subheader }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector(state => state.userInfo);

  const { pathname } = location
  const role = userInfo.data.role || ''

  // useEffect(() => {
  //   if (userInfo.data.role === 'fresher') { navigate('/login-type'); }
  //   if(!userInfo.data.is_registered) navigate('/questions')
  // }, [])


  const menuRight = useRef(null);
  const moreMenu = useRef(null);

  let items = [
    {
      label: <div className='flex gap-4 items-center'>
          <img src={TaskIcon} alt="TaskIcon" />
          <p>Task</p>
      </div>,
      command: () => navigate(role === 'mentee' ? '/mentee-tasks' : '/mentor-tasks')
    },
    {
      label: <div className='flex gap-4 items-center'>
          <img src={GoalIcon} alt="GoalIcon" />
          <p>Goal</p>
      </div>,
      command: () => navigate('/goals')
    },
  ];

  if (role === 'admin') {
    items.unshift({
      label: <div className='flex gap-4 items-center'>
          <img src={TaskIcon} alt="TaskIcon" />
          <p>Launch Program</p>
      </div>,
      command: () => navigate('/launch-program')
    })
  }

  let moreitems = [
    {
      label: <div className='flex gap-4 items-center'>
          <img src={DiscussionIcon} alt="DiscussionIcon" />
          <p>Discussions</p>
      </div>,
      command: () => navigate('/discussions')
    },
    {
      label: <div className='flex gap-4 items-center'>
          <img src={FeedbackIcon} alt="FeedbackIcon" />
          <p>Feedback</p>
      </div>,
      command: () => navigate('/feedback')
    },
    {
      label: <div className='flex gap-4 items-center'>
          <img src={CertificateIcon} alt="CertificateIcon" />
          <p>Certificate</p>
      </div>,
      command: () => navigate('/certificates')
    },
    // {
    //   label: <div className='flex gap-4 items-center'>
    //       <img src={FeedIcon} alt="FeedIcon" />
    //       <p>Feed</p>
    //   </div>,
    //   command: () => navigate('/feeds')
    // },


  ];

  if (role !== 'mentee') {
    moreitems.unshift({

      label: <div className='flex gap-4 items-center'>
          <img src={ReportIcon} alt="ReportIcon" />
          <p>Reports</p>
      </div>,
      command: () => navigate('/reports')
    },
    )
  }

  const notValidUser = (userInfo) => {
    if (Object.keys(userInfo?.data).length && !userInfo?.data?.is_registered) return true
  }

  const documentUpload = window.location.href.includes('mentor-doc-upload') || window.location.href.includes('mentee-doc-upload')

  useEffect(() => {
    if ((userInfo?.data?.userinfo?.approve_status === 'new' || notValidUser(userInfo)) && role !== 'mentee') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/logout');
    }

    if(role === 'mentee' && !userInfo?.data?.is_registered){
      navigate('/programs')
    }
  }, [userInfo])

  return (
    <div>
      <Navbar />
      {!subheader && userInfo?.data?.is_registered && !documentUpload  ? (
        <div
          className="secondary-menu py-8"
          style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)" }}
        >
          <ul style={{ gap: '40px' }} className={`flex flex-col ${!userInfo?.data?.is_registered ? 'ml-[150px]' : 'justify-center'} items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 
          rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0`}>
            {userInfo?.data?.is_registered && (
              <li
                className={`${
                  pathname === "/dashboard" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/dashboard")}
                  className="block py-2 px-3 rounded md:p-0 cursor-pointer"
                  aria-current="page"
                >
                  Dashboard
                </span>
              </li>
            )}

            <li
              className={`${
                pathname === "/programs" ? "dashboard-menu-active" : ""
              }`}
            >
              <span
                onClick={() => navigate("/programs")}
                className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
              >
                Programs
              </span>
            </li>
            {role === "mentee" && userInfo?.data?.is_registered && (
              <li
                className={`${
                  pathname === "/mentors" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/mentors")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                >
                  Mentors
                </span>
              </li>
            )}

            {role === "mentor" && userInfo?.data?.is_registered && (
              <li
                className={`${
                  pathname === "/mentees" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/mentees")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                >
                  Mentees
                </span>
              </li>
            )}

            {role === "admin" && (
              <li
                className={`${
                  pathname === "/members" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/members")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                >
                  Members
                </span>
              </li>
            )}

            {userInfo?.data?.is_registered && (
              <li
                className={`${
                  pathname === "/all-request" ? "dashboard-menu-active" : ""
                }`}
              >
                <span
                  onClick={() => navigate("/all-request")}
                  className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                >
                  My Request
                </span>
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
                  className={`${
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
                    className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                  >
                    Task
                  </span>
                </li>

                <li
                  className={`${
                    pathname === "/goals" ? "dashboard-menu-active" : ""
                  }`}
                >
                  <span
                    onClick={() => navigate("/goals")}
                    className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                  >
                    Goals
                  </span>
                </li>

                <li
                  className={`${
                    pathname === "/calendar" ? "dashboard-menu-active" : ""
                  }`}
                >
                  <span
                    onClick={() => navigate("/calendar")}
                    className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer"
                  >
                    Scheduler
                  </span>
                </li>

                <li>
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5  px-3 py-2  text-gray-900"
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
