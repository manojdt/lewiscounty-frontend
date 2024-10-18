import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecentRequests from "./RecentRequests";
import TeamGroups from "./TeamGroups";
import RecentActivities from "./RecentActivities";
import ViewImpression from "./ViewImpression";
import ProgramPerformance from "./ProgramPerformance";
import Programs from "./Programs";
import MediaPost from "./MediaPost";
import TrackInfo from "./TrackInfo";
import Invite from "./Invite";
import { empty, programActionStatus, programStatus, statusAction } from "../../utils/constant";
import { chartProgramList, getProgramCounts, getUserPrograms, updateProgram } from "../../services/userprograms";
import DashboardCard from "../../shared/Card/DashboardCard";
import { pipeUrls, programMenus } from '../../utils/constant';
import { useWindowDimentions } from "../../hooks/windowDimentions";
import UserImage from "../../assets/images/user.jpg";
import './dashboard.css';
import UserInfoCard from "./UserInfoCard";
import ProgramCard from "../../shared/Card/ProgramCard";

export const Mentor = () => {
    const dispatch = useDispatch()
    const { width } = useWindowDimentions()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { allPrograms, status, createdPrograms } = useSelector(state => state.programInfo)
    const { programRequest } = useSelector(state => state.requestList);
    const userpragrams = useSelector(state => state.userPrograms)
    const userInfo = useSelector(state => state.userInfo)
    const [programMenusList, setProgramMenusList] = useState([])
    const [chartList, setChartList] = useState([])
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

    const data =
        [
            { title: 'Ongoing Programs', value: 40, color: '#1D5BBF' },
            { title: 'Completed', value: 25, color: '#00AEBD' },
            { title: 'Abort Programs', value: 35, color: '#FEA7BB' }
        ];


    const handlePerformanceFilter = (e) => {
        const res = e?.target?.value || "date"
        dispatch(chartProgramList(res))
    }

    const handleDetails = () => {
        console.log('handleDetails')
    }


    // useEffect(() => {
    //     const programMenu = [...programMenus('dashboard')].filter(men => men.for.includes(role)).map(menu => {
    //         if (menu.status === 'all') {
    //             return { ...menu, count: userpragrams.totalPrograms }
    //         }
    //         if (statusAction.includes(menu.status)) {
    //             return { ...menu, count: userpragrams.statusCounts[menu.status] }
    //         }
    //         return menu
    //     })
    //     setProgramMenusList(programMenu)
    // }, [userpragrams])

    useEffect(() => {
        handlePerformanceFilter()
    }, [])


    useEffect(() => {
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
            if (program.status === programActionStatus.assigned
                || program.status === programActionStatus.inprogress
            ) baseUrl = pipeUrls.startprogram
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

    useEffect(() => {
        chartData()
    }, [userpragrams.chartProgramDetails])

    const chartData = () => {
        if (userpragrams?.chartProgramDetails?.data &&
            userpragrams?.chartProgramDetails?.data?.length > 0) {
            const res = userpragrams?.chartProgramDetails?.data.every((val) => val.value === 0)
            if (res) {
                return setChartList(empty)
            } else {
                return setChartList(userpragrams?.chartProgramDetails?.data)
            }
        }
    }

    console.log('userpragrams', userpragrams)

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
                        <UserInfoCard />

                        <ViewImpression />

                        <RecentActivities />

                        <Invite />

                    </div>

                    <div className="programs-list">
                        {/* <div className="col-span-4"> */}

                        {
                            (searchParams.get("type") === 'yettojoin' || searchParams.get("type") === 'planned' || (searchParams.get("type") === null && searchParams.get("is_bookmark") === null)) &&
                            <ProgramCard
                                title="Planned Programs"
                                viewpage="/programs?type=yettojoin"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.yettojoin}
                            />
                        }


                        {
                            searchParams.get("type") === 'yettostart' &&
                            <ProgramCard
                                title="Recent  Programs"
                                viewpage="/programs?type=yettostart"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.yettostart}
                            />
                        }

                        {
                            searchParams.get("type") === 'inprogress' &&
                            <ProgramCard
                                title="Ongoing  Programs"
                                viewpage="/programs?type=inprogress"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.inprogress}
                            />
                        }

{
                            searchParams.get("type") === 'planned' &&
                            <ProgramCard
                                title="PLanned Programs"
                                viewpage="/programs?type=planned"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.planned}
                            />
                        }


                        {
                            searchParams.get("is_bookmark") === 'true' &&
                            <ProgramCard
                                title="Bookmarked  Programs"
                                viewpage="/programs?type=bookmarked"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.bookmarked}
                            />
                        }

                        {
                            searchParams.get("type") === 'completed' &&
                            <ProgramCard
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
                                {/* <ProgramPerformance data={chartList} total={userpragrams?.chartProgramDetails?.total_program_count || "0%"} handleFilter={handlePerformanceFilter} handleDetails={handleDetails} /> */}
                                <RecentRequests data={programRequest} />
                                {/* <TrackInfo /> */}
                            </div>

                            <div className="layer-second flex flex-col gap-8">
                                {/* <MediaPost /> */}
                                <Programs />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
