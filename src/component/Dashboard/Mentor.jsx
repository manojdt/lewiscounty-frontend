import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import RecentRequests from "./RecentRequests";
import RecentActivities from "./RecentActivities";
import ViewImpression from "./ViewImpression";
import Programs from "./Programs";
import Invite from "./Invite";
import { programActionStatus, programStatus } from "../../utils/constant";
import { chartProgramList, getProgramCounts, getUserPrograms, updateProgram } from "../../services/userprograms";
import { pipeUrls } from '../../utils/constant';
import './dashboard.css';
import UserInfoCard from "./UserInfoCard";
import ProgramCard from "../../shared/Card/ProgramCard";
import api from "../../services/api";
import { getUserProfile } from "../../services/profile";

export const Mentor = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { programRequest } = useSelector(state => state.requestList);
    const userpragrams = useSelector(state => state.userPrograms)

    const handlePerformanceFilter = (e) => {
        const res = e?.target?.value || "date"
        dispatch(chartProgramList(res))
    }

    const getPrograms = () => {
        let query = {}
        const filterType = searchParams.get("type");
        const isBookmark = searchParams.get("is_bookmark");
        const categoryFilter = searchParams.get("category_id");
        if (filterType && filterType !== '') {
            query = { type: 'status', value: filterType }
        }



        if (isBookmark && isBookmark !== '') {
            query = { type: 'is_bookmark', value: isBookmark }
        }

        if(categoryFilter && categoryFilter !== ''){
            query.category_id = categoryFilter
        }
        dispatch(getUserPrograms(query));
    }

    const handleNavigateDetails = (program) => {
        let baseUrl = pipeUrls.programdetails
        if (Object.keys(program).length) {
            if (program.status === programActionStatus.yettostart) baseUrl = pipeUrls.startprogram
            if (program.status === programActionStatus.assigned
                || program.status === programActionStatus.inprogress
            ) baseUrl = pipeUrls.startprogram
            navigate(`${baseUrl}/${program.id}`)
        }
    }

    const handleBookmark = async (program) => {
        const payload = {
            "program_id": program.id,
            "marked": !program.is_bookmark
        }
        setLoading(true)

        const bookmark = await api.post('bookmark', payload);
        if (bookmark.status === 201 && bookmark.data) {
            setLoading(false)
            getPrograms()
            dispatch(getProgramCounts())
        }
    }

    useEffect(() => {
        handlePerformanceFilter()
        dispatch(getUserProfile())
    }, [])

    useEffect(() => {
        getPrograms()
    }, [searchParams])

    useEffect(() => {
        const filterType = searchParams.get("type");
        const isBookmark = searchParams.get("is_bookmark");
        dispatch(getProgramCounts())
        if (filterType === null && isBookmark === null) {
            dispatch(getUserPrograms({}));
        }
    }, [])

    useEffect(() => {
        if (userpragrams.status === programStatus.bookmarked) {
            getPrograms()
        }
    }, [userpragrams.status])


    return (
        <>
            <div className="dashboard-content px-8 mt-10">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={userpragrams.loading || loading}
                >
                    {
                        <CircularProgress color="inherit" />
                    }
                </Backdrop>

                <div className="main-grid grid grid-cols-5 gap-3">
                    <div className="left-bar row-span-3 flex flex-col gap-8">
                        <UserInfoCard />
                        {/* <ViewImpression /> */}
                        {/* <RecentActivities /> */}
                        <Invite />
                    </div>

                    <div className="programs-list">
                        {
                            (searchParams.get("type") === null && searchParams.get("is_bookmark") === null) &&
                            <ProgramCard
                                title="All Programs"
                                viewpage="/programs"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.allprograms}
                                loadProgram={getPrograms}
                            />
                        }
                        {
                            (searchParams.get("type") === 'yettojoin' || searchParams.get("type") === 'planned') &&
                            <ProgramCard
                                title="Planned Programs"
                                viewpage="/programs?type=yettojoin"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.yettojoin}
                                loadProgram={getPrograms}
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
                                loadProgram={getPrograms}
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
                                loadProgram={getPrograms}
                            />
                        }

                        {/* {
                            searchParams.get("type") === 'planned' &&
                            <ProgramCard
                                title="PLanned Programs"
                                viewpage="/programs?type=planned"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.planned}
                                loadProgram={getPrograms}
                            />
                        } */}

                        {
                            searchParams.get("is_bookmark") === 'true' &&
                            <ProgramCard
                                title="Bookmarked  Programs"
                                viewpage="/programs?type=bookmarked"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.bookmarked}
                                loadProgram={getPrograms}
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
                                loadProgram={getPrograms}
                            />
                        }


                        <div className="root-layer grid grid-cols-2 gap-8 pt-6">
                            <div className="layer-first flex flex-col sm:gap-6 gap-4">
                                <RecentRequests data={programRequest} />
                            </div>

                            <div className="layer-second flex flex-col gap-8">
                                <Programs />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
