import React, { useEffect, useState } from 'react'
import Card from '../../shared/Card';
import { curatedPrograms, menusList } from '../../utils/mock';
import SearchIcon from '../../assets/icons/search.svg';
import CalenderIcon from '../../assets/icons/Calender.svg';
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg';
import CalendarIcon from '../../assets/images/calender_1x.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, getAllCertificates, getAllMaterials, getAllMembers, getAllSkills, loadAllPrograms } from '../../services/programInfo';
import { programStatus } from '../../utils/constant';
import ProgramImage from "../../assets/images/logo_image.jpg";

export default function Programs() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const [programsList, setProgramsList] = useState([])
    const [programMenusList, setProgramMenusList] = useState([])
    const programInfo = useSelector(state => state.programInfo)
    const userInfo = useSelector(state => state.userInfo)
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

    const menus = [{
        name: "All Programs",
        count: programInfo.allPrograms.length,
        page: '/programs',
        status: 'all'
    },
    {
        name: "Curated Programs",
        count: programInfo.allPrograms.filter(program => program.status === programStatus.planned).length,
        page: '/programs?type=planned',
        status: programStatus.planned
    },
    {
        name: "Recent Join Programs",
        count: programInfo.allPrograms.filter(program => program.status === programStatus.yetToPlan).length,
        page: '/programs?type=yettoplan',
        status: programStatus.yetToPlan
    },
    {
        name: "Ongoing Programs",
        count: programInfo.allPrograms.filter(program => program.status === programStatus.inProgress).length,
        page: '/programs?type=inprogress',
        status: programStatus.inProgress
    },
    {
        name: "Bookmarked Programs",
        count: programInfo.allPrograms.filter(program => program.status === programStatus.bookmarked).length,
        page: '/programs?type=bookmarked',
        status: programStatus.bookmarked
    },
    {
        name: "Completed Programs",
        count: programInfo.allPrograms.filter(program => program.status === programStatus.completed).length,
        page: '/programs?type=completed',
        status: programStatus.completed
    }]

    useEffect(() => {
        setProgramMenusList(menus)
        setProgramsList(programInfo.allPrograms)
    }, [programInfo.allPrograms])

    useEffect(() => {
        if (!programInfo.allPrograms.length) {
            dispatch(loadAllPrograms(curatedPrograms))
        }
    }, [])

    useEffect(() => {
        console.log('searchParams', searchParams)
        const filterType = searchParams.get("type");
        if (filterType && filterType !== '') {
            const allprograms = [...programInfo.allPrograms].filter(program => program.status === filterType)
            setProgramsList(allprograms)
        } else {
            setProgramsList(programInfo.allPrograms)
        }
    }, [searchParams])

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }


    return (
        <div className="dashboard-content px-8 mt-10">
            <div className='flex justify-between items-center mb-8'>
                <div>
                    {menus.find(menu => menu.status === searchParams.get("type"))?.name || 'All Programs'}

                </div>
                {
                    userInfo && userInfo.data && userInfo.data.role === 'mentor' &&
                    <div>
                        <button onClick={() => navigate('/create-programs')} className='text-[12px] px-3 py-4' style={{ background: '#1D5BBF', color: '#fff', borderRadius: '6px' }}>Create New Program Request</button>
                    </div>
                }

            </div>
            <div className="grid grid-cols-5 gap-3">
                <div className="row-span-3 flex flex-col gap-8">
                    <Card cardTitle={'Programs'} cardContent={programMenusList} />
                    <Card cardTitle={'Program Performance'} cardContent={menusList} cardFilter={programFilter} />
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
                                programsList.length ? programsList.map((curatedProgram, index) => {
                                    let startDate = ''
                                    if (curatedProgram.program_start_date !== '') {
                                        startDate = new Date(curatedProgram.program_start_date).toISOString().substring(0, 10).split("-")
                                    }
                                    const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''
                                    console.log('curatedProgram', curatedProgram)
                                    return (
                                        <div key={index} className={`curated-programs flex gap-4 items-center py-8 px-9 ${getWindowDimensions().width <= 1536 ? 'w-[49%]' : 'w-1/3'}`}>
                                            <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                                <div className="flex py-6 px-7 border-b-2 relative">
                                                    <div className="w-6/12 h-full">
                                                        <img className="object-cover w-full h-[150px]" src={ProgramImage} alt="Program Logo" />
                                                    </div>
                                                    <div className="flex flex-col gap-3 w-[90%]">
                                                        <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-[90px]" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{curatedProgram.category}</p>
                                                        <h4 className="text-[16px]">{curatedProgram.program_name}</h4>
                                                        <span className="text-[12px] line-clamp-2 h-[38px]">{curatedProgram.decription}</span>
                                                        <button className="text-white text-[12px] py-2 w-[90px]" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                                    </div>
                                                    <img className="absolute top-4 right-4 cursor-pointer" src={BookmarkedIcon} alt="BookmarkedIcon" />
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
                    </div>
                </div>
            </div>
        </div>
    )
}
