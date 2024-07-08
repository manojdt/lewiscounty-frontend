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
import { programActionStatus, programStatus, statusAction } from "../../utils/constant";
import { updateAllPrograms, loadAllPrograms, createNewProgram, updateNewPrograms, updateProgramDetails } from "../../services/programInfo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProgramCounts, getUserPrograms, updateProgram } from "../../services/userprograms";
import { Backdrop, CircularProgress } from "@mui/material";
import DashboardCard from "../../shared/Card/DashboardCard";
import { pipeUrls, programFilterUrls, programMenus } from '../../utils/constant';
import Invite from "./Invite";

export const Dashboard = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { allPrograms, status, createdPrograms } = useSelector(state => state.programInfo)
  const userpragrams = useSelector(state => state.userPrograms)
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
    const programMenu = [...programMenus('dashboard')].map(menu => {
      if (menu.status === 'all') {
        return { ...menu, count: userpragrams.totalPrograms }
      }
      if (statusAction.includes(menu.status)) {
        return { ...menu, count: userpragrams.statusCounts[menu.status] }
      }
      return menu
    })
    setProgramMenusList(programMenu)
  }, [userpragrams])


  useEffect(() => {
    console.log('searchParams', searchParams)
    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");

    let query = {}

    if (filterType && filterType !== '') {
      query = { type: 'status', value: filterType }
    }

    if (isBookmark && isBookmark !== '') {
      query = { type: 'is_bookmark', value: isBookmark }
    }

    if (Object.keys(query).length) {
      dispatch(getUserPrograms(query));
    }

  }, [searchParams])

  useEffect(() => {
    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");
    dispatch(getProgramCounts())
    if (filterType === null && isBookmark === null) {
      dispatch(getUserPrograms({ type: 'status', value: 'yettojoin' }));
    }
  }, [])


  const handleNavigateDetails = (program) => {
    let baseUrl = pipeUrls.programdetails
    if (Object.keys(program).length) {
        if (program.status === programActionStatus.yettostart) baseUrl = pipeUrls.assigntask
        if (program.status === programActionStatus.assigned) baseUrl = pipeUrls.startprogram
        if (program.status === programActionStatus.inprogress) baseUrl = pipeUrls.startprogram
        navigate(`${baseUrl}/${program.id}`)
    }

    // const programDetails = allPrograms.find(all => all.id === id)
    // dispatch(updateProgramDetails(programDetails))
    // navigate(`/program-details/${id}`)
  }

  const handleBookmark = (program) => {
    console.log('id', program.id)
    dispatch(updateProgram({ id: program.id, is_bookmark: !program.is_bookmark }))
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

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={userpragrams.loading}

        >
          {
            userpragrams.loading ?
              <CircularProgress color="inherit" />
              : null
          }


        </Backdrop>

        <div className="grid grid-cols-5 gap-3">
          <div className="row-span-3 flex flex-col gap-8">

            <div className="pb-3 w-full max-w-sm bg-white rounded-lg" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 1)' }}>
              <div className="flex flex-col items-center pb-10 pt-14 border-b-2">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover" src={UserImage} alt="User logo" />
                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{userInfo?.data?.first_name} {userInfo?.data?.last_name}</h5>
                <span className="text-sm text-gray-500  pb-5" style={{
                  color: 'rgba(35, 35, 35, 1)'
                }}>{userInfo?.data?.userinfo?.current_employer}</span>
                <span className="text-sm text-gray-500 " style={{ textTransform: 'capitalize' }}>{userInfo.data.role} | Teaching Proffessional</span>
              </div>

              <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
                {
                  programMenusList.map((menu, index) => <li className="" key={index}>
                    <div className={`flex justify-between py-2 px-6 rounded cursor-pointer 
                      menu-content ${searchParams.get("type") === menu.status || (searchParams.get("is_bookmark") === 'true' && menu.status === programActionStatus.bookmark) ? 'active' : ''}`} aria-current="page"
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

            <Invite />

          </div>


          <div className="col-span-4">

            {
              (searchParams.get("type") === 'yettojoin' || (searchParams.get("type") === null && searchParams.get("is_bookmark") === null)) &&
              <DashboardCard
                title="Curated  Programs"
                viewpage="/programs?type=yettojoin"
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.yettojoin}
              />
            }


            {
              searchParams.get("type") === 'yettostart' &&
              <DashboardCard
                title="Recent  Programs"
                viewpage="/programs?type=yettostart"
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.yettostart}
              />
            }

            {
              searchParams.get("type") === 'inprogress' &&
              <DashboardCard
                title="Ongoing  Programs"
                viewpage="/programs?type=inprogress"
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.inprogress}
              />
            }


            {
              searchParams.get("is_bookmark") === 'true' &&
              <DashboardCard
                title="Bookmarked  Programs"
                viewpage="/programs?type=bookmarked"
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.bookmarked}
              />
            }

            {
              searchParams.get("type") === 'completed' &&
              <DashboardCard
                title="Completed  Programs"
                viewpage="/programs?type=completed"
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.completed}
              />
            }



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
