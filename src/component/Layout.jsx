import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from '../shared'
import { useSelector } from 'react-redux';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector(state => state.userInfo);

  const { pathname } = location
  const role = userInfo.data.role || ''
  // console.log('location', location)

  // useEffect(() => {
  //   if (userInfo.data.role === 'fresher') { navigate('/login-type'); }
  //   if(!userInfo.data.is_registered) navigate('/questions')
  // }, [])
  return (
    <div>
      <Navbar />
      <div className="secondary-menu py-8" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)' }}>
        <ul className="flex flex-col gap-20 justify-center items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
          <li className={`${pathname === '/dashboard' ? 'dashboard-menu-active' : ''}`}>
            <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 rounded md:p-0 cursor-pointer" aria-current="page">Dashboard</span>
          </li>
          <li className={`${pathname === '/programs' ? 'dashboard-menu-active' : ''}`}>
            <span onClick={() => navigate('/programs')} className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer">Programs</span>
          </li>
          {
            role === 'mentee' &&
            <li className={`${pathname === '/mentors' ? 'dashboard-menu-active' : ''}`}>
              <span onClick={() => navigate('/mentors')} className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer">Mentors</span>
            </li>
          }

          {
            role === 'mentor' &&
            <li className={`${pathname === '/mentees' ? 'dashboard-menu-active' : ''}`}>
              <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer">Mentees</span>
            </li>
          }

          <li>

            <div className="relative inline-block text-left">
              <div>
                <button type="button" className="inline-flex w-full justify-center gap-x-1.5  px-3 py-2 text-gray-900" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  Objectives
                  <svg className="-mr-1 h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {/* <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <div className="py-1" role="none">
                  <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</a>
                </div>
              </div> */}
            </div>
          </li>
          <li className={`${pathname === '/calendar' ? 'dashboard-menu-active' : ''}`}>
            <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer">Calendar</span>
          </li>
          <li className={`${pathname === '/discussions' ? 'dashboard-menu-active' : ''}`}>
            <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0 cursor-pointer">Discussions</span>
          </li>
          <li>
            <div className="relative inline-block text-left">
              <div>
                <button type="button" className="inline-flex w-full justify-center gap-x-1.5  px-3 py-2  text-gray-900" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  More
                  <svg className="-mr-1 h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {/* <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <div className="py-1" role="none">
                  <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</a>
                </div>
              </div> */}
            </div>
          </li>
        </ul>

      </div>
      <Outlet />
    </div>
  )
}
