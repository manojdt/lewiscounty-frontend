import React from "react";
import { Button, Navbar } from '../../shared';
import UserImage from "../../assets/images/user.jpg";
import StatisticsImage from "../../assets/icons/statistics.svg";
import UserIcon from "../../assets/icons/user.svg";
import CalendarImage from '../../assets/icons/calendar.svg';
import { menusList, Impressions, Teams, recentActivities, curatedPrograms } from '../../utils/mock'
import './dashboard.css';

export const Dashboard = () => {
  return (
    <>
      <Navbar />


      <div className="py-8" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)' }}>
        <ul className="flex flex-col gap-20 justify-center items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
          <li className="dashboard-menu-active">
            <a href="/" className="block py-2 px-3 rounded md:p-0" aria-current="page">Dashboard</a>
          </li>
          <li>
            <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Programs</a>
          </li>
          <li>
            <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Mentees</a>
          </li>
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
          <li>
            <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Calendar</a>
          </li>
          <li>
            <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Discussions</a>
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

      <div className="dashboard-content px-8 mt-10">

        <div className="grid grid-cols-5 gap-3">
          <div className="row-span-3 flex flex-col gap-8">

            <div className="pb-3 w-full max-w-sm bg-white rounded-lg" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 1)' }}>
              <div className="flex flex-col items-center pb-10 pt-14 border-b-2">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover" src={UserImage} alt="User logo" />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">John Doe</h5>
                <span className="text-sm text-gray-500  pb-5" style={{
                  color: 'rgba(35, 35, 35, 1)'
                }}>Visual Designer</span>
                <span className="text-sm text-gray-500 ">Mentor | Teaching Proffessional</span>
              </div>

              <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
                {
                  menusList.map((menu, index) => <li className="" key={index}>
                    <a href="/" className="flex justify-between py-2 px-6 rounded" aria-current="page">
                      <span className="text-sm">{menu.name}</span>
                      <span className="text-base">{menu.count}</span>
                    </a>
                  </li>)
                }
              </ul>
            </div>

            {/* Views and Impressions */}
            <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-3 px-4 border-b-2">
                <h4 className="text-base">Views and Impressions</h4>
                <p className="text-sm leading-8">Today</p>
              </div>
              <ul className="flex flex-col gap-1 p-4 md:p-0 mt-4 font-medium">
                {
                  Impressions.map((menu, index) => <li className="" key={index}>
                    <a href="/" className="flex justify-between py-2 px-6 rounded" aria-current="page">
                      <span className="text-sm">{menu.name}</span>
                      <span className="text-base" style={{ color: 'rgba(0, 174, 189, 1)' }}>{menu.count}</span>
                    </a>
                  </li>)
                }
              </ul>
            </div>

            {/* Team and Groups */}
            <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-3 px-4 border-b-2">
                <h4 className="text-base">Team and Groups</h4>
                <p className="text-sm leading-8">View All</p>
              </div>
              <ul className="flex flex-col gap-1 p-4 md:p-0 mt-4 font-medium">
                {
                  Teams.map((menu, index) => <li className="" key={index}>
                    <a href="/" className="flex justify-between py-2 px-6 rounded" aria-current="page">
                      <span className="text-sm">{menu.name}</span>
                      <span className="text-base">{menu.count}</span>
                    </a>
                  </li>)
                }
              </ul>
            </div>

            {/* Recent Activities */}
            <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-3 px-4 border-b-2">
                <h4 className="text-base">Recent Activities</h4>
                <p className="text-sm leading-8">View All</p>
              </div>


              <div className="flex items-center flex-col justify-center w-max py-4 px-4">
                {
                  recentActivities.map((recentActivity, index) =>
                    <div className="flex items-center flex-col relative" key={index}>
                      <div className="absolute top-0 left-full ml-4 w-max">
                        <p className="text-[14px]">{recentActivity.name}</p>
                        <h6 className="text-[10px]" style={{ color: recentActivity.color }}>{recentActivity.status}</h6>
                      </div>
                      <div className="absolute right-[-296px] text-[10px]">10 mins ago</div>
                      <div
                        className="w-8 h-3  mx-[-1px]  flex items-center justify-center">
                        <span className="w-3 h-3  rounded-full" style={{ background: recentActivity.color }}></span>
                      </div>
                      <div className="w-1 h-16 " style={{ background: 'rgba(0, 174, 189, 1)' }}></div>
                    </div>
                  )
                }
              </div>
            </div>

            {/* Invite */}
            <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="flex py-6 px-6 justify-evenly gap-4">
                <img src={UserIcon} alt="user icon" />
                <div>
                  <p className="text-sm">Invite to your friends</p>
                  <p className="text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>
              <div className="text-center">
                <Button btnCls="pt-2 pb-2" btnName='Invite' btnCategory="primary" onClick={() => console.log('Invite')} />
              </div>
            </div>
          </div>


          <div className="col-span-4">
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                  <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                  <h4>Curated Programs</h4>
                  <img src={StatisticsImage} alt="statistics" />
                </div>
                <p className="text-[12px]">View All</p>
              </div>

              <div className="py-4 px-8 flex ">
                {
                  curatedPrograms.map((curatedProgram, index) =>
                    <div key={index} className="curated-programs flex gap-4 items-center py-8 px-9 w-2/5">

                      <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                        <div className="flex py-6 px-7 border-b-2">
                          <div className="w-6/12 h-full"><img className="object-cover w-full h-[170px]" src={curatedProgram.programImage} alt="Program Logo" /></div>
                          <div className="flex flex-col gap-3">
                            <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-1/3" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{curatedProgram.category}</p>
                            <h4 className="text-[16px]">{curatedProgram.name}</h4>
                            <span className="text-[12px]">{curatedProgram.desc}</span>
                            <button className="text-white text-[12px] py-2 w-5/12" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                          </div>
                        </div>

                        <div className="flex justify-between  mx-4 my-4 items-center">
                          <div className="flex text-[12px] gap-4 items-center">
                            <img src={CalendarImage} alt="CalendarImage" />
                            <span>{curatedProgram.time}</span>
                            <div
                              className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                              <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                            </div>

                            <span>{curatedProgram.hour}</span>
                          </div>
                          <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{curatedProgram.posted}</div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
