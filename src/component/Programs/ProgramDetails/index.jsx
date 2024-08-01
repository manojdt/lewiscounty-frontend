import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';

import './program-details.css'
import Carousel from '../../../shared/Carousel';
import { curatedPrograms } from '../../../utils/mock';

import { pipeUrls, programActionStatus, programStatus } from '../../../utils/constant';
import { updateNewPrograms, updateProgramDetails } from '../../../services/programInfo';
import { getMenteeJoinedInProgram, getProgramDetails } from '../../../services/userprograms';

import UserImage from "../../../assets/images/user.jpg";
import LocationIcon from '../../../assets/images/Location1x.png';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import DoubleArrowIcon from '../../../assets/images/double_arrow 1x.png';
import RatingsIcon from '../../../assets/images/ratings1x.png';
import CertificateIcon from '../../../assets/images/certficate1x.png';
import QuoteIcon from '../../../assets/images/quotes1x.png';
import MuiModal from '../../../shared/Modal';
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import api from '../../../services/api';


export default function ProgramDetails() {
    const [loading, setLoading] = useState({ initial: true, join: false })
    const [taskJoined, setTaskJoined] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('about_program')
    const [certificateActiveTab, setCertificateActiveTab] = useState('participated')
    const userdetails = useSelector(state => state.userInfo)
    const { programdetails, loading: programLoading, error, menteeJoined } = useSelector(state => state.userPrograms)
    const role = userdetails.data.role || ''
    const tabs = [
        {
            name: 'About Program',
            key: 'about_program'
        },
        {
            name: 'Program Outcomes',
            key: 'program_outcomes'
        },
        {
            name: 'Program Testimonials',
            key: 'program_testimonials'
        },
    ]

    const participatedTabs = [
        {
            name: 'Participated',
            key: 'participated'
        },
        {
            name: 'Completed',
            key: 'completed'
        },
        {
            name: 'Lorem Ipsum ',
            key: 'ioremipsum '
        },
    ]

    const handleTab = (key) => {
        setActiveTab(key)
    }

    const handleCerificateTab = (key) => {
        setCertificateActiveTab(key)
    }

    useEffect(() => {
        if (Object.keys(programdetails).length) {
            console.log('programdetails.status', programdetails.status)
            if (programdetails.status === programActionStatus.yettostart) {
                if(role === 'mentor') navigate(`${pipeUrls.assigntask}/${programdetails.id}`)
                if(role === 'mentee' && menteeJoined) navigate(`${pipeUrls.startprogram}/${programdetails.id}`)
            }

            else if (programdetails.status === programActionStatus.inprogress || programdetails.status === programActionStatus.assigned) {
                navigate(`${pipeUrls.startprogram}/${programdetails.id}`)
            }


            setLoading({ ...loading, initial: false })
        }
    }, [programdetails])


    useEffect(() => {
        console.log('searchParams', searchParams)
        const programId = params.id;


        if (programId && programId !== '') {
            dispatch(getProgramDetails(programId))
            if (role === 'mentee') { dispatch(getMenteeJoinedInProgram({ id: programId })); }
        }

    }, [params.id, role])

    const handleJoinProgram = async (programId) => {
  
        if (role === 'mentee') {
            const menteeJoinProgram = await api.post('mentee_program/join_program', { id: programId });
            if (menteeJoinProgram.status === 200 && menteeJoinProgram.data) {
                console.log('mssss', menteeJoinProgram)
                setLoading({ initial: false, join: true })
            }
        }
        if (role === 'mentor') setLoading({ initial: false, join: true })

    }

    useEffect(() => {
        if (taskJoined) {
            setTimeout(() => {
                if (role === 'mentor')  navigate(`${pipeUrls.assigntask}/${programdetails.id}`)
                if (role === 'mentee')  navigate(`${pipeUrls.startprogram}/${programdetails.id}`)
            }, [3000])

        }
    }, [taskJoined])

    useEffect(() => {
        if (loading.join) {
            setTimeout(() => {
                setLoading({ ...loading, join: false })
                if (role === 'mentor') navigate(`${pipeUrls.programtask}/${programdetails.id}`)
                if (role === 'mentee') setTaskJoined(true)
            }, [3000])
        }
    }, [loading.join])

    return (
        <div className="px-9 my-6 grid">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading.initial || loading.join || programLoading}

            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <MuiModal modalOpen={taskJoined} modalClose={() => setTaskJoined(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Successfully Joined in a program</p>
                    </div>

                </div>
            </MuiModal>
            {
                Object.keys(programdetails).length ?


                    <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                        <div className='breadcrum'>
                            <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                    <li className="inline-flex items-center">
                                        <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                            Program
                                        </a>
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                                Planned Program Joining details </a>
                                        </div>
                                    </li>

                                </ol>
                            </nav>

                            <div className='content px-8'>
                                <div className='grid grid-cols-3 gap-4 py-6'>

                                    {/* Left Side Content */}
                                    <div className='left-side-content col-span-2'>
                                        <div className='flex items-center gap-6 pb-6'>
                                            <h3 className='font-semibold text-[18px]' style={{ color: 'rgba(29, 91, 191, 1)' }}>{programdetails.program_name}</h3>
                                            {
                                                programdetails.categories.length &&

                                                <div className='text-[10px] px-3 py-2' style={{
                                                    background: 'rgba(238, 240, 244, 1)',
                                                    color: 'rgba(253, 0, 58, 1)',
                                                    borderRadius: '5px'
                                                }}>
                                                    {programdetails.categories[0].name}
                                                </div>
                                            }

                                        </div>

                                        <div className='text-[12px]'>
                                            {programdetails.description}
                                        </div>

                                        <div className='flex gap-6 py-6'>
                                            <div className='flex gap-2 items-center'>
                                                <img src={LocationIcon} alt="LocationIcon" />
                                                <span className='text-[12px]'>
                                                    {programdetails.venue}
                                                </span>
                                            </div>
                                            <div style={{ borderRight: '1px solid rgba(24, 40, 61, 1)' }}></div>

                                            <div className='flex gap-3 items-center'>
                                                <img src={CalendarIcon} alt="CalendarIcon" />
                                                <span className='text-[12px]'>

                                                    Begins Jun 5th and 6:00Pm
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3 text-[12px]' >
                                            <img src={UserImage} style={{ borderRadius: '50%', width: '35px', height: '35px' }} alt="UserImage" />
                                            <span>Instructor :</span>
                                            <span>{userdetails.data.first_name}{' '} {userdetails.data.last_name}</span>
                                        </div>

                                        {
                                            role === 'mentor' || (role === 'mentee' && !menteeJoined) &&

                                            <div className='py-9'>
                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                    borderRadius: '5px'
                                                }}
                                                    onClick={() => handleJoinProgram(programdetails.id)}
                                                >Join Program
                                                    <span className='pl-8 pt-1'><img style={{ width: '15px', height: '13px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span>
                                                </button>
                                            </div>
                                        }


                                    </div>





                                    {/* Right Side Content */}
                                    <div className='right-side-content'>
                                        <div style={{ border: '1px solid rgba(223, 237, 255, 1)', borderRadius: '10px' }}
                                            className='px-6 pt-6 pb-3'>
                                            <ul className='flex flex-col gap-3'>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px' }}>
                                                    <span>Ratings</span>
                                                    <span className='flex gap-2 items-center'>
                                                        <img src={RatingsIcon} style={{ width: '12px', height: '12px' }} alt="RatingsIcon" />
                                                        4.8 (36,763 reviews)</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}>
                                                    <span>Course Level</span>
                                                    <span>{programdetails.course_level}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Date</span>
                                                    <span>06/5/2024</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Duration</span>
                                                    <span>{programdetails.duration}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Schedule</span>
                                                    <span>Flexible schedule</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ paddingTop: '14px' }}> <span>Mentees</span>
                                                    <span>{programdetails.members.length}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>

                                {/* Detail Section */}
                                <div className='details-section px-6 py-11 mb-10' style={{ background: 'rgba(249, 249, 249, 1)', borderRadius: '10px' }}>
                                    <div className='tabs flex gap-4'>
                                        {
                                            tabs.map((tab) =>
                                                <button key={tab.key}
                                                    className={`px-12 py-3 text-[12px] ${activeTab === tab.key ? 'tab-active' : 'tab'} `}
                                                    onClick={() => handleTab(tab.key)}>
                                                    {tab.name}
                                                </button>)
                                        }
                                    </div>
                                    <div className='tab-content px-6 pt-10 text-[12px]'>
                                        <div className={`about-programs ${activeTab === 'about_program' ? 'block' : 'hidden'}`}>
                                            <div className='learning'>
                                                <div className='font-semibold pb-3'>What you'll learn</div>
                                                {programdetails.about_program}
                                            </div>
                                            {
                                                programdetails.skills.length ?

                                                    <div className='skills pt-8'>
                                                        <div className='font-semibold pb-5'>Skills you'll gain</div>
                                                        <ul className='flex gap-3'>
                                                            {
                                                                programdetails.skills.map((skills) =>
                                                                    <li key={skills.id} className='px-8 py-3' style={{ background: 'rgba(234, 237, 240, 1)', borderRadius: '30px' }}>{skills.name}</li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                    : null
                                            }


                                            <div className='sponsor pt-8'>
                                                <div className='font-semibold pb-5'>Sponsored by </div>
                                                <ul className='flex gap-5'>
                                                    <img style={{ width: '100px', height: '100px' }} src={programdetails.image} alt="SponsorIcon" />
                                                </ul>
                                            </div>

                                        </div>

                                        <div className={`program-outcomes ${activeTab === 'program_outcomes' ? 'block' : 'hidden'}`}>
                                            <div className='benefits'>
                                                <div className='font-semibold pb-3'>Benefits</div>
                                                {
                                                    programdetails.benefits
                                                }
                                                {/* <ul className='leading-9 list-disc ml-4'>
                                                    <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                                    <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                                    <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                                </ul> */}
                                            </div>
                                            <div className='program-certificate pt-8'>
                                                <div className='font-semibold pb-3'>Program Certificate -
                                                    {
                                                        programdetails.certifications.length <= 9 ? ' 0' + programdetails.certifications.length : programdetails.certifications.length}
                                                </div>
                                                <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
                                                    <ul className="flex flex-wrap -mb-px">
                                                        {
                                                            participatedTabs.map(participatedTab =>

                                                                <li className="me-2" key={participatedTab.key}>
                                                                    <p className={`inline-block p-4 border-b-2 cursor-pointer border-transparent rounded-t-lg ${certificateActiveTab === participatedTab.key ? 'active  text-blue-600 border-blue-500' : ''} `}
                                                                        onClick={() => handleCerificateTab(participatedTab.key)}
                                                                    >{participatedTab.name}</p>
                                                                </li>

                                                            )
                                                        }

                                                    </ul>
                                                </div>

                                                {
                                                    participatedTabs.map(participatedTab =>

                                                        <div className={`certificate-tab-content flex items-center justify-between relative ${participatedTab.key === certificateActiveTab ? 'block' : 'hidden'}`} key={participatedTab.key}>
                                                            <div className='px-9 py-16 w-4/6 leading-6'>
                                                                {participatedTab.key} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                                                galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting,
                                                                remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.
                                                            </div>
                                                            <img className='absolute right-0' src={CertificateIcon} alt="CertificateIcon" />
                                                        </div>

                                                    )
                                                }



                                            </div>
                                        </div>


                                        <div className={`program-outcomes ${activeTab === 'program_testimonials' ? 'block' : 'hidden'}`}>
                                            <div className='testimonials bg-white px-5 py-7'>
                                                <div className='flex justify-end'>
                                                    <button className='py-2 px-6 mb-10' style={{ color: 'rgba(29, 91, 191, 1)', border: '1px dotted rgba(29, 91, 191, 1)', borderRadius: '3px' }}>Request Testimonials</button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-8">

                                                    <div className='pt-16 pb-2 px-7 leading-5 relative' style={{ background: 'rgba(248, 249, 250, 1)', }}>
                                                        <img src={QuoteIcon} className='absolute top-[-16px]' alt="QuoteIcon" />
                                                        <div className='relative'>
                                                            <p className='pb-7'>
                                                                {programdetails.testimonial_types}
                                                            </p>
                                                            <hr className='absolute' style={{ width: '496px', left: '-15px' }} />
                                                        </div>

                                                        <div className='flex gap-3 py-5'>
                                                            <img src={UserImage} alt="user" style={{ borderRadius: '50%', width: '38px', height: '35px' }} />
                                                            <div className='flex flex-col'>
                                                                <span style={{ color: 'rgba(0, 174, 189, 1)' }}>Alexander Johnson</span>
                                                                <span>Mentor</span>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {/* <div className='pt-16 pb-2 px-7 leading-5 relative' style={{ background: 'rgba(248, 249, 250, 1)', }}>
                                                        <img src={QuoteIcon} className='absolute top-[-16px]' alt="QuoteIcon" />
                                                        <div className='relative'>
                                                            <p className='pb-7'>
                                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                                ook.standard dummy text ever since the 1500s, ook.
                                                            </p>
                                                            <hr className='absolute' style={{ width: '496px', left: '-15px' }} />
                                                        </div>

                                                        <div className='flex gap-3 py-5'>
                                                            <img src={UserImage} alt="user" style={{ borderRadius: '50%', width: '38px', height: '35px' }} />
                                                            <div className='flex flex-col'>
                                                                <span style={{ color: 'rgba(0, 174, 189, 1)' }}>Alexander Johnson</span>
                                                                <span>Mentor</span>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className='pt-16 pb-2 px-7 leading-5 relative' style={{ background: 'rgba(248, 249, 250, 1)', }}>
                                                        <img src={QuoteIcon} className='absolute top-[-16px]' alt="QuoteIcon" />
                                                        <div className='relative'>
                                                            <p className='pb-7'>
                                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                                ook.standard dummy text ever since the 1500s, ook.
                                                            </p>
                                                            <hr className='absolute' style={{ width: '496px', left: '-15px' }} />
                                                        </div>

                                                        <div className='flex gap-3 py-5'>
                                                            <img src={UserImage} alt="user" style={{ borderRadius: '50%', width: '38px', height: '35px' }} />
                                                            <div className='flex flex-col'>
                                                                <span style={{ color: 'rgba(0, 174, 189, 1)' }}>Alexander Johnson</span>
                                                                <span>Mentor</span>
                                                            </div>
                                                        </div>

                                                    </div> */}
                                                </div>
                                            </div>





                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    : null
            }

        </div >
    )

}
