import React, { useEffect, useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Calendar } from 'primereact/calendar';

import UserImage from "../../../assets/images/user.jpg";
import LocationIcon from '../../../assets/images/Location1x.png';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import RatingsIcon from '../../../assets/images/ratings1x.png';
import SponsorIcon from '../../../assets/images/program_logo1x.png';
import CertificateIcon from '../../../assets/images/certficate1x.png';
import QuoteIcon from '../../../assets/images/quotes1x.png';
import PlusIcon from '../../../assets/images/plus_temp.png';
import MoreIcon from '../../../assets/images/more1x.png';
import ShareIcon from '../../../assets/images/share1x.png';
import DiscussionsIcon from '../../../assets/images/discussions1x.png';
import RescheduleIcon from '../../../assets/images/reschedule1x.png';
import CreateTaskIcon from '../../../assets/images/create-task-from-mentees1x.png';
import AbortIcon from '../../../assets/images/abort1x.png';
import WaitingIcon from '../../../assets/images/waiting1x.png';
import SuccessTik from '../../../assets/images/blue_tik1x.png';

import LinkIcon from '../../../assets/images/link1x.png';
import LinkedInIcon from '../../../assets/images/linked-in1x.png';
import InstagramIcon from '../../../assets/images/instagram_1x.png';
import FacebookOutlineIcon from '../../../assets/images/facebook-outline1x.png';
import TwitterIcon from '../../../assets/images/twitter1x.png';
import CancelIcon from '../../../assets/images/cancel-colour1x.png';
import PauseIcon from '../../../assets/images/pause1x.png';
import ResumeIcon from '../../../assets/images/resume1x.png';
import CompleteIcon from '../../../assets/images/completed1x.png'
import PlusCircle from '../../../assets/icons/Pluscircle.svg'


import './program-details.css'
import Carousel from '../../../shared/Carousel';
import { curatedPrograms } from '../../../utils/mock';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MuiModal from '../../../shared/Modal';
import { Button } from '../../../shared';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { pipeUrls, programActionStatus, programStatus, requestStatus } from '../../../utils/constant';
import { updateNewPrograms } from '../../../services/programInfo';
import { getProgramDetails, updateProgram } from '../../../services/userprograms';
import { Backdrop, CircularProgress } from '@mui/material';
import useTimer from '../../../hooks/useTimer';
import SkillsSet from '../../SkillsSet';
import api from '../../../services/api';
import { programCancelRequest, programRescheduleRequest, updateLocalRequest } from '../../../services/request';
import './details.css'
import { formatDateFunToAll, formatDateTimeISO, todatDateInfo } from '../../../utils';


export default function AssignTask() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams();

    const timerData = useTimer()

    const { allPrograms, programDetails } = useSelector(state => state.programInfo)
    const userdetails = useSelector(state => state.userInfo)
    const { programdetails, loading: programLoading, error, status } = useSelector(state => state.userPrograms)

    const { loading: requestLoading, status: requestStatusInfo, error: requestError } = useSelector(state => state.requestList);
    const [currentPage, setCurrentPage] = useState('')
    const location = useLocation()
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState({ initial: true, task: false })
    const [activeTab, setActiveTab] = useState('about_program')
    const [certificateActiveTab, setCertificateActiveTab] = useState('participated')
    const [startProgramModal, setStartProgramModal] = useState({ loading: false, success: false })
    const [moreMenuModal, setMoreMenuModal] = useState({ share: false, reschedule: false })
    const [timer, setTimer] = useState({ hrs: 0, min: 20, sec: 0, })
    const [dateFormat, setDateFormat] = useState({})
    const role = userdetails.data.role || ''

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();


    const dateInfo = todatDateInfo()


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


    const handleActionPage = async () => {


        // if (programdetails.status === programActionStatus.yettostart) {
        //     navigate(`${pipeUrls.assignmentess}/${programdetails.id}`)
        // }

        if (programdetails.status === programActionStatus.yettostart) {
            setLoading({ initial: true, task: false })
            const startProgramRequest = await api.post('start_program', { id: parseInt(params.id) });
            if ((startProgramRequest.status === 201 || startProgramRequest.status === 200) && startProgramRequest.data) {
                setLoading({ initial: false, task: false })
                dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.inprogress })).then(() => {
                    dispatch(getProgramDetails(parseInt(params.id)))
                })

            }
        }

        if (programdetails.status === programActionStatus.started) {
            dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.inprogress }))
        }

        if (programdetails.status === programActionStatus.inprogress) {
            dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.paused }))
        }

        if (programdetails.status === programStatus.paused) {
            dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.inprogress }))
        }
    }

    const handleMenu = (key) => {
        switch (key) {
            case 'create-task':
                navigate('/assign-mentees/1')
                handleClose()
                break;
            case 'share':
                setMoreMenuModal({ ...moreMenuModal, share: true });
                handleClose()
                break
            case 'reschedule':
                setMoreMenuModal({ ...moreMenuModal, reschedule: true })
                handleClose()
                break;

            case 'cancel':
                setMoreMenuModal({ ...moreMenuModal, reschedule: false, cancel: true })
                handleClose()
                break;
            case 'discussion':
                break;
            default:
                break
        }
    }

    const onSubmit = (data) => {
        if (moreMenuModal.reschedule) {

            const timeFormat = (utcTimestamp) => {
                let timeString = ''
                const t = utcTimestamp.toString().split(' ')
                if (t.length > 4) {
                    let time = t[4].split(':')
                    timeString = `${time[0]}:${time[1]}`
                }
                return timeString
            }

            const date = new Date(data.reschedule_date);

            // Format the date to "YYYY-MM-DD"
            const formattedDate = date.toISOString().split('T')[0];

            const payload = {
                reschedule_date: formattedDate,
                program_id: params.id,
                reschedule_time: timeFormat(data.reschedule_time),
                reason: data.reason
            }


            dispatch(programRescheduleRequest(payload))
        }

        if (moreMenuModal.cancel) {
            dispatch(programCancelRequest({
                program_id: params.id,
                reason: data.cancel_reason
            }))
        }
    }

    const handleComplete = (programId) => {
        handleClose()
        dispatch(updateProgram({ id: programdetails.id, status: programActionStatus.completed }))
        navigate(`/program-completion/${programId}`)
    }

    const handleMoreMenuClosePopup = () => {
        setMoreMenuModal({ share: false, reschedule: false, cancel: false })
        reset()
    }

    useEffect(() => {
        if (requestStatusInfo === requestStatus.reschedule || requestStatusInfo === requestStatus.cancel) {
            setMoreMenuModal({ share: false, reschedule: false })
            reset()
            setDateFormat({})
            setTimeout(() => {
                dispatch(getProgramDetails(parseInt(params.id)))
                dispatch(updateLocalRequest({ status: '' }))

            }, 3000)
        }
    }, [requestStatusInfo])

    useEffect(() => {
        const pathname = location.pathname.split('/')
        if (pathname.length && pathname.includes('assign-task')) {
            setCurrentPage('assigntask')
        }
        if (pathname.length && pathname.includes('start-program')) {
            setCurrentPage('startprogram')
        }
    }, [location])

    useEffect(() => {
        if (startProgramModal.loading) {
            setTimeout(() => {
                setStartProgramModal({ loading: false, success: true })
            }, [4000])
        }

        if (startProgramModal.success) {
            setTimeout(() => {
                setStartProgramModal({ loading: false, success: false })
                // navigate('/program-completion/1')
            }, [2000])
        }
    }, [startProgramModal])

    useEffect(() => {
        const programId = params.id;

        if (programId && programId !== '') {
            dispatch(getProgramDetails(programId))
        }

    }, [params.id])

    useEffect(() => {
        if (Object.keys(programdetails).length) {
            setLoading({ ...loading, initial: false })

            if (role === 'mentee' && window.location.href.includes('assign-task')) {
                navigate(`/start-program/${programdetails.id}`)
            }

            // if (role === 'mentor' && window.location.href.includes('start-program') && programdetails.status === programActionStatus.yettostart) {
            //     navigate(`/assign-task/${programdetails.id}`)
            // }

            // if (programdetails.status === programActionStatus.paused) {
            //     timerData.stopTimer()
            // }

            // if (programdetails.status === programActionStatus.inprogress) {
            //     timerData.startTimer(0, 20, 0)
            // }

            if (programdetails.status === programActionStatus.completed) {
                navigate('/programs')
            }
        }
    }, [programdetails, role])

    const handleDateClick = () => {
        document.querySelector('.p-datepicker')?.classList.add('program-date-picker')
    }

    const handleTimeClick = () => {
        document.querySelector('.p-datepicker')?.classList.add('program-time-picker')
    }


    useEffect(() => {
        return () => {
            document.querySelector('.p-datepicker')?.classList.remove('program-date-picker')
            document.querySelector('.p-datepicker')?.classList.remove('program-time-picker')
        }
    }, [])


    const programApprovalStage = {
        yettoapprove: { status: 'yettoapprove', text: 'Waiting for admin approval' },
        join_request_submitted: { status: 'join_request_submitted', text: 'Waiting for admin approval' },
        start_request_submitted: { status: 'start_request_submitted', text: 'Waiting for admin approval' },
        schedule_request_submitted: { status: 'schedule_request_submitted', text: 'Waiting for admin approval' },
        cancel_request_submitted: { status: 'cancel_request_submitted', text: 'Waiting for admin approval' },
    }

    const dateField = moreMenuModal.reschedule ? register('reschedule_date', { required: "This field is required" }) : undefined
    const timeField = moreMenuModal.reschedule ? register('reschedule_time', { required: "This field is required" }) : undefined

    return (
        <div className="px-9 my-6 grid">

            <Backdrop
                sx={{ color: '#fff', zIndex: 9999999 }}
                open={loading.initial || loading.join || programLoading || requestLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {
                Object.keys(programdetails).length && !programLoading ?
                    <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                        <div className='breadcrum'>
                            <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                    <li className="inline-flex items-center">
                                        <div className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                            Program
                                        </div>
                                        <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <div className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                                Planned Program </div>
                                        </div>
                                    </li>

                                </ol>

                                {
                                    role !== 'admin' &&

                                    <>
                                        <div className='cursor-pointer' onClick={handleClick}>
                                            <img src={MoreIcon} alt='MoreIcon' />
                                        </div>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            {
                                                currentPage === 'assigntask1' ?
                                                    <>
                                                        <MenuItem onClick={() => handleMenu('create-task')} className='!text-[12px]'>
                                                            <img src={CreateTaskIcon} alt="CreateTaskIcon" className='pr-3 w-[25px]' />
                                                            Create Task for Mentees</MenuItem>
                                                        <MenuItem onClick={() => handleMenu('share')} className='!text-[12px]'>
                                                            <img src={ShareIcon} alt="ShareIcon" className='pr-3 w-[25px]' />
                                                            Share
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleMenu('reschedule')} className='!text-[12px]'>
                                                            <img src={RescheduleIcon} alt="RescheduleIcon" className='pr-3 w-[25px]' /> Reschedule</MenuItem>
                                                        <MenuItem onClick={() => handleMenu('discussion')} className='!text-[12px]'>
                                                            <img src={DiscussionsIcon} alt="DiscussionsIcon" className='pr-3 w-[25px]' />Discussions</MenuItem>
                                                    </>
                                                    :
                                                    currentPage === 'startprogram' ?
                                                        <>
                                                            {
                                                                role === 'mentor' &&

                                                                <>

                                                                    {
                                                                        programdetails.status === programActionStatus.paused &&

                                                                        <MenuItem onClick={handleClose} className='!text-[12px]'>
                                                                            <img src={ResumeIcon} alt="ResumeIcon" className='pr-3 w-[25px]' />
                                                                            Resume</MenuItem>
                                                                    }

                                                                    {

                                                                        <MenuItem onClick={() => handleMenu('cancel')} className='!text-[12px]'>
                                                                            <img src={AbortIcon} alt="AbortIcon" className='pr-3 w-[25px]' />
                                                                            Abort</MenuItem>
                                                                    }
                                                                    <MenuItem onClick={() => handleMenu('reschedule')} className='!text-[12px]'>
                                                                        <img src={RescheduleIcon} alt="RescheduleIcon" className='pr-3 w-[25px]' />
                                                                        Reschedule
                                                                    </MenuItem>
                                                                    <MenuItem onClick={handleClose} className='!text-[12px]'>
                                                                        <img src={ShareIcon} alt="ShareIcon" className='pr-3 w-[25px]' /> Share</MenuItem>
                                                                    {
                                                                        (programdetails.status === programActionStatus.inprogress
                                                                            || programdetails.status === programActionStatus.assigned

                                                                        ) &&
                                                                        <>
                                                                            <MenuItem onClick={() => handleComplete(programDetails.id)} className='!text-[12px]'>
                                                                                <img src={CompleteIcon} alt="AbortIcon" className='pr-3 w-[25px]' />
                                                                                Complete</MenuItem>
                                                                            <MenuItem onClick={() => navigate(`${pipeUrls.assignmentess}/${programdetails.id}`)} className='!text-[12px]'>
                                                                        <img src={PlusCircle} alt="PlusCircle" className='pr-3 w-[25px]' />Assign Task to Mentees</MenuItem>
                                                                        </>
                                                                    }
                                                                </>
                                                            }

                                                            {
                                                                role === 'mentee' &&

                                                                <>
                                                                  {
                                                                        programdetails.status === programActionStatus.inprogress &&

                                                                        <MenuItem onClick={() => handleMenu('cancel')} className='!text-[12px]'>
                                                                            <img src={AbortIcon} alt="AbortIcon" className='pr-3 w-[25px]' />
                                                                            Cancel</MenuItem>
                                                                    }
                                                                </>
                                                            }



                                                        </>
                                                        : null
                                            }

                                        </Menu>
                                    </>
                                }

                            </nav>
                            <div className='content px-8'>
                                <div className='grid grid-cols-3 gap-4 py-6'>

                                    {/* Left Side Content */}
                                    <div className='left-side-content col-span-2'>
                                        <div className='flex items-center gap-6 pb-6'>
                                            <h3 className='font-semibold text-[18px]' style={{ color: 'rgba(29, 91, 191, 1)' }}>{programdetails.program_name}</h3>
                                            {
                                                programdetails.categories.length ?

                                                    <div className='text-[10px] px-3 py-2' style={{
                                                        background: 'rgba(238, 240, 244, 1)',
                                                        color: 'rgba(253, 0, 58, 1)',
                                                        borderRadius: '5px'
                                                    }}>
                                                        {programdetails.categories[0].name}
                                                    </div>
                                                    : null
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
                                                    {formatDateTimeISO(programdetails?.start_date)}
                                                </span>
                                            </div>

                                            <div style={{ borderRight: '1px solid rgba(24, 40, 61, 1)' }}></div>

                                            <div className='flex gap-3 items-center text-[12px]'>
                                                <img src={UserImage} style={{ borderRadius: '50%', width: '35px', height: '35px' }} alt="UserImage" />
                                                <span>Instructor :</span>
                                                <span style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', cursor: 'pointer' }}>{userdetails.data.first_name}{' '} {userdetails.data.last_name}</span>
                                            </div>

                                        </div>

                                        {
                                            programdetails.learning_materials.length ?
                                                <div>
                                                    <p className='pb-3'>Our Learning Materials</p>
                                                    <div className='flex gap-3  items-center'>
                                                        {
                                                            programdetails.learning_materials.map(materials =>
                                                                <span className='py-2 px-6 text-[12px]' style={{ background: 'rgba(242, 242, 242, 1)', borderRadius: '30px' }}>
                                                                    {materials.name}
                                                                </span>


                                                            )
                                                        }

                                                        <span className='ml-10 cursor-pointer'>
                                                            <img src={PlusIcon} alt="PlusIcon" />
                                                        </span>
                                                    </div>
                                                </div>

                                                :
                                                null
                                        }

                                        <div className='discussions pt-8 flex gap-6'>
                                            <button
                                                className='text-[12px] py-3 px-9 cursor-pointer'
                                                style={{
                                                    border: '1px dotted rgba(29, 91, 191, 1)', color: 'rgba(29, 91, 191, 1)', background: 'rgba(29, 91, 191, 0.05)',
                                                    borderRadius: '3px'
                                                }}>Program Discussions</button>

                                            <button
                                                className='text-[12px] py-3 px-9 cursor-pointer'
                                                style={{
                                                    border: '1px dotted rgba(29, 91, 191, 1)', color: 'rgba(29, 91, 191, 1)', background: 'rgba(29, 91, 191, 0.05)',
                                                    borderRadius: '3px'
                                                }}>Individual Discussions</button>
                                        </div>



                                        <div className='py-9'>
                                            {
                                                role === 'mentor' ?
                                                    <>
                                                        {programApprovalStage[programdetails.status] ?
                                                            <div className='flex gap-4 pt-10' >
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    border: "1px solid #E0382D",
                                                                    borderRadius: '5px',
                                                                    color: '#E0382D',
                                                                    cursor: 'not-allowed'
                                                                }}
                                                                    onClick={() => undefined}
                                                                >
                                                                    <i className="pi pi-clock" style={{ color: 'red' }}></i>
                                                                    <span className='pl-3'>{programApprovalStage[programdetails.status]?.text}</span>
                                                                </button>
                                                            </div>
                                                            :
                                                            programdetails.status === 'draft' ?
                                                                <div className='py-9'>
                                                                    <div className='py-3 px-16 text-white text-[14px] flex justify-center items-center' style={{
                                                                        background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                                        borderRadius: '5px',
                                                                        width: '30%'
                                                                    }}>Drafted</div>
                                                                </div>
                                                                :

                                                                null
                                                        }
                                                    </>
                                                    : null

                                            }
                                            {
                                                programdetails.status === programActionStatus.inprogress || programdetails.status === programActionStatus.paused
                                                    || programdetails.status === programActionStatus.started

                                                    ?

                                                    <div className='flex gap-9'>

                                                        <div className='flex gap-2 items-center justify-center'>
                                                            <p className="flex flex-col gap-2 items-center justify-center">
                                                                <span className='px-2 py-1 text-[20px] w-[40px] flex justify-center items-center'
                                                                    style={{ background: 'rgba(231, 241, 242, 1)', color: 'rgba(0, 174, 189, 1)', borderRadius: '5px', fontWeight: 700 }}>{dateInfo.month}</span>
                                                                <span className="text-[12px]" style={{ color: 'rgba(118, 118, 118, 1)' }}>Month</span>
                                                            </p>
                                                            <p className='flex justify-center items-baseline pt-2 h-full w-full font-bold'>-</p>
                                                            <p className="flex flex-col gap-2 items-center justify-center">
                                                                <span className='px-2 py-1 text-[20px] w-[40px] flex justify-center items-center'
                                                                    style={{ background: 'rgba(231, 241, 242, 1)', color: 'rgba(0, 174, 189, 1)', borderRadius: '5px', fontWeight: 700 }}>{dateInfo.date}</span>
                                                                <span className="text-[12px]" style={{ color: 'rgba(118, 118, 118, 1)' }}>Day</span>
                                                            </p>
                                                            <p className='flex justify-center items-baseline pt-2 h-full w-full font-bold'>-</p>
                                                            <p className="flex flex-col gap-2 items-center justify-center">
                                                                <span className='px-2 py-1 text-[20px] w-[70px] flex justify-center items-center'
                                                                    style={{ background: 'rgba(231, 241, 242, 1)', color: 'rgba(0, 174, 189, 1)', borderRadius: '5px', fontWeight: 700 }}>{dateInfo.year}</span>
                                                                <span className="text-[12px]" style={{ color: 'rgba(118, 118, 118, 1)' }}>Year</span>
                                                            </p>
                                                        </div>

                                                        {/* <div className='flex gap-6 items-center justify-center'>
                                                            <p className="flex flex-col gap-2 items-center justify-center">
                                                                <span className='px-2 py-1 text-[20px] w-[40px] flex justify-center items-center'
                                                                    style={{ background: 'rgba(231, 241, 242, 1)', color: 'rgba(0, 174, 189, 1)', borderRadius: '5px', fontWeight: 700 }}>{timerData.hours}</span>
                                                                <span className="text-[12px]" style={{ color: 'rgba(118, 118, 118, 1)' }}>Hrs</span>
                                                            </p>
                                                            <p className="flex flex-col gap-2 items-center justify-center">
                                                                <span className='px-2 py-1 text-[20px] w-[40px] flex justify-center items-center'
                                                                    style={{ background: 'rgba(231, 241, 242, 1)', color: 'rgba(0, 174, 189, 1)', borderRadius: '5px', fontWeight: 700 }}>{timerData.minutes}</span>
                                                                <span className="text-[12px]" style={{ color: 'rgba(118, 118, 118, 1)' }}>Mins</span>
                                                            </p>
                                                            <p className="flex flex-col gap-2 items-center justify-center">
                                                                <span className='px-2 py-1 text-[20px] w-[40px] flex justify-center items-center'
                                                                    style={{ background: 'rgba(231, 241, 242, 1)', color: 'rgba(0, 174, 189, 1)', borderRadius: '5px', fontWeight: 700 }}>{timerData.seconds}</span>
                                                                <span className="text-[12px]" style={{ color: 'rgba(118, 118, 118, 1)' }}>Secs</span>
                                                            </p>
                                                        </div> */}

                                                        <>
                                                            {
                                                                role === 'mentor' &&
                                                                <button className='py-3 px-10 text-white text-[14px] flex items-center w-[200px] justify-center' title="Pause" style={{
                                                                    color: programdetails.status !== programActionStatus.paused && programdetails.status !== programActionStatus.assigned ? 'rgba(29, 91, 191, 1)' : '#fff',
                                                                    borderRadius: '5px',
                                                                    border: '1px solid rgba(29, 91, 191, 1)',
                                                                    background: programdetails.status === programActionStatus.paused || programdetails.status === programActionStatus.assigned ? 'linear-gradient(97.32deg, #1D5BBF -32.84%, #00AEBD 128.72%)' : 'transparent'
                                                                }}
                                                                    onClick={handleActionPage}
                                                                >
                                                                    <img src={programdetails.status !== programActionStatus.inprogress ? ResumeIcon : PauseIcon} alt={programdetails.status !== programActionStatus.inprogress ? 'ResumeIcon' : 'PauseIcon'} className='pr-4' />
                                                                    {programdetails.status === programActionStatus.inprogress ? 'Pause' : 'Start'}</button>
                                                            }

                                                            {/* {
                                                                role === 'mentee' &&
                                                                <div>
                                                                    <p className="flex flex-col  items-center justify-center">
                                                                        <span className='px-2 py-1 text-[16px]'
                                                                            style={{
                                                                                color: 'background: rgba(0, 0, 0, 1)',
                                                                                borderRadius: '5px', fontWeight: 700
                                                                            }}>EST. TIME LEFT</span>
                                                                        <span className="text-[16px]" style={{ color: 'rgba(255, 67, 0, 1)' }}>2 Hours 30 mins</span>
                                                                    </p>
                                                                </div>
                                                            } */}


                                                        </>

                                                    </div>
                                                    : null
                                            }

                                            {/* {
                                                (programdetails.status === programActionStatus.yettostart && role === 'mentor') &&

                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                    borderRadius: '5px'
                                                }}
                                                    onClick={handleActionPage}
                                                >
                                                    Assign Task To Mentees

                                                </button>
                                            } */}

                                            {
                                                (programdetails.status === programActionStatus.yettostart && role === 'mentor') &&

                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                    borderRadius: '5px'
                                                }}
                                                    onClick={handleActionPage}
                                                >
                                                    Start Program

                                                </button>
                                            }



                                            {/* {
                                                programdetails.status !== programActionStatus.inprogress && programdetails.status !== programActionStatus.paused &&
                                                programdetails.status !== programActionStatus.yettojoin && programdetails.status !== programActionStatus.assigned &&
                                                programdetails.status !== programActionStatus.yettostart &&
                                                role !== 'mentee' &&

                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                    borderRadius: '5px'
                                                }}
                                                    onClick={handleActionPage}
                                                >{
                                                        (programdetails.status === programActionStatus.yettostart && !programdetails.task.length) ? 'Assign Task To  Mentees'
                                                            : (
                                                                programdetails.status === programActionStatus.assigned
                                                                || programdetails.status === programActionStatus.yettostart && programdetails.task.length
                                                            )
                                                                ? 'Start Program Request' :
                                                                'Join Program'}

                                                </button>
                                            } */}

                                        </div>



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
                                                    <span>{`${formatDateFunToAll(programdetails?.start_date)}  &  ${formatDateFunToAll(programdetails?.end_date)} `}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Duration</span>
                                                    <span>{programdetails.duration}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Schedule</span>
                                                    <span>Flexible schedule</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ paddingTop: '14px' }}> <span>Mentees</span>
                                                    <span className='underline cursor-pointer'>{programdetails.members.length}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>


                                {/* {
                                    role === 'mentee' && (programdetails.status === programActionStatus.inprogress || programdetails.status === programActionStatus.paused) &&
                                    <SkillsSet programdetails={programdetails} />
                                } */}


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
                                                                <span style={{ color: 'rgba(0, 174, 189, 1)' }}>{userdetails.data.first_name}{' '} {userdetails.data.last_name}</span>
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


                            <MuiModal modalOpen={startProgramModal.loading} modalClose={() => setStartProgramModal({ loading: false, success: false })} noheader>
                                <div className='px-5 py-1 flex justify-center items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                    >
                                        <img src={WaitingIcon} alt="SuccessTik" />
                                        <p className='text-[12px]' style={{ color: 'rgba(29, 91, 191, 1)' }}>Waiting for Mentor Manager Approval</p>
                                    </div>

                                </div>
                            </MuiModal>

                            <MuiModal modalOpen={requestStatusInfo === requestStatus.reschedule || requestStatusInfo === requestStatus.cancel} modalClose={() => undefined} noheader>
                                <div className='px-5 py-1 flex justify-center items-center'>
                                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                        <img src={SuccessTik} alt="SuccessTik" />
                                        <p className='text-white text-[12px]'>Program {requestStatusInfo === requestStatus.reschedule ? 'Rescheduled ' :
                                            requestStatusInfo === requestStatus.cancel ? 'Cancelled ' : ''
                                        } Successfully</p>
                                    </div>

                                </div>
                            </MuiModal>

                            <MuiModal modalOpen={startProgramModal.success} modalClose={() => setStartProgramModal({ loading: false, success: false })} noheader>
                                <div className='px-5 py-1 flex justify-center items-center'>
                                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                        <img src={SuccessTik} alt="SuccessTik" />
                                        <p className='text-white text-[12px]'>Started Request Approved by Mentor Manager</p>
                                    </div>

                                </div>
                            </MuiModal>

                            <MuiModal modalOpen={moreMenuModal.share} modalClose={handleMoreMenuClosePopup} noheader>
                                <div className='px-5 py-1 flex justify-center items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                    <div className='flex justify-center items-center flex-col gap-8 py-10 px-20 mt-5'
                                    >
                                        <div>Teaching Program</div>
                                        <input className='input-bg text-[12px] h-[60px] w-[396px] px-5' style={{ borderRadius: '27px' }} value="http://www.company.com:81/a/b/c.html?user=Alice&year=2008#p2" />
                                        <div className='flex gap-7'>
                                            <img className='cursor-pointer' src={LinkIcon} alt="LinkIcon" />
                                            <img className='cursor-pointer' src={LinkedInIcon} alt="LinkedInIcon" />
                                            <img className='cursor-pointer' src={InstagramIcon} alt="InstagramIcon" />
                                            <img className='cursor-pointer' src={FacebookOutlineIcon} alt="FacebookOutlineIcon" />
                                            <img className='cursor-pointer' src={TwitterIcon} alt="TwitterIcon" />
                                        </div>

                                        <div className="flex  justify-center align-middle pt-4">
                                            <Button btnType="button" onClick={handleMoreMenuClosePopup} btnName='Close' btnCategory="primary" />
                                        </div>
                                    </div>

                                </div>
                            </MuiModal>

                            {
                                moreMenuModal.reschedule &&

                                <MuiModal modalOpen={moreMenuModal.reschedule} modalClose={handleMoreMenuClosePopup} noheader>
                                    <div style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                        <div className='flex justify-between items-center px-3 py-4 mx-1' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                            <div>Reschedule Teaching Program</div>
                                            <img className='cursor-pointer' onClick={() => setMoreMenuModal({ share: false, reschedule: false })} src={CancelIcon} alt="CancelIcon" />
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className='px-4 py-7'>

                                                <div className="flex flex-wrap gap-4">

                                                    <div className={`relative mb-6 w-[48%]`} >
                                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={'Reschedule Date'}>
                                                            Reschedule Date
                                                        </label>

                                                        <div className='relative input-bg'>
                                                            <Calendar
                                                                className='calendar-control w-full'
                                                                {...dateField}
                                                                value={dateFormat['reschedule_date']}
                                                                onChange={(e) => {
                                                                    dateField.onChange(e)
                                                                    setDateFormat({ ...dateFormat, ['reschedule_date']: e.value })
                                                                }}
                                                                onClick={handleDateClick}
                                                                disabled={false}
                                                                minDate={new Date(programdetails.start_date)}
                                                                maxDate={new Date(programdetails.end_date)}
                                                                showTime={false}
                                                                hourFormat="12"
                                                                dateFormat="dd/mm/yy"
                                                                style={{ width: '60%' }}
                                                            />

                                                            <img className='absolute top-5 right-2' src={CalendarIcon} alt="CalendarIcon" />
                                                        </div>
                                                        {errors['reschedule_date'] && (
                                                            <p className="error" role="alert">
                                                                {errors['reschedule_date'].message}
                                                            </p>
                                                        )}

                                                    </div>

                                                    <div className={`relative mb-6 w-[48%]`} >
                                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={'Reschedule Date'}>
                                                            Reschedule Time
                                                        </label>

                                                        <div className='relative'>

                                                            <Calendar
                                                                className='calendar-control input-bg'
                                                                {...timeField}
                                                                value={dateFormat['reschedule_time']}
                                                                onChange={(e) => {
                                                                    timeField.onChange(e)
                                                                    setDateFormat({ ...dateFormat, ['reschedule_time']: e.value })
                                                                }}
                                                                onClick={handleTimeClick}
                                                                timeOnly
                                                                time
                                                            />



                                                            <img className='absolute top-5 right-2' src={CalendarIcon} alt="CalendarIcon" />
                                                        </div>
                                                        {errors['reschedule_time'] && (
                                                            <p className="error" role="alert">
                                                                {errors['reschedule_time'].message}
                                                            </p>
                                                        )}

                                                    </div>

                                                    <div className={`relative mb-6 w-full`} >
                                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={'Comments'}>
                                                            Comments
                                                        </label>
                                                        <textarea id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                                                                   focus:visible:outline-none focus:visible:border-none}`}
                                                            placeholder={''}
                                                            {...register('reason', { required: "This field is required" })}></textarea>

                                                        {errors['reason'] && (
                                                            <p className="error" role="alert">
                                                                {errors['reason'].message}
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>

                                            </div>


                                            <div className="flex gap-6 justify-center align-middle py-5">
                                                <Button btnName='Cancel' btnCategory="secondary" onClick={() => setMoreMenuModal({ share: false, reschedule: false })} />
                                                {/* <Button btnType="submit" btnCls="w-[170px]" btnName={'Submit'} btnCategory="primary" /> */}
                                                <Button btnType="submit"
                                                    // onClick={() => {
                                                    //     setMoreMenuModal({ share: false, reschedule: false });
                                                    //     setStartProgramModal({ loading: false, success: true })
                                                    // }} 

                                                    btnName='Submit' btnCategory="primary" />
                                            </div>
                                        </form>
                                    </div>
                                </MuiModal>

                            }

                            {
                                moreMenuModal.cancel &&

                                <MuiModal modalSize='md' modalOpen={moreMenuModal.cancel} modalClose={handleMoreMenuClosePopup} noheader>

                                    <div className='px-5 py-5'>
                                        <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                                            <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                                <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Cancel Request Reason </p>
                                                <img className='cursor-pointer' onClick={handleMoreMenuClosePopup} src={CancelIcon} alt="CancelIcon" />
                                            </div>

                                            <div className='px-5'>
                                                {
                                                    requestError !== '' ? <p className="error" role="alert">{requestError}</p> : null
                                                }

                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <div className='relative pb-8'>
                                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                                            Cancel Reason
                                                        </label>

                                                        <div className='relative'>
                                                            <textarea
                                                                {...register('cancel_reason', {
                                                                    required: "This field is required",
                                                                })}
                                                                id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                focus-visible:outline-none focus-visible:border-none`}
                                                                style={{ border: '2px solid rgba(229, 0, 39, 1)' }}
                                                                placeholder={''}
                                                            ></textarea>
                                                            {errors['cancel_reason'] && (
                                                                <p className="error" role="alert">
                                                                    {errors['cancel_reason'].message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                                                        <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={handleMoreMenuClosePopup} />
                                                        <button
                                                            type='submit'
                                                            className='text-white py-3 px-7 w-[18%]'
                                                            style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>

                                            </div>


                                        </div>

                                    </div>
                                </MuiModal>
                            }


                            <MuiModal modalOpen={startProgramModal.success} modalClose={() => setStartProgramModal({ loading: false, success: false })} noheader>
                                <div className='px-5 py-1 flex justify-center items-center'>
                                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                        <img src={SuccessTik} alt="SuccessTik" />
                                        <p className='text-white text-[12px]'>Started Request Approved by Mentor Manager</p>
                                    </div>

                                </div>
                            </MuiModal>
                        </div>
                    </div>
                    : null
            }
        </div >
    )

}
