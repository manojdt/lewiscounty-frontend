import React, { useEffect, useState } from "react";
import UserImage from "../../assets/images/user.jpg";
import './dashboard.css';
import RightArrow from '../../assets/icons/rightArrow.svg'


import RecentRequests from "./RecentRequests";
import TeamGroups from "./TeamGroups";
import RecentActivities from "./RecentActivities";
import ViewImpression from "./ViewImpression";
import ProgramPerformance from "./ProgramPerformance";
import Programs from "./Programs";
import MediaPost from "./MediaPost";
import TrackInfo from "./TrackInfo";
import { useDispatch, useSelector } from "react-redux";
import { programActionStatus, programStatus, statusAction } from "../../utils/constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProgramCounts, getUserPrograms, updateProgram } from "../../services/userprograms";
import { Backdrop, CircularProgress } from "@mui/material";
import DashboardCard from "../../shared/Card/DashboardCard";
import { pipeUrls, programMenus } from '../../utils/constant';
import Invite from "./Invite";
import { useWindowDimentions } from "../../hooks/windowDimentions";

export const Mentor = () => {
    const dispatch = useDispatch()
    const { width } = useWindowDimentions()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { allPrograms, status, createdPrograms } = useSelector(state => state.programInfo)
    const userpragrams = useSelector(state => state.userPrograms)
    const userInfo = useSelector(state => state.userInfo)
    const [programMenusList, setProgramMenusList] = useState([])
    const [currentPrograms, setCurrentPrograms] = useState({ title: '', page: '', programs: [] })
    const [allprogramsList, setAllProgramsList] = useState({ allPrograms: [], yettoplan: [], planned: [], inprogress: [], bookmarked: [], completed: [] })

    const role = userInfo.data.role

    console.log('status mentor', status)

    const list = {
        allPrograms: allPrograms,
        yettoplan: allPrograms.filter(program => program.status === programStatus.yetToPlan),
        planned: allPrograms.filter(program => program.status === programStatus.planned),
        inprogress: allPrograms.filter(program => program.status === programStatus.inProgress),
        bookmarked: allPrograms.filter(program => program.status === programStatus.bookmarked),
        completed: allPrograms.filter(program => program.status === programStatus.completed),
    }


    useEffect(() => {
        const programMenu = [...programMenus('dashboard')].filter(men => men.for.includes(role)).map(menu => {
           

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
    }

    const handleBookmark = (program) => {
        dispatch(updateProgram({ id: program.id, is_bookmark: !program.is_bookmark }))
    }

    useEffect(() => {
        if (userpragrams.status === programStatus.bookmarked) {

            let query = {}
            const filterType = searchParams.get("type");
            const isBookmark = searchParams.get("is_bookmark");
            if (filterType && filterType !== '') {
                query = { type: 'status', value: filterType }
            }

            if (isBookmark && isBookmark !== '') {
                query = { type: 'is_bookmark', value: isBookmark }
            }

            if (Object.keys(query).length) {
                dispatch(getUserPrograms(query));
            } else {
                dispatch(getUserPrograms({ type: 'status', value: 'yettojoin' }));
            }
        }
    }, [userpragrams.status])


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

                <div className="main-grid grid grid-cols-5 gap-3">
                    <div className="left-bar row-span-3 flex flex-col gap-8">
                    {/* <div className="row-span-3 flex flex-col gap-8"> */}

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
                                    programMenusList.map((menu, index) => {

                                        return (
                                            <li className="" key={index}>
                                                <div className={`flex justify-between py-2 px-6 rounded cursor-pointer menu-content 
                                                        ${searchParams.get("type") === menu.status
                                                        || (searchParams.get("is_bookmark") === 'true' && menu.status === programActionStatus.bookmark)
                                                        || (searchParams.get("type") === null && searchParams.get("is_bookmark") === null && menu.status === programActionStatus.yettojoin) ? 'active' : ''}`} aria-current="page"
                                                    onClick={() => navigate(menu.page)}>
                                                    <span className="text-sm">{menu.name}</span>
                                                    <span className="text-base">{menu.count}</span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }

                            </ul>

                        </div>

                        <ViewImpression />

                        <TeamGroups />

                        <RecentActivities />

                        <Invite />

                    </div>

                    <div className="programs-list">
                    {/* <div className="col-span-4"> */}

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


                        {/* <div className="root-layer lg:gap-8 pt-6"> */}
                        <div className="root-layer grid grid-cols-2 gap-8 pt-6">
                            <div className="layer-first flex flex-col sm:gap-6 gap-4">
                                <ProgramPerformance />
                                <RecentRequests />
                                <TrackInfo />
                            </div>

                            <div className="layer-second flex flex-col gap-8">
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
