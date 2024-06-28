import React, { useEffect, useState } from "react";
import { Button } from '../../shared';
import UserImage from "../../assets/images/user.jpg";
import { menusList, curatedPrograms } from '../../utils/mock'
import './dashboard.css';
import CalenderIcon from '../../assets/icons/Calender.svg';
import FilterIcon from '../../assets/icons/Filter.svg';
import InviteFriendsIcon from '../../assets/icons/Invite-friends.svg'
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg'
import BookmarkedColorIcon from '../../assets/images/bookmarked-colour1x.png'

import ProgramImage from "../../assets/images/logo_image.jpg";

import RecentRequests from "./RecentRequests";
import TeamGroups from "./TeamGroups";
import RecentActivities from "./RecentActivities";
import ViewImpression from "./ViewImpression";
import ProgramPerformance from "./ProgramPerformance";
import Programs from "./Programs";
import MediaPost from "./MediaPost";
import TrackInfo from "./TrackInfo";
import Carousel from "../../shared/Carousel";
import { useDispatch, useSelector } from "react-redux";
import { programStatus } from "../../utils/constant";
import { updateAllPrograms, loadAllPrograms, createNewProgram, updateNewPrograms, updateProgramDetails } from "../../services/programInfo";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Dashboard = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { allPrograms, status, createdPrograms } = useSelector(state => state.programInfo)
  const userInfo = useSelector(state => state.userInfo)
  const [programMenusList, setProgramMenusList] = useState([])
  const [currentPrograms, setCurrentPrograms] = useState({ title: '', page: '', programs: [] })
  const [allprogramsList, setAllProgramsList] = useState({ allPrograms: [], yettoplan: [], planned: [], inprogress: [], bookmarked: [], completed: [] })
  console.log('status', status)

  const list = {
    allPrograms: allPrograms,
    yettoplan: allPrograms.filter(program => program.status === programStatus.yetToPlan),
    planned: allPrograms.filter(program => program.status === programStatus.planned),
    inprogress: allPrograms.filter(program => program.status === programStatus.inProgress),
    bookmarked: allPrograms.filter(program => program.status === programStatus.bookmarked),
    completed: allPrograms.filter(program => program.status === programStatus.completed),
  }

  const data = [
    {
      "category": "Category 1",
      "program_name": "Test Program",
      "sessions": "Session 1",
      "decription": "Test description about this program",
      "course_level": "Medium",
      "program_start_date": "2024-06-26T17:45:21.439Z",
      "program_end_date": "2024-06-27T17:45:21.440Z",
      "learning_materials": "Materials",
      "mentee_limits": "10",
      "group_discussion": "yes",
      "individual_discussion": "yes",
      "location": "USA",
      "about_program": "About program desc",
      "skills": "Skills1",
      "sponsor_logo": {},
      "benefits": "Benefits data",
      "certificates": "Certificates",
      "posted": new Date(),
      "bookmark": true,
      "id": allPrograms.length + 1
    },
    {
      "category": "Category 2",
      "program_name": "Test Program",
      "sessions": "Session 1",
      "decription": "Test description about this program",
      "course_level": "Medium",
      "program_start_date": "2024-06-26T17:45:21.439Z",
      "program_end_date": "2024-06-27T17:45:21.440Z",
      "learning_materials": "Materials",
      "mentee_limits": "10",
      "group_discussion": "yes",
      "individual_discussion": "yes",
      "location": "USA",
      "about_program": "About program desc",
      "skills": "Skills1",
      "sponsor_logo": {},
      "benefits": "Benefits data",
      "certificates": "Certificates",
      "posted": new Date(),
      "bookmark": false,
      "id": allPrograms.length + 2
    },
    {
      "category": "Category 3",
      "program_name": "Test Program",
      "sessions": "Session 1",
      "decription": "Test description about this program",
      "course_level": "Medium",
      "program_start_date": "2024-06-26T17:45:21.439Z",
      "program_end_date": "2024-06-27T17:45:21.440Z",
      "learning_materials": "Materials",
      "mentee_limits": "10",
      "group_discussion": "yes",
      "individual_discussion": "yes",
      "location": "USA",
      "about_program": "About program desc",
      "skills": "Skills1",
      "sponsor_logo": {},
      "benefits": "Benefits data",
      "certificates": "Certificates",
      "posted": new Date(),
      "bookmark": false,
      "id": allPrograms.length + 3
    }
  ]

  useEffect(() => {
    // dispatch(createNewProgram(data))
    if(!allPrograms.length) dispatch(loadAllPrograms(curatedPrograms))
  }, [])

  useEffect(() => {

    const menus = [{
      name: "All Programs",
      count: list.allPrograms.length,
      page: '/programs',
      status: 'all'
    },
    {
      name: "Recent Join Programs",
      count: list.yettoplan.length,
      page: '/dashboard?type=yettoplan',
      status: programStatus.yetToPlan
    },
    {
      name: "Curated Programs",
      count: list.planned.length,
      page: '/dashboard?type=planned',
      status: programStatus.planned
    },
    {
      name: "Ongoing Programs",
      count: list.inprogress.length,
      page: '/dashboard?type=inprogress',
      status: programStatus.inProgress
    },
    {
      name: "Bookmarked Programs",
      count: list.bookmarked.length,
      page: '/dashboard?type=bookmarked',
      status: programStatus.bookmarked
    },
    {
      name: "Completed Programs",
      count: list.completed.length,
      page: '/dashboard?type=completed',
      status: programStatus.completed
    }]
    setProgramMenusList(menus)
    setCurrentPrograms({ title: 'Curated Programs', page: `/programs?type=${programStatus.planned}`, programs: list.planned })
    setAllProgramsList(list)
  }, [allPrograms])

  useEffect(() => {
    console.log('searchParams', searchParams)
    const filterType = searchParams.get("type");
    console.log('filterType', filterType)
    if (filterType && filterType !== '') {
      const allprograms = allprogramsList[filterType];
      console.log('programMenusList', programMenusList)
      const menuDetails = programMenusList.find(menu => menu.status === filterType)
      setCurrentPrograms({ title: menuDetails?.name, page: `/programs?type=${filterType}`, programs: allprograms })
    } else {
      setCurrentPrograms({ title: 'Curated Programs', page: '/programs?type=planned', programs: list.planned })
    }
  }, [searchParams, programMenusList])

  useEffect(() => {
    setCurrentPrograms({ title: 'Curated Programs', page: `/programs?type=${programStatus.planned}`, programs: list.planned })
  }, [])


  const handleNavigateDetails = (id) => {
    const programDetails = allPrograms.find(all => all.id === id)
    dispatch(updateProgramDetails(programDetails))
    navigate(`/program-details/${id}`)
  }

  const handleBookmark = (id) => {
    console.log('id', id)
    const updateProgram = allPrograms.map(createdProgram => {
      if (createdProgram.id === id) {
        return {
          ...createdProgram,
          bookmark: !createdProgram.bookmark
        }
      }
      return createdProgram
    })
    dispatch(updateNewPrograms({ allPrograms: updateProgram, status: '' }))
  }

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  console.log('allPrograms1', allPrograms)
  return (
    <>

      <div className="dashboard-content px-8 mt-10">

        <div className="grid grid-cols-5 gap-3">
          <div className="row-span-3 flex flex-col gap-8">

            <div className="pb-3 w-full max-w-sm bg-white rounded-lg" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 1)' }}>
              <div className="flex flex-col items-center pb-10 pt-14 border-b-2">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover" src={UserImage} alt="User logo" />
                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{userInfo?.data?.first_name} {userInfo?.data?.last_name}</h5>
                <span className="text-sm text-gray-500  pb-5" style={{
                  color: 'rgba(35, 35, 35, 1)'
                }}>{userInfo?.data?.userinfo?.current_employer}</span>
                <span className="text-sm text-gray-500 " style={{textTransform: 'capitalize'}}>{userInfo.data.role} | Teaching Proffessional</span>
              </div>

              <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
                {
                  programMenusList.map((menu, index) => <li className="" key={index}>
                    <div className={`flex justify-between py-2 px-6 rounded cursor-pointer menu-content ${searchParams.get("type") === menu.status ? 'active' : ''}`} aria-current="page"
                      onClick={() => navigate(menu.page)}>
                      <span className="text-sm">{menu.name}</span>
                      <span className="text-base">{menu.count}</span>
                    </div>
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

            {/* {
              createdPrograms && createdPrograms.length ?

                <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                  <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                      <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                      <h4> Recent Programs</h4>
                      <img src={FilterIcon} alt="statistics" />
                    </div>
                    <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                      background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                    }}
                      onClick={() => navigate('/programs?type=recent')}
                    >View All</p>
                  </div>


                  <div className="py-3 px-3 ">
                    {
                      createdPrograms.length > 3 ?

                        <Carousel>
                          {
                            createdPrograms.map((allprogram, index) => {
                              console.log('allprogram', allprogram)
                              let startDate = ''
                              if (allprogram.program_start_date !== '') {
                                startDate = new Date(allprogram.program_start_date).toISOString().substring(0, 10).split("-")
                              }
                              const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''


                              let postedDate = ''
                              if (allprogram.posted !== '') {
                                postedDate = new Date(allprogram.posted).toISOString().substring(0, 10).split("-")
                              }
                              const actualPostDate = postedDate.length ? `${postedDate[2]}/${postedDate[1]}/${postedDate[0]}` : ''


                              return (
                                <div key={index} className="curated-programs flex gap-1 items-center py-8 px-5 w-2/5">

                                  <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                    <div className="flex py-6 px-7 border-b-2 relative">
                                      <div className="w-6/12 h-full">
                                        <img className="object-cover w-full h-[130px]" src={ProgramImage} alt="Program Logo" />
                                      </div>
                                      <div className="flex flex-col gap-3">
                                        <p className={`py-1 px-1 text-[12px] text-center rounded-3xl ${allPrograms.length === 1 ? 'w-5/12' : 'w-1/3'}`} style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>
                                          {allprogram.category}
                                        </p>
                                        <h4 className="text-[16px]">{allprogram.program_name}</h4>
                                        <span className="text-[12px]">{allprogram.decription}</span>
                                        <button className="text-white text-[12px] py-2 w-5/12"
                                          style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>
                                          View Details</button>
                                      </div>
                                      <img className="absolute top-4 right-4 cursor-pointer" src={allprogram.bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon" />
                                    </div>


                                    <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                      <div className="flex text-[12px] gap-4 items-center">
                                        <img src={CalenderIcon} alt="CalendarImage" />
                                        <span>{actualStartDate}</span>

                                        <div
                                          className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                          <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                        </div>

                                        <span>{'10 A.M (GMT + 7)'}</span>
                                      </div>
                                      <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}
                                      >{'10 Mins ago'}</div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            )
                          }
                        </Carousel>
                        :


                        <div className="flex">
                          {
                            createdPrograms.map((allprogram, index) => {
                              if (allprogram.status !== programStatus.yetToPlan) return <></>
                              let startDate = ''
                              if (allprogram.program_start_date !== '') {
                                startDate = new Date(allprogram.program_start_date).toISOString().substring(0, 10).split("-")
                              }
                              const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''


                              let postedDate = ''
                              if (allprogram.posted !== '') {
                                postedDate = new Date(allprogram.posted).toISOString().substring(0, 10).split("-")
                              }
                              const actualPostDate = postedDate.length ? `${postedDate[2]}/${postedDate[1]}/${postedDate[0]}` : ''

                              return (
                                <div key={index} className="curated-programs flex gap-1 items-center py-8 px-5 w-1/3">

                                  <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                    <div className="flex py-6 px-7 border-b-2 relative">
                                      <div className="w-6/12 h-full">
                                        <img className="object-cover w-full h-[130px]" src={ProgramImage} alt="Program Logo" />
                                      </div>
                                      <div className="flex flex-col gap-3">
                                        <p className={`py-1 px-1 text-[12px] text-center rounded-3xl ${allPrograms.length === 1 ? '' : ''}`} style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>
                                          {allprogram.category}
                                        </p>
                                        <h4 className="text-[16px]">{allprogram.program_name}</h4>
                                        <span className="text-[12px]">{allprogram.decription}</span>
                                        <button className="text-white text-[12px] py-2 "
                                          onClick={() => handleNavigateDetails(allprogram.id)}
                                          style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>
                                          View Details</button>
                                      </div>
                                      <img className="absolute top-4 right-4 cursor-pointer"
                                        onClick={() => handleBookmark(allprogram.id)}
                                        src={allprogram.bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon"
                                      />
                                    </div>


                                    <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                      <div className="flex text-[12px] gap-4 items-center">
                                        <img src={CalenderIcon} alt="CalendarImage" />
                                        <span>{actualStartDate}</span>

                                        <div
                                          className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                          <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                        </div>

                                        <span>{'10 A.M (GMT + 7)'}</span>
                                      </div>
                                      <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}
                                      >{'10 Mins ago'}</div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            )
                          }
                        </div>


                    }

                  </div>



                </div>

                : null
            } */}
            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
              <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                  <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                  <h4>{currentPrograms.title}</h4>
                  <img src={FilterIcon} alt="statistics" />
                </div>
                <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                  background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                }}
                  onClick={() => navigate(currentPrograms.page)}
                >View All</p>
              </div>

              <div className="py-3 px-3 ">
                {
                  currentPrograms.programs && currentPrograms.programs.length > (getWindowDimensions().width <=1536 ? 2 : 3) ?

                    <Carousel slideCount={getWindowDimensions().width <=1536 ? 2 :3}>
                      {
                        currentPrograms.programs && currentPrograms.programs.map((curatedProgram, index) => {
                          let startDate = ''
                          if (curatedProgram.program_start_date !== '') {
                            startDate = new Date(curatedProgram.program_start_date).toISOString().substring(0, 10).split("-")
                          }
                          const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''

                          return (
                            <div key={index} className="curated-programs flex gap-0 items-center py-8 px-5 w-2/5">

                              <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                <div className="flex py-6 px-7 border-b-2 relative">
                                  <div className="w-6/12 h-full">
                                    <img className="object-cover w-full h-[150px]" src={ProgramImage} alt="Program Logo" />
                                  </div>
                                  <div className="flex flex-col gap-3 w-[80%]">
                                    <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-[90px]" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{curatedProgram.category}</p>
                                    <h4 className="text-[16px]">{curatedProgram.program_name}</h4>
                                    <span className="text-[12px] line-clamp-2 h-[38px]">{curatedProgram.decription}</span>
                                    <button className="text-white text-[12px] py-2 w-[90px]" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}
                                    
                                    onClick={() => curatedProgram.status === programStatus.yetToPlan ? handleNavigateDetails(curatedProgram.id) : undefined}
                                    >View Details</button>
                                  </div>
                                  <img className="absolute top-4 right-4 cursor-pointer" onClick={() => handleBookmark(curatedProgram.id)} src={curatedProgram.bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon" />
                                </div>


                                <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                  <div className="flex text-[12px] gap-4 items-center">
                                    <img src={CalenderIcon} alt="CalendarImage" />
                                    <span>{actualStartDate}</span>
                                    <div
                                      className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                      <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                    </div>

                                    <span>{'10 A.M (GMT + 7)'}</span>
                                  </div>
                                  <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{'10 Mins ago'}</div>
                                </div>
                              </div>
                            </div>
                          )
                        }

                        )
                      }
                    </Carousel>
                    :
                    <div className="flex">
                      {
                        currentPrograms.programs.length ?

                          currentPrograms.programs.map((currentProgram, index) => {
                            let startDate = ''
                            if (currentProgram.program_start_date !== '') {
                              startDate = new Date(currentProgram.program_start_date).toISOString().substring(0, 10).split("-")
                            }
                            const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''

                            return (
                              <div key={index} className={`curated-programs flex gap-1 items-center py-8 px-5 ${getWindowDimensions().width <=1536 ? 'w-2/5' : 'w-1/3'}`}>

                                <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                  <div className="flex py-6 px-7 border-b-2 relative">
                                    <div className="w-6/12 h-full">
                                      <img className="object-cover w-full h-[130px]" src={ProgramImage} alt="Program Logo" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                      <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-[90px]" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{currentProgram.category}</p>
                                      <h4 className="text-[16px]">{currentProgram.program_name}</h4>
                                      <span className="text-[12px] line-clamp-2 h-[38px]">{currentProgram.decription}</span>
                                      <button className="text-white text-[12px] py-2 w-[90px]" 
                                      onClick={() => currentProgram.status === programStatus.yetToPlan ? handleNavigateDetails(currentProgram.id) : undefined}
                                      style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                    </div>
                                    <img className="absolute top-4 right-4 cursor-pointer"
                                    onClick={() => handleBookmark(currentProgram.id)}
                                    src={currentProgram.bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon" />
                                  </div>


                                  <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                    <div className="flex text-[12px] gap-4 items-center">
                                      <img src={CalenderIcon} alt="CalendarImage" />
                                      <span>{actualStartDate}</span>
                                      <div
                                        className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                        <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                      </div>

                                      <span>{'10 A.M (GMT + 7)'}</span>
                                    </div>
                                    <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{'10 Mins ago'}</div>
                                  </div>
                                </div>
                              </div>
                            )
                          }

                          )
                          : <div>No Programs found</div>
                      }

                    </div>
                }
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
