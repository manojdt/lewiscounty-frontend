import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';

import Card from '../../shared/Card';
import ProgramCard from '../../shared/Card/ProgramCard';
import SearchIcon from '../../assets/icons/search.svg';
import CalendarIcon from '../../assets/images/calender_1x.png';

import { pipeUrls, programActionStatus, programMenus, programStatus, statusAction } from '../../utils/constant';
import { getMenteeProgramCount, getMenteePrograms, getProgramCounts, getUserPrograms, updateProgram } from '../../services/userprograms';


export default function Programs() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();

    const [programsList, setProgramsList] = useState([])
    const [programMenusList, setProgramMenusList] = useState([])

    const userInfo = useSelector(state => state.userInfo)
    const userprograms = useSelector(state => state.userPrograms)

    const role = userInfo.data.role || ''

    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");

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


    useEffect(() => {
        const listPrograms = programMenus('program').filter(programs => programs.for.includes(role));

        const totalCount = role === 'mentor' ? userprograms.statusCounts : userprograms.programsCounts

        const programMenu = [...listPrograms].map(menu => {

            if (menu.status === 'all') {
                return { ...menu, count: role === 'mentor' ? userprograms.totalPrograms : totalCount?.allprogram }
            }
            // Mentor Response Count
            if (role === 'mentor' && statusAction.includes(menu.status)) {
                return { ...menu, count: totalCount[menu.mentorStatus] }
            }

            // Mentee Response Count
            if (role === 'mentee') {
                return { ...menu, count: totalCount[menu.menteeStatus] }
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
                if (filterType === 'planned') {
                    loadProgram = userprograms.yettojoin;
                } else {
                    loadProgram = userprograms[filterType]
                }
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
                    {programMenusList.find(menu => menu.status === searchParams.get("type"))?.name ||
                        (searchParams.get("is_bookmark") ? 'Bookmarked Programs' : 'All Programs')}
                </div>
                {
                    userInfo && userInfo.data && (userInfo.data.role === 'mentor' || userInfo.data.role === 'admin') &&
                    <div>
                        <button onClick={() => navigate('/create-programs')} className='text-[13px] px-4 py-4'
                            style={{ background: '#1D5BBF', color: '#fff', borderRadius: '6px' }}>Create New Program</button>
                    </div>
                }

            </div>
            <div className="grid grid-cols-5 gap-3">
                <div className="row-span-3 flex flex-col gap-8">
                    <Card cardTitle={'Programs'} cardContent={programMenusList} />
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
                        <ProgramCard
                            title="Planned Programs"
                            viewpage="/programs?type=yettojoin"
                            handleNavigateDetails={handleNavigation}
                            handleBookmark={handleBookmark}
                            programs={programsList}
                            noTitle
                        />

                      
                    </div>
                </div>
            </div>
        </div>
    )
}
