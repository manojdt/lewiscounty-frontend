import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import DashboardCard from "../../shared/Card/DashboardCard";
import Topmentors from "./Topmentors";
import Programs from "./Programs";
import { pipeUrls, programMenus } from '../../utils/constant';
import { programActionStatus, programStatus, statusAction } from "../../utils/constant";
import { getMenteePrograms, getProgramCounts, updateProgram } from "../../services/userprograms";

import './dashboard.css';
import UserImage from "../../assets/images/user.jpg";
import RightArrow from '../../assets/icons/rightArrow.svg'


export const Mentee = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { allPrograms, status } = useSelector(state => state.programInfo)
    const userpragrams = useSelector(state => state.userPrograms)
    const userInfo = useSelector(state => state.userInfo)
    const [programMenusList, setProgramMenusList] = useState([])

    const role = userInfo.data.role


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
            dispatch(getMenteePrograms(query));
        }

    }, [searchParams])

    useEffect(() => {
        const filterType = searchParams.get("type");
        const isBookmark = searchParams.get("is_bookmark");
        dispatch(getProgramCounts())
        if (filterType === null && isBookmark === null) {
            dispatch(getMenteePrograms({ type: 'status', value: 'yettojoin' }));
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
                dispatch(getMenteePrograms(query));
            } else {
                dispatch(getMenteePrograms({ type: 'status', value: 'yettojoin' }));
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

                <div className="grid grid-cols-5 gap-7">
                    <div className="">

                        <div className="pb-3 w-full max-w-sm bg-white rounded-lg" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 1)' }}>
                            <div className="flex flex-col items-center pb-10 pt-14 border-b-2">
                                <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover" src={UserImage} alt="User logo" />
                                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{userInfo?.data?.first_name} {userInfo?.data?.last_name}</h5>
                                <span className="text-sm text-gray-500 " style={{ textTransform: 'capitalize' }}>{userInfo.data.role} | Teaching Proffessional</span>
                            </div>

                            <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
                                {
                                    programMenusList.map((menu, index) => {
                                        if (role === 'mentee' && index > 3) return null
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
                            <div className="flex justify-center mt-2 mb-2">
                                <button className="text-white flex justify-center items-center gap-3 px-4 py-3 text-[12px]" style={{ borderRadius: '3px', background: 'linear-gradient(97.32deg, #1D5BBF -32.84%, #00AEBD 128.72%)' }}>
                                    <span>View All</span>
                                    <img src={RightArrow} alt={'RightArrow'} />
                                </button>
                            </div>
                        </div>
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


                    </div>
                </div>


                <div className="grid grid-cols-3 gap-7 mt-10">
                    <div className="col-span-2">
                        <Topmentors />


                        <div className="py-5">
                            <DashboardCard
                                title="Related Program "
                                viewpage="/programs?type=yettojoin"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.yettojoin}
                            />
                        </div>

                    </div>
                    <div> <Programs /></div>
                </div>

            </div>
        </>
    );
};
