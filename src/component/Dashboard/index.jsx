import React from "react";
import { Button } from '../../shared';
import UserImage from "../../assets/images/user.jpg";
import { menusList, curatedPrograms } from '../../utils/mock'
import './dashboard.css';
import CalenderIcon from '../../assets/icons/Calender.svg';
import FilterIcon from '../../assets/icons/Filter.svg';
import InviteFriendsIcon from '../../assets/icons/Invite-friends.svg'
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg'

import RecentRequests from "./RecentRequests";
import TeamGroups from "./TeamGroups";
import RecentActivities from "./RecentActivities";
import ViewImpression from "./ViewImpression";
import ProgramPerformance from "./ProgramPerformance";
import Programs from "./Programs";
import MediaPost from "./MediaPost";
import TrackInfo from "./TrackInfo";
import Carousel from "../../shared/Carousel";

export const Dashboard = () => {
  return (
    <>

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

            <ViewImpression />

            <TeamGroups />

            <RecentActivities />

            {/* Invite */}
            <div className="pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="flex py-6 px-6 justify-evenly gap-4">
                <div className="flex h-[50px] text-center px-4" style={{ background: 'rgba(238, 245, 255, 1)' }}>
                  <img src={InviteFriendsIcon} alt="user icon" />
                </div>

                <div>
                  <p className="text-sm">Invite to your friends</p>
                  <p className="text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>
              <div className="text-center">
                <Button btnCls="!px-12 !py-3" btnName='Invite' btnCategory="primary" onClick={() => console.log('Invite')} />
              </div>
            </div>
          </div>


          <div className="col-span-4">
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                  <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                  <h4>Curated Programs</h4>
                  <img src={FilterIcon} alt="statistics" />
                </div>
                <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                  background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                }}>View All</p>
              </div>

              <div className="py-3 px-3 ">
                <Carousel>
                  {
                    curatedPrograms.map((curatedProgram, index) =>
                      <div key={index} className="curated-programs flex gap-1 items-center py-8 px-5 w-2/5">

                        <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                          <div className="flex py-6 px-7 border-b-2 relative">
                            <div className="w-6/12 h-full">
                              <img className="object-cover w-full h-[130px]" src={curatedProgram.programImage} alt="Program Logo" />
                            </div>
                            <div className="flex flex-col gap-3">
                              <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-1/3" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{curatedProgram.category}</p>
                              <h4 className="text-[16px]">{curatedProgram.name}</h4>
                              <span className="text-[12px]">{curatedProgram.desc}</span>
                              <button className="text-white text-[12px] py-2 w-5/12" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                            </div>
                            <img className="absolute top-4 right-4 cursor-pointer" src={BookmarkedIcon} alt="BookmarkedIcon" />
                          </div>
                          

                          <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                            <div className="flex text-[12px] gap-4 items-center">
                              <img src={CalenderIcon} alt="CalendarImage" />
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
                </Carousel>
              </div>
            </div>



            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="flex flex-col gap-4">
                <ProgramPerformance />
                <RecentRequests />
                <TrackInfo />
              </div>

              <div className="flex flex-col gap-10">
                <MediaPost />
                <Programs />
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};
