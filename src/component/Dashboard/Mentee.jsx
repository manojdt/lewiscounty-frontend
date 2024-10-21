import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

import UserInfoCard from "./UserInfoCard";

import SearchIcon from '../../assets/icons/search.svg';
import UserImage from "../../assets/images/user.jpg";
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'

import { pipeUrls } from '../../utils/constant';
import { programStatus } from "../../utils/constant";
import { getMenteeProgramCount, getMenteePrograms, updateProgram } from "../../services/userprograms";

import './dashboard.css';
import ProgramCard from "../../shared/Card/ProgramCard";
import { programFeeds } from "../../utils/mock";


export const Mentee = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const userpragrams = useSelector(state => state.userPrograms)
    const userInfo = useSelector(state => state.userInfo)


    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const role = userInfo.data.role

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
            dispatch(getMenteePrograms(query));
        }

    }, [searchParams])

    useEffect(() => {
        const filterType = searchParams.get("type");
        const isBookmark = searchParams.get("is_bookmark");
        dispatch(getMenteeProgramCount())
        if (filterType === null && isBookmark === null) {
            dispatch(getMenteePrograms({}));
        }
    }, [])


    const handleNavigateDetails = (program) => {
        let baseUrl = pipeUrls.programdetails
        if (Object.keys(program).length) {
            const filterType = searchParams.get("type");
            if (role === 'mentee' && filterType === 'yettostart') {
                navigate(`/mentee-document-upload/${program.id}`)
            } else {
                navigate(`${baseUrl}/${program.id}`)
            }


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


    const topMentors = [
        {
            name: 'Rhea Ripley',
            role: 'Mentor',
            attended: 10,
            completed: 20
        },
        {
            name: 'Rhea Ripley',
            role: 'Mentor',
            attended: 10,
            completed: 20
        },
        {
            name: 'Rhea Ripley',
            role: 'Mentor',
            attended: 10,
            completed: 20
        },
        {
            name: 'Rhea Ripley',
            role: 'Mentor',
            attended: 10,
            completed: 20
        }
    ]

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
                    <div >
                        <UserInfoCard />
                        <div className='recent-request mt-4' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                <div className="flex gap-4">
                                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                    <h4>Top Mentors</h4>
                                </div>
                                <div className="flex justify-center mt-2 mb-2">

                                    <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                                        background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                                    }}
                                        onClick={() => navigate('/mentors')}
                                    >View All</p>
                                </div>
                            </div>


                            <div className="content flex flex-col gap-4 py-5 px-5 overflow-x-auto">
                                {
                                    topMentors.map((recentReq, index) =>
                                        <div key={index} className="py-3 px-3" style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px' }}>
                                            <div className="flex gap-2 pb-3" style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                                <div className="w-1/4"> <img src={index % 2 === 0 ? MaleIcon : FemaleIcon} alt="male-icon" /> </div>
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-[14px]" style={{ width: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                                                        title={recentReq.name}
                                                    >{recentReq.name}</p>
                                                    <p className="text-[12px]">{recentReq.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 pt-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="lg:w-2 lg:h-2  rounded-full" style={{ background: 'rgba(29, 91, 191, 1)' }}></span>
                                                    <span className="lg:text-[10px]">Attended({recentReq.attended || 0})</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="lg:w-2 lg:h-2  rounded-full" style={{ background: 'rgba(0, 174, 189, 1)' }}></span>
                                                    <span className="lg:text-[10px]">Completed({recentReq.completed || 0})</span>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                }
                            </div>

                        </div>
                    </div>


                    <div className="col-span-4">

                        {
                            (searchParams.get("type") === null && searchParams.get("is_bookmark") === null) &&

                            <ProgramCard
                                title="All Programs"
                                viewpage="/programs"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.allprograms}
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
                            />
                        }


                        {
                            searchParams.get("type") === 'yettostart' &&
                            <ProgramCard
                                title="Recent Join Programs"
                                viewpage="/programs?type=yettostart"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.yettostart}
                            />
                        }

                        {
                            searchParams.get("type") === 'inprogress' &&
                            <ProgramCard
                                title="Ongoing Programs"
                                viewpage="/programs?type=inprogress"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.inprogress}
                            />
                        }

                    </div>
                </div>


                <div className="mt-4">

                    <div className='program-feeds' style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                            <div className="flex gap-4">
                                <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                <h4>Program Feeds</h4>
                            </div>
                            <div className="flex gap-4 items-center">
                                <img src={SearchIcon} alt="statistics" />
                                <p className="text-[12px] py-2 px-2 cursor-pointer"
                                    onClick={() => navigate('/feeds')}
                                    style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>View All</p>
                            </div>

                        </div>

                        <div className="content flex overflow-x-auto">
                            {
                                programFeeds.map((programFeeds, index) =>
                                    <div key={index} style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '5px' }} className="program-feed-root mx-7 my-7">
                                        <div className="flex py-3 px-3 gap-4 w-[340px]">
                                            <img src={UserImage} className={`program-user-image ${getWindowDimensions().width <= 1536 ? 'w-1/5' : 'w-1/6'} rounded-xl h-[100px]`} style={{ height: getWindowDimensions().width <= 1536 ? '90px' : '100px' }} alt="" />
                                            <div className="feed-content flex flex-col gap-4">
                                                <h3 >{programFeeds.title}</h3>
                                                <h4 className="text-[12px]">{programFeeds.desc}</h4>
                                                <div className="flex gap-3">
                                                    <span style={{ background: 'rgba(238, 245, 255, 1)', borderRadius: '30px' }} className="tags py-1 px-4 text-[13px]">Tag</span>
                                                    <span style={{ background: 'rgba(238, 245, 255, 1)', borderRadius: '30px' }} className="tags py-1 px-4 text-[13px]">Tag</span>
                                                    <span style={{ background: 'rgba(238, 245, 255, 1)', borderRadius: '30px' }} className="tags py-1 px-4 text-[13px]">Tag</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
};
