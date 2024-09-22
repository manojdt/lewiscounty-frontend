import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';

import Card from '../../shared/Card';
import { curatedPrograms, menusList } from '../../utils/mock';
import SearchIcon from '../../assets/icons/search.svg';
import CalenderIcon from '../../assets/icons/Calender.svg';
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg';
import CalendarIcon from '../../assets/images/calender_1x.png';
import BookmarkedColorIcon from '../../assets/images/bookmarked-colour1x.png'
import ProgramImage from "../../assets/images/logo_image.jpg";


import { getAllCategories, getAllCertificates, getAllMaterials, getAllMembers, getAllSkills, loadAllPrograms } from '../../services/programInfo';
import { menteeCountStatus, pipeUrls, programActionStatus, programMenus, programStatus, ProgramStatusInCard, statusAction } from '../../utils/constant';
import { getMenteeProgramCount, getMenteePrograms, getProgramCounts, getProgramDetails, getUserPrograms, updateProgram } from '../../services/userprograms';


export default function Programs() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();

    const [programsList, setProgramsList] = useState([])
    const [programMenusList, setProgramMenusList] = useState([])

    const userInfo = useSelector(state => state.userInfo)
    const userprograms = useSelector(state => state.userPrograms)

    const role = userInfo.data.role || ''

    const programFilter = [
        {
            name: 'Quarter 1',
            key: 'quaeter1',
        },
        {
            name: 'Quarter 2',
            key: 'quaeter2',
        },
    ]

    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const handleBookmark = (program) => {
        dispatch(updateProgram({ id: program.id, is_bookmark: !program.is_bookmark }))
    }

    const handleNavigation = (programdetails) => {
        let baseUrl = pipeUrls.programdetails
        if (Object.keys(programdetails).length) {
            if (role === 'mentor' && programdetails.status !== 'completed') {
                if (programdetails.status === programActionStatus.yettostart) baseUrl = pipeUrls.assigntask
                if (programdetails.status === programActionStatus.inprogress) baseUrl = pipeUrls.startprogram
            }
            navigate(`${baseUrl}/${programdetails.id}`)
        }

    }

    const statusNotShow = ['yettoapprove', 'yettojoin', 'yettostart','draft']

    useEffect(() => {
        const listPrograms = programMenus('program').filter(programs => programs.for.includes(role));

        const programMenu = [...listPrograms].map(menu => {

            if (role === 'mentor') {
                if (menu.status === 'all') {
                    return { ...menu, count: userprograms.totalPrograms }
                }
                if (statusAction.includes(menu.status)) {
                    return { ...menu, count: userprograms.statusCounts[menu.status] }
                }
            }

            if (role === 'mentee') {
                return { ...menu, count: userprograms.programsCounts[menteeCountStatus[menu.status]] || 0 }
            }

            return menu
        })
        setProgramMenusList(programMenu)
    }, [userprograms.statusCounts, userprograms.programsCounts])

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

        if (role === 'mentee') {
            dispatch(getMenteePrograms(query))
        }
        if (role === 'mentor') dispatch(getUserPrograms(query));

    }, [searchParams, role])

    useEffect(() => {
        if (userprograms.status === programStatus.bookmarked) {

            let query = {}
            const filterType = searchParams.get("type");
            const isBookmark = searchParams.get("is_bookmark");
            if (filterType && filterType !== '') {
                query = { type: 'status', value: filterType }
            }

            if (isBookmark && isBookmark !== '') {
                query = { type: 'is_bookmark', value: isBookmark }
            }

            if (role === 'mentee') dispatch(getMenteePrograms(query))
            if (role === 'mentor') dispatch(getUserPrograms(query))
        }
    }, [userprograms.status])


    useEffect(() => {
        if (userprograms.status === programStatus.load) {
            let loadProgram = []
            if (filterType === null && isBookmark === null) {
                loadProgram = userprograms.allprograms
            }

            if (isBookmark !== null && isBookmark !== '') {
                loadProgram = userprograms.bookmarked
            }

            if (filterType !== null && filterType !== '') {
                loadProgram = userprograms[filterType]
            }
            setProgramsList(loadProgram)
        }
    }, [userprograms])

    useEffect(() => {
        if (role === 'mentor') dispatch(getProgramCounts())
        if (role === 'mentee') dispatch(getMenteeProgramCount())
    }, [role])


    return (
        <div className="dashboard-content px-8 mt-10">
            <div className='flex justify-between items-center mb-8'>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={userprograms.loading}
                >
                    {
                        userprograms.loading ?
                            <CircularProgress color="inherit" />
                            : null
                    }
                </Backdrop>
                <div>
                    {programMenusList.find(menu => menu.status === searchParams.get("type"))?.name || (searchParams.get("is_bookmark") ? 'Bookmarked Programs' : 'All Programs')}
                </div>
                {
                    userInfo && userInfo.data && (userInfo.data.role === 'mentor' || userInfo.data.role === 'admin') &&
                    <div>
                        <button onClick={() => navigate('/create-programs')} className='text-[12px] px-3 py-4'
                            style={{ background: '#1D5BBF', color: '#fff', borderRadius: '6px' }}>Create New Program Request</button>
                    </div>
                }

            </div>
            <div className="grid grid-cols-5 gap-3">
                <div className="row-span-3 flex flex-col gap-8">
                    <Card cardTitle={'Programs'} cardContent={programMenusList} />
                    {
                        role === 'mentor' &&
                        <Card cardTitle={'Program Performance'} cardContent={menusList} cardFilter={programFilter} />
                    }

                </div>

                <div className="col-span-4">
                    <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                            <div className="flex gap-4"></div>
                            <div className="flex gap-20 items-center">
                                <img src={SearchIcon} alt="statistics" />

                                <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>
                                    <img src={CalendarIcon} alt="CalendarIcon" />
                                    <select className='focus:outline-none' style={{ background: 'rgba(223, 237, 255, 1)', border: 'none' }}>
                                        <option>Day</option>
                                        <option>Month</option>
                                    </select>
                                </p>
                            </div>

                        </div>
                        <div className="py-3 px-3 flex  flex-wrap">
                            {
                                programsList.length ? programsList.map((program, index) => {
                                    let startDate = ''
                                    if (program.start_date !== '') {
                                        startDate = new Date(program.start_date).toISOString().substring(0, 10).split("-")
                                    }
                                    const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''

                                    return (
                                        <div key={index} className={`curated-programs flex gap-4 items-center py-8 px-9 
                                            ${getWindowDimensions().width <= 1536 ? 'w-[49%]' : 'w-1/3'}`} style={{ opacity: `${program.status === 'yettoapprove' ? '0.5' : 1}` }}>
                                            <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                                <div className="flex py-6 px-7 gap-4 border-b-2 relative">
                                                    <div className="w-6/12 h-full">
                                                        <img className="object-cover w-full h-[150px]" src={program.image} alt="Program Logo" />
                                                    </div>
                                                    <div className="flex flex-col gap-3 w-[90%]">
                                                        {
                                                            program.categories.length ?
                                                                <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-[90px]"
                                                                    style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{program.categories[0].name}</p>
                                                                : null
                                                        }

                                                        <h4 className="text-[16px]">{program.program_name}</h4>
                                                        <span className="text-[12px] line-clamp-2 h-[38px]">{program.description}</span>

                                                        {
                                                            program.status === 'yettoapprove' || program.status === 'draft' ?

                                                                <button className={`text-white text-[12px] py-2 ${program.status === 'draft' ? 'w-[110px]' : 'w-[170px]'}`}
                                                                    onClick={undefined}
                                                                    style={{ background: program.status === 'yettoapprove' ? '#76818E' : 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>
                                                                    {program.status === 'draft' ? 'Continue' : 'Waiting for approval'}

                                                                </button>
                                                                :

                                                                <button className="text-white text-[12px] py-2 w-[90px]"
                                                                    onClick={() => handleNavigation(program)}
                                                                    style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                                        }

                                                    </div>
                                                    {
                                                        program.status !== 'yettoapprove' && program.status !== 'draft' ?

                                                            <img onClick={() => handleBookmark(program)} className="absolute top-4 right-4 cursor-pointer"
                                                                src={program.is_bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon" />
                                                            : null
                                                    }

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
                                                    {
                                                        !statusNotShow.includes(program.status) ?

                                                            <div className="text-[12px] px-2 py-2" style={{ background: `${ProgramStatusInCard[program.status]?.bg}`, 
                                                                color:  `${ProgramStatusInCard[program.status]?.color}`, borderRadius: '3px' }}>
                                                                {ProgramStatusInCard[program.status]?.text}
                                                            </div>

                                                            :

                                                            <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{'10 Mins ago'}</div>


                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                )
                                    : <div>No Programs found</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
