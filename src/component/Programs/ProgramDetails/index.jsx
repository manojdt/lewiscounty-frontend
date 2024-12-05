import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Menu, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';

import api from '../../../services/api';
import { menteeNotJoinCondition, menteeProgramStatus, pipeUrls, programActionStatus, programAdminRejected, programApprovalStage, programCancelled, programCompleted, programInProgress, programNotLaunched, programNotStarted, programRequestApproval, programWaitingActiveApproval, requestStatus } from '../../../utils/constant';
import { getMenteeJoinedInProgram, getProgramDetails, getSpecificProgramDetails, updateProgram } from '../../../services/userprograms';
import { programCancelRequest, programRescheduleRequest, updateLocalRequest, updateProgramMenteeRequest, updateProgramRequest } from '../../../services/request';

import UserImage from "../../../assets/icons/user-icon.svg";
import ShareIcon from '../../../assets/images/share1x.png';
import DiscussionsIcon from '../../../assets/images/discussions1x.png';
import RescheduleIcon from '../../../assets/images/reschedule1x.png';
import MoreIcon from '../../../assets/images/more1x.png';
import AbortIcon from '../../../assets/images/abort1x.png';
import LocationIcon from '../../../assets/images/Location1x.png';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import DoubleArrowIcon from '../../../assets/images/double_arrow 1x.png';
import RatingsIcon from '../../../assets/images/ratings1x.png';
import CertificateIcon from '../../../assets/images/certficate1x.png';
import QuoteIcon from '../../../assets/images/quotes1x.png';
import MuiModal from '../../../shared/Modal';
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import LinkIcon from '../../../assets/images/link1x.png';
import TickColorIcon from '../../../assets/icons/tickColorLatest.svg'
import TimeHistoryIcon from '../../../assets/icons/time-history-icon.svg'
import CancelIcon from '../../../assets/images/cancel1x.png'

import { Button } from '../../../shared';
import { convertDateFormat, dateFormat, formatDateTimeISO } from '../../../utils';
import './program-details.css'
import Ratings from '../Ratings';
import { getUserProfile } from '../../../services/profile';
import DataTable from '../../../shared/DataGrid';
import { JoinedMenteeColumn } from '../../../mock';
import ToastNotification from '../../../shared/Toast';
import { Calendar } from 'primereact/calendar';
import PaymentButton from '../../../shared/paymentButton';


export default function ProgramDetails() {
    const [loading, setLoading] = useState({ initial: true, join: false })
    const calendarRef = useRef([])
    const [taskJoined, setTaskJoined] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [message, setMessage] = useState(false);
    const [dateFormatted, setDateFormat] = useState({})
    const [taskJoinedRequest, setTaskJoinedRequest] = useState(false)
    const [moreMenuModal, setMoreMenuModal] = useState({ share: false, reschedule: false })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('about_program')
    const [ratingModal, setRatingModal] = useState({ modal: false, success: false })
    const [certificateActiveTab, setCertificateActiveTab] = useState('participated')
    const [viewMenteeModal, setViewMenteeModal] = useState(false)
    const [confirmPopup, setConfirmPopup] = useState({ accept: false, cancel: false, programId: '' })
    const userdetails = useSelector(state => state.userInfo)
    const { profile, loading: profileLoading } = useSelector(state => state.profileInfo)
    const { programdetails, loading: programLoading, error, menteeJoined, status } = useSelector(state => state.userPrograms)
    const { loading: requestLoading, status: requestProgramStatus, error: requestError } = useSelector(state => state.requestList);
    const role = userdetails.data.role || ''
    const rating = programdetails?.mentor_rating === 0 ? 3 : programdetails?.mentor_rating;
    const url = `${process.env.REACT_APP_SITE_URL}/program-details/${params.id}`
    const state = useLocation()?.state

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

    const requestId = searchParams.get("request_id") || '';

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const participatedTabs = [
        {
            name: 'Participated',
            key: 'participated'
        },
        {
            name: 'Completed',
            key: 'completed'
        },

    ]

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTab = (key) => {
        setActiveTab(key)
    }

    const handleCerificateTab = (key) => {
        setCertificateActiveTab(key)
    }

    const commonApproval = ['completed', 'cancelled']

    const handleJoinProgram = async (programId) => {

        if (role === 'mentee' && !userdetails?.data?.is_registered) {
            navigate(`/questions?program_id=${programdetails.id}`)
        }
        else if (role === 'mentee' && !userdetails?.data?.document_upload) {
            navigate(`/mentee-doc-upload/${programdetails.id}`)
        } else {
            setLoading({ initial: true, join: false })
            const joinProgramAction = await api.post('join_program', { id: programId });
            if (joinProgramAction.status === 200 && joinProgramAction.data) {
                setLoading({ initial: false, join: role === 'mentee' })
                if (role === 'mentor') { dispatch(updateProgram({ id: programId, status: programActionStatus.yettostart })); }
            }
        }
    }

    // Handle Accept Program Popup
    const handleConfirmPopup = () => {
        if (role === 'admin') {
            dispatch(updateProgramRequest({
                "id": parseInt(requestId),
                "action": "accept"
            }))
        }
        if (role === 'mentor') {
            dispatch(updateProgramMenteeRequest(
                {
                    "id": parseInt(requestId),
                    "action": "accept"
                }
            ))
        }
    }

    // Handle Submit Cancel Program Popup
    const handleCancelReasonPopupSubmit = (data) => {
        if (data.cancel_reason !== '') {
            if (confirmPopup.cancel) {
                if (role === 'admin') {
                    dispatch(updateProgramRequest({
                        id: parseInt(requestId),
                        action: "cancel",
                        cancelled_reason: data.cancel_reason
                    }))
                }

                if (role === 'mentor') {
                    dispatch(updateProgramMenteeRequest({
                        id: parseInt(requestId),
                        action: "cancel",
                        cancelled_reason: data.cancel_reason
                    }))
                }

            }
        }
    }

    // Accept / Cancel Program Request
    const handleAcceptCancelProgramRequest = (action, programid) => {
        let popup = { ...confirmPopup, programId: programid }
        if (action === 'accept') { setConfirmPopup({ ...popup, accept: true }); }
        if (action === 'cancel') { setConfirmPopup({ ...popup, cancel: true }) }
    }

    // Handle Close Accept / Cancel Popup
    const resetAcceptCancelPopup = () => {
        setConfirmPopup({ accept: false, cancel: false, programId: '' });
    }

    const handleMenteeAcceptCancelRequest = (type, id) => {
        if (type === 'approve') { setConfirmPopup({ ...confirmPopup, accept: true }); }
        if (type === 'reject') { setConfirmPopup({ ...confirmPopup, cancel: true }) }
    }

    const handleInstructor = (programdetails) => {
        const mentorId = programdetails?.mentor_info?.id || ''

        if (mentorId !== '' && mentorId !== userdetails?.data?.user_id) {
            navigate(`/mentor-profile/${mentorId}`)
        }
    }

    const ratingModalSuccess = () => {
        setRatingModal({ modal: false, success: true })
    }

    const ratingModalClose = () => {
        setRatingModal({ modal: false, success: false })
    }

    const handleViewJoinedMentees = (programInfo) => {
        setViewMenteeModal(true)
    }

    const JoinMenteeColumn = [
        ...JoinedMenteeColumn,
        {
            field: 'action',
            headerName: 'View',
            width: 300,
            id: 3,
            renderCell: (params) => {
                return <button style={
                    {
                        background: 'rgb(29, 91, 191)',
                        color: 'rgb(255, 255, 255)',
                        padding: '2px 20px',
                        height: '32px',
                        margin: '9px 0px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px'
                    }
                }
                    onClick={
                        () => navigate(`/mentee-details/${params.row.mentee_id}`)
                    } > View Profile </button>;
            }
        }
    ]

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

    const handleMoreMenuClosePopup = () => {
        setMoreMenuModal({ share: false, reschedule: false, cancel: false })
        reset()
    }

    const handleDateClick = () => {
        setTimeout(() => {
            document.querySelector('.p-datepicker')?.classList.add('program-date-picker')
        }, 200)

    }

    const handleCopy = () => {

        navigator.clipboard.writeText(url)
            .then(() => {
                setMessage(true);
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
                setMessage(false);
            });
    };

    const handleCloseNotify = () => {
        setMessage(false)
    }

    const onSubmit = (data) => {
        if (moreMenuModal.reschedule) {

            const formattedStartDate = convertDateFormat(data.reschedule_start_date);
            const formattedEndDate = convertDateFormat(data.reschedule_end_date);

            const payload = {
                reschedule_start_date: formattedStartDate,
                reschedule_end_date: formattedEndDate,
                program_id: params.id,
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

    useEffect(() => {
        if (ratingModal.success) {
            setTimeout(() => {
                setRatingModal({ modal: false, success: false })
                dispatch(getProgramDetails(params.id))
            }, 3000)
        }
    }, [ratingModal.success])

    useEffect(() => {
        if (Object.keys(programdetails).length && !programLoading) {
            const notAllowedCond = ['completed', 'yettoapprove', 'draft', 'cancelled']


            if (!notAllowedCond.includes(programdetails.status)) {
                if (role === 'mentee' && programdetails.status !== 'yettojoin' && programdetails.mentee_join_status === 'program_join_request_accepted') {
                    navigate(`${pipeUrls.startprogram}/${params.id}`)
                }

                if (role === 'mentor' && requestId === '') {
                    if (programdetails.status === programActionStatus.yettostart) {
                        navigate(`${pipeUrls.startprogram}/${params.id}`)
                    }
                    else if ((programdetails.status === programActionStatus.inprogress || programdetails.status === programActionStatus.assigned ||
                        programdetails.status === programActionStatus.paused || programdetails.status === programActionStatus.started

                    )) {
                        navigate(`${pipeUrls.startprogram}/${params.id}`)
                    }
                }
            }



            if (role === 'mentee' && programdetails.status === 'completed' && !programdetails.mentee_program_rating) {
                setRatingModal({ modal: true, success: false })
            }

            setLoading({ ...loading, initial: false })
        }
    }, [programdetails, menteeJoined])

    useEffect(() => {
        const programId = params.id;
        if (programId && programId !== '') {
            dispatch(getSpecificProgramDetails({ id: programId, requestId: requestId }))
            if (role === 'mentee') { dispatch(getMenteeJoinedInProgram({ id: programId })); }
        }

        if (!Object.keys(profile).length) {
            dispatch(getUserProfile())
        }

    }, [params.id, role])

    useEffect(() => {
        if (status === programActionStatus.yettostart) {
            setLoading({ initial: false, join: true })
        }
    }, [status])

    useEffect(() => {
        if (requestProgramStatus === requestStatus.programupdate) {
            setTimeout(() => {
                setConfirmPopup({ accept: false, cancel: false, programId: '' })
                dispatch(getSpecificProgramDetails({ id: params.id, requestId: requestId }))
                dispatch(updateLocalRequest({ status: '' }))
            }, [2000])
        }

        if (requestProgramStatus === requestStatus.reschedule || requestProgramStatus === requestStatus.cancel) {
            setMoreMenuModal({ share: false, reschedule: false })
            reset()
            setDateFormat({})
            setTimeout(() => {
                dispatch(getProgramDetails(parseInt(params.id)))
                dispatch(updateLocalRequest({ status: '' }))

            }, 3000)
        }
    }, [requestProgramStatus])

    useEffect(() => {
        if (taskJoined) {
            setTimeout(() => {
                // if (role === 'mentor') navigate(`${pipeUrls.assigntask}/${programdetails.id}`)
                if (role === 'mentee') navigate(`${pipeUrls.startprogram}/${programdetails.id}`)
            }, [3000])

        }
    }, [taskJoined])

    useEffect(() => {
        if (loading.join) {
            if (role === 'mentee') setTaskJoinedRequest(true)
            setTimeout(() => {
                setLoading({ ...loading, join: false })
                dispatch(getProgramDetails(params.id))
                // if (role === 'mentor') navigate(`${pipeUrls.programtask}/${programdetails.id}`)
                if (role === 'mentee') setTaskJoinedRequest(false)
            }, [3000])
        }
    }, [loading.join])

    const dateStartField = moreMenuModal.reschedule ? register('reschedule_start_date', { required: "This field is required" }) : undefined
    const dateEndField = moreMenuModal.reschedule ? register('reschedule_end_date', { required: "This field is required" }) : undefined


    return (
        <div className="px-9 my-6 grid">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading.initial || loading.join || programLoading || requestLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={ratingModal.success}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Thank you for providing the rating for this program</p>
                    </div>

                </div>
            </Backdrop>

            <Ratings open={ratingModal.modal} modalSuccess={ratingModalSuccess} modalClose={ratingModalClose} />


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={requestProgramStatus === requestStatus.reschedule || requestProgramStatus === requestStatus.cancel}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Program {requestProgramStatus === requestStatus.reschedule ? 'Rescheduled ' :
                            requestProgramStatus === requestStatus.cancel ? 'Cancelled ' : ''
                            } Successfully</p>
                    </div>

                </div>
            </Backdrop>

            {/* Program Request Updated Popup */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={requestProgramStatus === requestStatus.programupdate}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Program Request updated successfully</p>
                    </div>

                </div>

            </Backdrop>


            <MuiModal modalSize='md' modalOpen={viewMenteeModal} modalClose={undefined} noheader>
                <div className='px-5 py-5'>
                    <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                        style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                        <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                            <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Joining Mentees </p>
                            <img className='cursor-pointer' onClick={() => setViewMenteeModal(false)} src={CancelIcon} alt="CancelIcon" />
                        </div>
                        <div className='px-5'>
                            <DataTable rows={programdetails.participated_mentees} columns={JoinMenteeColumn} hideCheckbox />
                        </div>
                    </div>
                </div>
            </MuiModal>

            {/* Program Accept Popup */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={confirmPopup.accept}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={TickColorIcon} alt="TickColorIcon" />
                    <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
                        Approve
                    </span>
                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>
                            Are you sure want to approve Program Request?
                        </p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnCls="w-[110px]" btnName={'Cancel'} btnCategory="secondary" onClick={resetAcceptCancelPopup} />
                            <Button btnType="button" btnCls="w-[110px]" btnName={'Approve'}
                                style={{ background: '#16B681' }} btnCategory="primary"
                                onClick={handleConfirmPopup}
                            />
                        </div>
                    </div>
                </div>
            </Backdrop>

            {/* Program Cancel Popup */}
            {
                confirmPopup.cancel &&

                <MuiModal modalSize='md' modalOpen={confirmPopup.cancel} modalClose={resetAcceptCancelPopup} noheader>

                    <div className='px-5 py-5'>
                        <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                            style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                            <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Reject Request Reason </p>
                                <img className='cursor-pointer' onClick={resetAcceptCancelPopup} src={CancelIcon} alt="CancelIcon" />
                            </div>

                            <div className='px-5'>
                                {
                                    requestError !== '' ? <p className="error" role="alert">{requestError}</p> : null
                                }


                                <form onSubmit={handleSubmit(handleCancelReasonPopupSubmit)}>
                                    <div className='relative pb-8'>
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Reject Request Reason
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
                                        <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={resetAcceptCancelPopup} />
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


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading.join && role === 'mentor'}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Successfully Launched a program</p>
                    </div>

                </div>
            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={taskJoinedRequest}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Program join request submitted successfully to Mentor</p>
                    </div>

                </div>
            </Backdrop>


            {
                message &&
                <ToastNotification openToaster={message} message={'URL copied!'} handleClose={handleCloseNotify} toastType={'success'} />
            }

            <MuiModal modalOpen={moreMenuModal.share} modalClose={handleMoreMenuClosePopup} noheader>
                <div className='px-5 py-1 flex justify-center items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                    <div className='flex justify-center items-center flex-col gap-8 py-10 px-20 mt-5'
                    >
                        <div>{programdetails?.program_name}</div>
                        <input className='input-bg text-[12px] h-[60px] w-[396px] px-5' style={{ borderRadius: '27px' }} disabled
                            value={url} />
                        <div className='flex gap-7'>
                            <img className='cursor-pointer' src={LinkIcon} alt="LinkIcon" onClick={handleCopy} />
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
                            <div>Reschedule {programdetails.name}</div>
                            <img className='cursor-pointer' onClick={() => setMoreMenuModal({ share: false, reschedule: false })} src={CancelIcon} alt="CancelIcon" />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='px-4 py-7'>

                                <div className="flex flex-wrap gap-4">

                                    <div className={`relative mb-6 w-[48%]`} >
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={'Reschedule Date'}>
                                            Reschedule Start Date
                                        </label>

                                        <div className='relative input-bg'>
                                            <Calendar
                                                className='calendar-control w-full'
                                                {...dateStartField}
                                                value={dateFormatted['reschedule_start_date']}
                                                onChange={(e) => {
                                                    dateStartField.onChange(e)
                                                    setDateFormat({ reschedule_end_date: '', reschedule_start_date: e.value })
                                                    calendarRef?.current[0]?.hide()
                                                }}
                                                onClick={handleDateClick}
                                                disabled={false}
                                                minDate={new Date()}
                                                maxDate={["yettostart", "yettojoin"].includes(programdetails?.status) ? "" : new Date(programdetails?.end_date)}
                                                showTime={false}
                                                hourFormat="12"
                                                dateFormat="dd/mm/yy"
                                                style={{ width: '60%' }}
                                                ref={el => (calendarRef.current[0] = el)}
                                                viewDate={["yettostart", "yettojoin"].includes(programdetails?.status) ? new Date() : new Date(programdetails?.start_date)}
                                            />

                                            <img className='absolute top-5 right-2 cursor-pointer' src={CalendarIcon} alt="CalendarIcon"
                                                onClick={(e) => {
                                                    handleDateClick();
                                                    calendarRef?.current[0]?.show();
                                                }}
                                            />
                                        </div>
                                        {errors['reschedule_start_date'] && (
                                            <p className="error" role="alert">
                                                {errors['reschedule_start_date'].message}
                                            </p>
                                        )}

                                    </div>

                                    <div className={`relative mb-6 w-[48%]`} >
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={'Reschedule Date'}>
                                            Reschedule End Date
                                        </label>

                                        <div className='relative input-bg'>
                                            <Calendar
                                                className='calendar-control w-full'
                                                {...dateEndField}
                                                value={dateFormatted['reschedule_end_date']}
                                                onChange={(e) => {
                                                    dateEndField.onChange(e)
                                                    setDateFormat({ ...dateFormatted, ['reschedule_end_date']: e.value })
                                                    calendarRef?.current[1]?.hide()
                                                }}
                                                onClick={handleDateClick}
                                                disabled={false}
                                                minDate={dateFormatted.reschedule_start_date ? new Date(dateFormatted.reschedule_start_date) : new Date()}
                                                maxDate={["yettojoin", "yettostart"].includes(programdetails?.status) ? "" : new Date(programdetails?.end_date)}
                                                showTime={false}
                                                hourFormat="12"
                                                dateFormat="dd/mm/yy"
                                                style={{ width: '60%' }}
                                                ref={el => (calendarRef.current[1] = el)}
                                                viewDate={new Date(dateFormatted.reschedule_start_date ?? programdetails?.start_date)}
                                            />

                                            <img className='absolute top-5 right-2 cursor-pointer' src={CalendarIcon} alt="CalendarIcon"
                                                onClick={(e) => {
                                                    handleDateClick();
                                                    calendarRef?.current[1]?.show();

                                                }}
                                            />
                                        </div>
                                        {errors['reschedule_end_date'] && (
                                            <p className="error" role="alert">
                                                {errors['reschedule_end_date'].message}
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
                                <Button btnType="submit" btnName='Submit' btnCategory="primary" />
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

            {
                (!programLoading && Object.keys(programdetails).length) ?

                    <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                        <div className='breadcrum'>
                            <nav className="flex justify-between px-7 pt-6 pb-5 mx-2 border-b-2" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                    <li className="inline-flex items-center">
                                        <p href="#" className="inline-flex items-center text-sm font-medium cursor-pointer" style={{ color: 'rgba(89, 117, 162, 1)' }}
                                            onClick={() => navigate(-1)}>
                                            {state?.from === "category" ? "Category View" : "Program"}
                                        </p>
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <p href="#" className="ms-1 text-sm font-medium text-gray-700 ">
                                                Program Details </p>
                                        </div>
                                    </li>

                                </ol>
                                {
                                    role === 'mentor' &&
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
                                            <MenuItem onClick={() => handleMenu('share')} className='!text-[12px]'>
                                                <img src={ShareIcon} alt="ShareIcon" className='pr-3 w-[25px]' />
                                                Share
                                            </MenuItem>
                                            {programdetails?.status !== "completed" && <MenuItem onClick={() => handleMenu('reschedule')} className='!text-[12px]'>
                                                <img src={RescheduleIcon} alt="RescheduleIcon" className='pr-3 w-[25px]' />
                                                Reschedule
                                            </MenuItem>}

                                            {programdetails?.status !== "completed" && <MenuItem onClick={() => handleMenu('cancel')} className='!text-[12px]'>
                                                <img src={AbortIcon} alt="Cancel" className='pr-3 w-[25px]' />
                                                Cancel
                                            </MenuItem>}
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

                                            {
                                                programdetails.reschedule_info !== '' &&
                                                <div className='flex gap-3 items-center'>
                                                    <span style={{ background: 'rgba(255, 213, 0, 1)', borderRadius: '3px', padding: '10px' }}>
                                                        <img src={TimeHistoryIcon} alt="TimeHistoryIcon" />
                                                    </span>
                                                    <p style={{
                                                        background: 'rgba(255, 249, 216, 1)', color: 'rgba(255, 213, 0, 1)',
                                                        padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 500
                                                    }}>{programdetails.reschedule_info}</p>
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

                                                    {formatDateTimeISO(programdetails?.start_date)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3 text-[12px]'>
                                            {
                                                !profileLoading && <img src={programdetails?.mentor_profile_image || UserImage} style={{ borderRadius: '50%', width: '35px', height: '35px' }} alt="UserImage" />

                                            }


                                            <span>Instructor :</span>
                                            {
                                                role !== 'mentor' ?
                                                    <span style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleInstructor(programdetails)}>{programdetails?.mentor_name}</span>
                                                    :
                                                    <span style={{ color: 'rgba(29, 91, 191, 1)' }}>{programdetails?.mentor_name}</span>
                                            }
                                        </div>


                                        {
                                            programCompleted.includes(programdetails.status) &&

                                            <div className='py-9'>
                                                <div className='py-3 px-16 text-white text-[14px] flex justify-center items-center' style={{
                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                    borderRadius: '5px',
                                                    width: '30%'
                                                }}>Program Completed</div>
                                            </div>

                                        }

                                        {
                                            (role === 'mentor' && !programCompleted.includes(programdetails.status) && !programCancelled.includes(programdetails.status)) ?
                                                <>

                                                    {
                                                        requestId !== '' && programdetails.mentor_join_request_status !== 'accept' && programdetails.mentor_join_request_status !== 'cancel' ?
                                                            <div className='flex gap-4 pt-10'>
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    border: "1px solid #E0382D",
                                                                    borderRadius: '5px',
                                                                    color: '#E0382D'
                                                                }}
                                                                    onClick={() => handleMenteeAcceptCancelRequest('reject', requestId)}
                                                                >Reject Request
                                                                </button>
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    background: "#16B681",
                                                                    borderRadius: '5px'
                                                                }}
                                                                    onClick={() => handleMenteeAcceptCancelRequest('approve', requestId)}
                                                                >Approve Request
                                                                </button>
                                                            </div>
                                                            :

                                                            requestId !== '' ?
                                                                <>
                                                                    {
                                                                        programdetails.mentor_join_request_status === 'accept' &&

                                                                        <button className='py-3 px-16 mt-7 text-white text-[14px] flex items-center' style={{
                                                                            background: "#16B681",
                                                                            borderRadius: '5px'
                                                                        }}
                                                                            onClick={() => undefined}
                                                                        >Approved
                                                                        </button>
                                                                    }

                                                                    {
                                                                        programdetails.mentor_join_request_status === 'cancel' &&

                                                                        <button className='py-3 mt-7 px-16 text-white text-[14px] flex items-center' style={{
                                                                            border: "1px solid #E0382D",
                                                                            borderRadius: '5px',
                                                                            color: '#E0382D'
                                                                        }}
                                                                            onClick={() => undefined}
                                                                        >Rejected
                                                                        </button>
                                                                    }
                                                                </>

                                                                :
                                                                // (Object.keys(programdetails.cancel_reason).length || Object.keys(programdetails.reschedule_reason
                                                                // ).length) ?

                                                                //     <div className='flex gap-4 pt-10' >
                                                                //         <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                //             border: "1px solid #E0382D",
                                                                //             borderRadius: '5px',
                                                                //             color: '#E0382D',
                                                                //             cursor: 'not-allowed'
                                                                //         }}
                                                                //             onClick={() => undefined}
                                                                //         >
                                                                //             <i className="pi pi-clock" style={{ color: 'red' }}></i>
                                                                //             <span className='pl-3'>Waiting for admin approval</span>
                                                                //         </button>
                                                                //     </div>
                                                                //     :

                                                                programApprovalStage[programdetails.status] ?
                                                                    <div className='flex gap-4 pt-10' >
                                                                        <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                            border: "1px solid #E0382D",
                                                                            borderRadius: '5px',
                                                                            color: '#E0382D',
                                                                            cursor: 'not-allowed'
                                                                        }}
                                                                            onClick={() => undefined}
                                                                        >
                                                                            {programApprovalStage[programdetails.status].type === 'waiting' && <i className="pi pi-clock" style={{ color: 'red' }}></i>}
                                                                            {programApprovalStage[programdetails.status].type === 'reject' && <i className="pi pi-ban" style={{ color: 'red' }}></i>}
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
                                                                        programdetails.status === 'yettojoin' ?

                                                                            <div className='py-9'>
                                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                                                    borderRadius: '5px'
                                                                                }}
                                                                                    onClick={() => handleJoinProgram(programdetails.id)}
                                                                                >Launch Program
                                                                                    <span className='pl-8 pt-1'><img style={{ width: '15px', height: '13px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span>
                                                                                </button>
                                                                            </div>
                                                                            : null
                                                    }
                                                </>
                                                : null

                                        }

                                        {
                                            (role === 'mentee' && !programCompleted.includes(programdetails.status) && !programCancelled.includes(programdetails.status)) ?
                                                <div className='py-9'>
                                                    {
                                                        (menteeProgramStatus[programdetails.mentee_join_status]) ?
                                                            <>
                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                    border: "1px solid #E0382D",
                                                                    borderRadius: '5px',
                                                                    color: '#E0382D',
                                                                    cursor: 'not-allowed'
                                                                }}
                                                                    onClick={() => undefined}
                                                                >
                                                                    {menteeProgramStatus[programdetails.mentee_join_status].type === 'waiting' && <i className="pi pi-clock" style={{ color: 'red' }}></i>}
                                                                    {menteeProgramStatus[programdetails.mentee_join_status].type === 'reject' && <i className="pi pi-ban" style={{ color: 'red' }}></i>}
                                                                    <span className='pl-3'>{menteeProgramStatus[programdetails.mentee_join_status]?.text}</span>
                                                                </button>
                                                            </>
                                                            :
                                                            !menteeNotJoinCondition.includes(programdetails.status) ?
                                                                <>
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
                                                                </>

                                                                :
                                                                null

                                                    }
                                                </div>

                                                : null
                                        }


                                        {
                                            (role === 'admin' && !programCompleted.includes(programdetails.status) && !programCancelled.includes(programdetails.status)) ?
                                                <>
                                                    {
                                                        <div className='flex gap-4 pt-10' >
                                                            {
                                                                (requestId !== '' && (programRequestApproval.includes(programdetails.status) ||
                                                                    programWaitingActiveApproval.includes(programdetails.status) ||
                                                                    (Object.keys(programdetails.cancel_reason).length && programdetails.cancel_reason?.id === parseInt(requestId)
                                                                        && (programdetails.cancel_reason?.status === 'new' || programdetails.cancel_reason?.status === 'pending')) ||

                                                                    (Object.keys(programdetails.reschedule_reason).length
                                                                        && (programdetails.reschedule_reason?.status === 'new' || programdetails.reschedule_reason?.status === 'pending'))
                                                                )
                                                                ) ?

                                                                    <>
                                                                        <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                            border: "1px solid #E0382D",
                                                                            borderRadius: '5px',
                                                                            color: '#E0382D'
                                                                        }}
                                                                            onClick={() => handleAcceptCancelProgramRequest('cancel', programdetails.id)}
                                                                        >
                                                                            {searchParams.has('type') && searchParams.get('type') === 'program_cancel' ? 'Continue' : 'Reject Request'}
                                                                        </button>
                                                                        <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                            background: "#16B681",
                                                                            borderRadius: '5px'
                                                                        }}
                                                                            onClick={() => handleAcceptCancelProgramRequest('accept', programdetails.id)}
                                                                        >Approve Request
                                                                        </button>
                                                                    </>

                                                                    :

                                                                    programAdminRejected.includes(programdetails.status) ?

                                                                        <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                            border: "1px solid #E0382D",
                                                                            borderRadius: '5px',
                                                                            color: '#E0382D',
                                                                            cursor: 'not-allowed'
                                                                        }}
                                                                            onClick={undefined}
                                                                        >Rejected
                                                                        </button>

                                                                        :

                                                                        programInProgress.includes(programdetails.status) ?
                                                                            <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                                background: "#16B681",
                                                                                borderRadius: '5px',
                                                                                cursor: 'not-allowed'
                                                                            }}
                                                                                onClick={undefined}
                                                                            >In-Progress
                                                                            </button>

                                                                            :

                                                                            programNotLaunched.includes(programdetails.status)
                                                                                ?
                                                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                                    background: "#16B681",
                                                                                    borderRadius: '5px',
                                                                                    cursor: 'not-allowed'
                                                                                }}
                                                                                    onClick={undefined}
                                                                                >Mentor yet to launch
                                                                                </button>

                                                                                :


                                                                                programNotStarted.includes(programdetails.status) ?
                                                                                    <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                                        background: "#16B681",
                                                                                        borderRadius: '5px',
                                                                                        cursor: 'not-allowed'
                                                                                    }}
                                                                                        onClick={undefined}
                                                                                    >Mentor yet to start
                                                                                    </button>

                                                                                    :

                                                                                    (!programRequestApproval.includes(programdetails.status) && !commonApproval.includes(programdetails.status)) ?

                                                                                        <>
                                                                                            <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                                                                background: "#16B681",
                                                                                                borderRadius: '5px',
                                                                                                cursor: 'not-allowed'
                                                                                            }}
                                                                                                onClick={undefined}
                                                                                            >Approved
                                                                                            </button>
                                                                                        </>
                                                                                        : null

                                                            }
                                                        </div>
                                                    }

                                                </>
                                                : null
                                        }

                                        {
                                            programdetails.status === 'cancelled' &&
                                            <div className='flex gap-4 pt-10' >
                                                <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                                    border: "1px solid #E0382D",
                                                    borderRadius: '5px',
                                                    color: '#E0382D',
                                                    cursor: 'not-allowed'
                                                }}
                                                    onClick={() => undefined}
                                                >Cancelled
                                                </button>
                                            </div>
                                        }
                                    </div>

                                    {/* Right Side Content */}
                                    <div className='right-side-content'>
                                        <div style={{ border: '1px solid rgba(223, 237, 255, 1)', borderRadius: '10px' }}
                                            className='px-6 pt-6 pb-3'>
                                            <ul className='flex flex-col gap-3'>
                                                {
                                                    role === 'mentee1' &&
                                                    <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px' }}>
                                                        <span>Ratings</span>
                                                        <span className='flex gap-2 items-center'>
                                                            {
                                                                Array.from({ length: rating }, (_, i) => i + 1).map(i => {
                                                                    return <img src={RatingsIcon} style={{ width: '12px', height: '12px' }} alt="RatingsIcon" />
                                                                })
                                                            }
                                                            {rating}
                                                        </span>
                                                    </li>
                                                }
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}>
                                                    <span>Session</span>
                                                    <span>{programdetails.session_count}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}>
                                                    <span>Course Level</span>
                                                    <span style={{ textTransform: "capitalize" }}>{programdetails.course_level}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Start Date</span>
                                                    <span>{`${dateFormat(programdetails?.start_date)} `}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>End Date</span>
                                                    <span> {`${dateFormat(programdetails?.end_date)}`}</span>
                                                </li>

                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Duration</span>
                                                    <span>{programdetails.duration} {' days'}</span>
                                                </li>
                                                <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Schedule</span>
                                                    <span>Flexible schedule</span>
                                                </li>
                                                {
                                                    role === 'mentor' &&
                                                    <li className='flex justify-between text-[12px]' style={{ paddingTop: '14px' }}> <span>Joined Mentees</span>
                                                        <span className='underline cursor-pointer' onClick={() => handleViewJoinedMentees(programdetails)}>{programdetails.participated_mentees_count}</span>
                                                    </li>
                                                }
                                                <li className='flex justify-between text-[12px]' style={{ paddingBottom: '10px', paddingTop: '14px' }}>
                                                    <span>Payment</span>
                                                    <span><PaymentButton /></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>


                                {
                                    (role !== 'mentee' && ((role === 'admin' && requestId !== null && programdetails?.cancel_reason && Object.keys(programdetails?.cancel_reason).length &&
                                        programdetails.cancel_reason.id === parseInt(requestId))
                                        || (programdetails.status === programActionStatus.cancelled))) ?
                                        <div className={`action-set action_cancelled`}>
                                            <div className='reason-title'>
                                                {programdetails.status === programActionStatus.cancelled ||

                                                    (role === 'admin' && requestId !== null && programdetails?.cancel_reason && Object.keys(programdetails?.cancel_reason).length)

                                                    ? 'Cancelled ' : ''} Reason
                                            </div>
                                            <div className='reason-content'>
                                                {programdetails?.cancel_reason?.cancel_request_reason}
                                            </div>
                                        </div>
                                        : null
                                }


                                {
                                    (role !== 'mentee' && ((role === 'admin' && requestId !== null && programdetails?.reschedule_reason &&
                                        Object.keys(programdetails?.reschedule_reason).length &&
                                        programdetails.reschedule_reason.id === parseInt(requestId)))) ?
                                        <div className={`action-set action_cancelled`} style={{ border: '1px solid rgba(255, 118, 0, 1)', background: 'rgba(255, 242, 231, 1)' }}>
                                            <div className='reason-title' style={{ color: 'rgba(255, 118, 0, 1)' }}>
                                                {programdetails.status === programActionStatus.cancelled ||

                                                    (role === 'admin' && requestId !== null && programdetails?.reschedule_reason && Object.keys(programdetails?.reschedule_reason).length)

                                                    ? 'Rescheduled ' : ''} Reason
                                            </div>
                                            <div className='reason-content'>
                                                {programdetails?.reschedule_reason?.reason}
                                            </div>
                                        </div>
                                        : null
                                }

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

                                            {
                                                programdetails.image !== null && programdetails.image !== '' &&

                                                <div className='sponsor pt-8'>
                                                    <div className='font-semibold pb-5'>Sponsored by </div>
                                                    <ul className='flex gap-5'>
                                                        <img style={{ width: '100px', height: '100px' }} src={programdetails.image} alt="SponsorIcon" />
                                                    </ul>
                                                </div>
                                            }


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
                                                <div className='font-semibold pb-3'>Types of Certificates
                                                    {/* {
                                                        programdetails.certifications.length <= 9 ? ' 0' + programdetails.certifications.length : programdetails.certifications.length} */}
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
                                                                {participatedTab.key === 'participated' && 'The ability for members to earn badges and receive certifications is another essential feature of our Mentoring Management program. It helps in creating engaging and impactful relationships between mentors and mentees.'}

                                                                {participatedTab.key === 'completed' &&
                                                                    'All the badges and certifications are secured through a blockchain system to ensure authenticity and traceability. This innovative approach not only enhances motivation but also provides tangible recognition of achievements, encouraging continuous growth and engagement.'}
                                                            </div>
                                                            <img className='absolute right-0' src={CertificateIcon} alt="CertificateIcon" />
                                                        </div>

                                                    )
                                                }



                                            </div>
                                        </div>


                                        <div className={`program-outcomes ${activeTab === 'program_testimonials' ? 'block' : 'hidden'}`}>
                                            <div className='testimonials bg-white px-5 py-7'>
                                                {/* <div className='flex justify-end'>
                                                    <button className='py-2 px-6 mb-10' style={{ color: 'rgba(29, 91, 191, 1)', border: '1px dotted rgba(29, 91, 191, 1)', borderRadius: '3px' }}>Request Testimonials</button>
                                                </div> */}
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
