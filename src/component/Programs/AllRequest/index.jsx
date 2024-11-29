import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Card from '../../../shared/Card'
import { requestOverview, requestStatus, RequestStatus, RequestStatusArray, requestStatusColor, requestStatusText } from '../../../utils/constant'
import SearchIcon from '../../../assets/icons/search.svg';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import MoreIcon from '../../../assets/icons/moreIcon.svg'
import TickCircle from '../../../assets/icons/tickCircle.svg'
import CloseCircle from '../../../assets/icons/closeCircle.svg'
import ViewIcon from '../../../assets/images/view1x.png'
import CancelIcon from '../../../assets/images/cancel1x.png'
import TickColorIcon from '../../../assets/icons/tickColorLatest.svg'
import CancelColorIcon from '../../../assets/icons/cancelCircle.svg'
import ShareIcon from '../../../assets/icons/Share.svg'


import DataTable from '../../../shared/DataGrid';
import { categoryColumns, certificateRequestColumns, goalsRequestColumns, learningAccessRequestsColumns, memberMenteeRequestColumns, memberMentorRequestColumns, newGoalsRequestsColumns, programRequestColumns, programRequestData, reportRequestColumns, resourceAccessRequestColumns, techinicalSupportRequestColumns, testimonialRequestColumns } from '../../../mock';

import './request.css';

import { cancelMemberRequest, certificateRequest, getCategoryList, getlearningAccessRequest, getMemberRequest, getprogramRequest, getReportRequest, getResourceRequest, goalsRequest, updateCertificateRequest, updateGoalRequest, updateLocalRequest, updateMemberRequest, updateProgramMenteeRequest, updateProgramRequest, updateReportRequest } from '../../../services/request';
import ToastNotification from '../../../shared/Toast';
import MuiModal from '../../../shared/Modal';
import { useForm } from 'react-hook-form';
import { Button } from '../../../shared';

export default function AllRequest() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();

    const dispatch = useDispatch();
    const { programRequest: programTableInfo, memberRequest, resourceRequest, categoryList, goalsRequest: goalsRequestInfo, certificateRequestList, reportsRequest: reportsRequestInfo, learningAccessRequests,
        loading, status, error } = useSelector(state => state.requestList);
    const [currentRequestTab, setCurrentRequestTab] = useState(RequestStatus.programRequest)
    const [categoryInfo, setCategoryInfo] = useState({ search: '', list: [] })
    const [filterStatus, setFilterStatus] = useState('all')
    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState({ search: '', filter_by: '' })
    const open = Boolean(anchorEl);
    const [actionTab, setActiveTab] = useState('new_program_request')
    const [actionTabFilter, setActionTabFilter] = useState([])
    const [activeTableDetails, setActiveTableDetails] = useState({ column: [], data: [] })
    const [seletedItem, setSelectedItem] = useState({})
    const [confirmPopup, setConfirmPopup] = useState({ show: false, title: '', type: '', action: '' })
    const [cancelPopup, setCancelPopup] = useState({ show: false, page: '' })
    const [showToast, setShowToast] = useState({ show: false, message: '' })
    const [categoryPopup, setCategoryPopup] = useState({ show: false, selectedItem: [], page: '', tab: '' })
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
    });
    const userInfo = useSelector(state => state.userInfo)
    // console.log("programTableInfo ===>", programTableInfo, "====>", learningAccessRequests)
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const role = userInfo.data.role

    let programRequestTab = [
        {
            name: 'New Program Request',
            key: 'new_program_request',
            for: ['admin']
        },
        // {
        //     name: 'Program Start',
        //     key: 'program_start'
        // },
        {
            name: 'Joining Request',
            key: 'joining_request',
            for: ['mentee', 'mentor']
        },
        {
            name: 'Program Reschedule',
            key: 'program_reschedule',
            for: ['mentor', 'admin']
        },
        {
            name: 'Program Cancel',
            key: 'program_cancel',
            for: ['mentor', 'mentee', 'admin']
        }
    ]

    programRequestTab = programRequestTab.filter((tab) => tab.for.includes(role))

    // if (role === 'mentor') {
    //     programRequestTab = [{
    //         name: 'Joining Request',
    //         key: 'joining_request'
    //     }
    //     ]
    // }

    const memberJoinRequestTab = [
        {
            name: 'Mentor Request',
            key: 'mentor'
        },
        // {
        //     name: 'Mentee Request',
        //     key: 'mentee'
        // }
    ]

    const goalsRequestTab = [
        {
            name: 'Mentor Goals',
            key: 'mentor'
        },
        {
            name: 'Mentee goals',
            key: 'mentee'
        }
    ]

    const resourceAccessRequestTab = [
        {
            name: 'Mentor Resources',
            key: 'mentor'
        },
        {
            name: 'Mentee Resources',
            key: 'mentee'
        }
    ]

    const statusOptions = [
        {
            label: "All",
            value: "all"
        },
        {
            label: "New",
            value: "new"
        },
        {
            label: "Pending",
            value: "pending"
        },
        {
            label: "Approved",
            value: "accept"
        },
        {
            label: "Rejected",
            value: "cancel"
        }
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleMoreClick = (event, data) => {
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };

    // Reset Confirm Popup
    const resetConfirmPopup = () => {
        setConfirmPopup({ show: false, title: '', requestType: '', type: '', action: '' })
    }

    // Open Confirm Popup
    const handleOpenConfirmPopup = (title, pageType, request, type = 'approve') => {
        setConfirmPopup({ show: true, title: title, requestType: pageType, type: type, action: request })
    }

    // Confirm Accept Popup
    const handleConfirmPopup = () => {
        if (confirmPopup.requestType === 'program_request') {
            handleAcceptProgramApiRequest()
        }
        if (confirmPopup.requestType === 'goal_request') {
            if (confirmPopup.type === 'reject') {
                handleCancelGoalApiRequest()
            }
        }

        if (confirmPopup.requestType === 'member_join_request') {
            if (confirmPopup.type === 'reject') {
                handleCancelMemberApiRequest()
            }
        }

        if (confirmPopup.requestType === 'report_request') {
            if (confirmPopup.type === 'approve') {
                handleAcceptReportApiRequest()
            }
        }
        if (confirmPopup.requestType === 'certificate_request') {
            if (confirmPopup.type === 'approve') {
                handleApproveCertificateApiRequest()
            }
            if (confirmPopup.type === 'reject') {
                handleCancelCertificateApiRequest()
            }
        }
    }

    // Cancel Accept Popup
    const handleCancelConfirmPopup = () => {
        resetConfirmPopup()
    }
    // Certificate Approve 
    const handleApproveCertificateApiRequest = () => {
        dispatch(updateCertificateRequest({
            "id": seletedItem.id,
            "status": "accept"
        }))
    }

    const handleCancelCertificateApiRequest = () => {
        dispatch(updateCertificateRequest({
            "id": seletedItem.id,
            "status": "cancel"
        }))

    }

    // ACCEPT API CALLS

    // Accepting Program Request Api Call 
    const handleAcceptProgramApiRequest = () => {

        if (role === 'admin') {
            dispatch(updateProgramRequest({
                "id": seletedItem.id,
                "action": "accept"
            }))
        }

        if (role === 'mentor') {
            dispatch(updateProgramMenteeRequest(
                {
                    "id": seletedItem.id,
                    "action": "accept"
                }
            ))
        }
    }

    // Accepting Report Request Api Call 
    const handleAcceptReportApiRequest = () => {
        dispatch(updateReportRequest({
            "id": seletedItem.id,
            "report_status": "accept"
        }))
    }

    // Cancel Goal Request Api Call
    const handleCancelGoalApiRequest = () => {
        dispatch(updateGoalRequest({
            status: "cancel",
            id: seletedItem.id
        }))
    }

    // Cancel Member Request Api Call
    const handleCancelMemberApiRequest = () => {
        dispatch(cancelMemberRequest({
            member_id: seletedItem.id
        }))
    }



    // Close Cancel Reason Popup
    const handleCloseCancelReasonPopup = () => {
        resetCancelReasonPopup()
        reset()
    }

    // Reset Cancel Popup
    const resetCancelReasonPopup = () => {
        setCancelPopup({ show: false, page: '' })
    }

    // Cancel Reason Popup Submit
    const handleCancelReasonPopupSubmit = (data) => {
        if (data.cancel_reason !== '') {
            if (cancelPopup.show) {

                if (cancelPopup.page === 'program_request') {

                    if (role === 'admin') {
                        dispatch(updateProgramRequest({
                            id: seletedItem.id,
                            action: "cancel",
                            cancelled_reason: data.cancel_reason
                        }))
                    }

                    if (role === 'mentor') {
                        dispatch(updateProgramMenteeRequest({
                            id: seletedItem.id,
                            action: "cancel",
                            cancelled_reason: data.cancel_reason
                        }))
                    }

                }

                if (cancelPopup.page === 'report_request') {
                    dispatch(updateReportRequest({
                        id: seletedItem.id,
                        report_status: "cancel",
                        report_comment: data.cancel_reason
                    }))
                }

            }
        }
    }


    // PROGRAM

    // Program Dropwdowm Accept
    const handleAcceptProgramRequest = () => {
        handleOpenConfirmPopup('Program Request', currentRequestTab.key, actionTab, 'approve')
        handleClose();
    }

    // Program Dropdown Cancel
    const handleCancelProgramRequest = () => {
        setCancelPopup({ show: true, page: currentRequestTab.key })
        handleClose()
    }

    // MEMBERS

    // Member Drodown Accept
    const handleMemberAcceptRequest = () => {
        dispatch(getCategoryList())
        handleClose();
    }

    // Member Drodown Cancel
    const handleMemberCancelRequest = () => {
        handleOpenConfirmPopup(`${actionTab === 'mentor' ? 'Mentor ' : 'Mentee '} Request`, currentRequestTab.key, actionTab, 'reject')
        handleClose()
    }

    // REPORTS
    const handleAcceptReportsRequest = () => {
        handleOpenConfirmPopup('Report Request', currentRequestTab.key, actionTab, 'approve')
        handleClose();
    }
    // Certificate
    const handleAcceptCeritificateRequest = () => {
        handleOpenConfirmPopup('Certificate Request', currentRequestTab.key, actionTab, 'approve')
        handleClose();
    }
    const handleCancelCeritificateRequest = () => {
        handleOpenConfirmPopup('Certificate Request', currentRequestTab.key, actionTab, 'reject')
        handleClose();
    }

    // Program Dropdown Cancel
    const handleCancelReportRequest = () => {
        setCancelPopup({ show: true, page: currentRequestTab.key })
        handleClose()
    }


    // GOAL

    // Goal Dropdown Accept
    const handleAcceptGoalRequest = () => {
        dispatch(getCategoryList())
        handleClose();
    }

    // Goal Dropdown Cancel
    const handleCancelGoalRequest = () => {
        handleOpenConfirmPopup('Goal Request', currentRequestTab.key, actionTab, 'reject')
        handleClose()
    }

    // Category Popup Close
    const handleCloseCategoryPopup = () => {
        setCategoryPopup({ show: false, selectedItem: [], page: '', tab: '' })
    }

    // Handle Selected Items for Category 
    const handleSelectedItems = (selectedInfo) => {
        let data = { ...categoryPopup }
        if (selectedInfo.length) {
            data = { ...data, selectedItem: selectedInfo }
        }
        if (categoryPopup.page === 'goal_request') {
            const categoryId = []
            data.selectedItem.forEach((selected) => categoryId.push(selected.categories_id))
            const payload = {
                status: "accept",
                id: seletedItem.id,
                categories: categoryId
            }
            dispatch(updateGoalRequest(payload))
        }


        if (categoryPopup.page === 'member_join_request') {
            const categoryId = []
            data.selectedItem.forEach((selected) => categoryId.push(selected.categories_id))
            const payload = {
                member_id: seletedItem.id,
                categories_id: categoryId
            }
            dispatch(updateMemberRequest(payload))
        }
    }

    const requestList = requestOverview.filter(request => request.for.includes(role))

    let programRequestColumn = programRequestColumns.filter(request => request.for.includes(role))

    if (actionTab !== 'program_start') {
        programRequestColumn = programRequestColumn.filter(column => column.field !== 'auto_approval')
    }


    programRequestColumn = [
        ...programRequestColumn,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params.row.status]?.bgColor || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}>
                            {requestStatusText[params.row.status] || ''}
                        </span>
                    </div>
                </>
            }
        },
        {
            ...role !== 'mentee' &&
            {
                field: 'action',
                headerName: 'Action',
                flex: 1,
                id: 4,
                renderCell: (params) => {

                    return <>

                        <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
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
                            <MenuItem onClick={(e) => {
                                const requestQuery = seletedItem.status === 'new' || seletedItem.status === 'pending' ? `&request_id=${seletedItem.id}` : ''
                                const url = role === 'admin' ? `/program-details/${seletedItem.program}?request_id=${seletedItem.id}&type=${actionTab}` : `/mentee-details/${seletedItem.requested_by}?type=mentee_request${requestQuery}`;
                                return navigate(url);
                            }} className='!text-[12px]'>
                                <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                                View
                            </MenuItem>

                            {
                                (seletedItem.status === 'new' || seletedItem.status === 'pending') &&
                                <>
                                    <MenuItem onClick={handleAcceptProgramRequest} className='!text-[12px]'>
                                        <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                        Approve
                                    </MenuItem>
                                    <MenuItem onClick={handleCancelProgramRequest} className='!text-[12px]'>
                                        <img src={CloseCircle} alt="CancelIcon" className='pr-3 w-[27px]' />
                                        Reject
                                    </MenuItem>
                                </>
                            }
                        </Menu>
                    </>
                }
            }
        }
    ]

    const goalColumns = [
        {
            field: 'goal_name',
            headerName: 'Goal Name',
            flex: 1,
            id: 0,
            for: ['admin','mentor'],
            renderCell: (params) => {
                return <div className='flex gap-2 items-center'>{params?.row?.goal?.goal_name ?? "..."}</div>
            }
        },
        {
            field: 'reason_request',
            headerName: 'Reason Request',
            flex: 1,
            id: 1,
            for: ['admin','mentor'],
            renderCell: (params) => {
                return <div className='flex gap-2 items-center'>{params?.row?.goal?.description?.length ? params?.row?.goal?.description : "..."}</div>
            }
        },
        ...goalsRequestColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params.row.status]?.bgColor || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}>
                            {requestStatusText[params.row.status] || ''}
                        </span>
                    </div>
                </>
            }
        },
        {


            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                if (params.row.status !== 'new' && params.row.status !== 'pending') return <></>
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
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
                        <MenuItem onClick={(e) => { navigate(`/view-goal/${seletedItem?.goal?.id}`) }} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View
                        </MenuItem>

                        {
                            role === 'admin' &&
                            <>
                                <MenuItem onClick={handleAcceptGoalRequest} className='!text-[12px]'>
                                    <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                    Approve
                                </MenuItem>
                                <MenuItem onClick={handleCancelGoalRequest} className='!text-[12px]'>
                                    <img src={CloseCircle} alt="CancelIcon" className='pr-3 w-[27px]' />
                                    Reject
                                </MenuItem>
                            </>
                        }
                    </Menu>
                </>
            }

        },
    ]

    const membersColumns = [
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params.row.status]?.bgColor || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}>
                            {requestStatusText[params.row.status] || ''}
                        </span>
                    </div>
                </>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
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
                        <MenuItem onClick={(e) => { handleClose(); navigate(`/mentor-details/${seletedItem.id}`) }} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View Profile
                        </MenuItem>

                        {
                            role === 'admin' &&
                            <>
                                {
                                    (seletedItem.status === 'new' || seletedItem.status === 'pending') &&

                                    <>

                                        <MenuItem onClick={handleMemberAcceptRequest} className='!text-[12px]'>
                                            <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                            Approve
                                        </MenuItem>
                                        <MenuItem onClick={handleMemberCancelRequest} className='!text-[12px]'>
                                            <img src={CloseCircle} alt="CancelIcon" className='pr-3 w-[27px]' />
                                            Reject
                                        </MenuItem>
                                    </>
                                }

                                {/* <MenuItem onClick={() => undefined} className='!text-[12px]'>
                                    <img src={ShareIcon} alt="ShareIcon" className='pr-3 w-[27px]' />
                                    Share
                                </MenuItem> */}
                            </>
                        }
                    </Menu>
                </>
            }

        },
    ]

    const resourceColumns = [
        ...resourceAccessRequestColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
        },
        {

            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
                        <img src={MoreIcon} alt='MoreIcon' />
                    </div>
                </>
            }
        }
    ]

    const reportRequestColumn = [
        ...reportRequestColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params.row.status]?.bg || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}>
                            {requestStatusText[params.row.status] || ''}
                        </span>
                    </div>
                </>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
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
                            role === 'admin' &&
                            <>
                                <MenuItem onClick={() => navigate(`/view-report/${seletedItem.report_id}`)} className='!text-[12px]'>
                                    <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                    View
                                </MenuItem>
                                {
                                    (seletedItem.status === 'new' || seletedItem.status === 'pending') &&
                                    <>
                                        <MenuItem onClick={handleAcceptReportsRequest} className='!text-[12px]'>
                                            <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                            Approve
                                        </MenuItem>
                                        <MenuItem onClick={handleCancelReportRequest} className='!text-[12px]'>
                                            <img src={CloseCircle} alt="CancelIcon" className='pr-3 w-[27px]' />
                                            Reject
                                        </MenuItem>
                                    </>
                                }
                            </>
                        }
                    </Menu>
                </>
            }
        }
    ]

    const techinicalColums = [
        ...techinicalSupportRequestColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
        },
    ]

    const certificateColumns = [
        ...certificateRequestColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: requestStatusColor[params.row.status]?.bg || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}>
                            {requestStatusText[params.row.status] || ''}
                        </span>
                    </div>
                </>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
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
                            role === 'admin' &&

                            <>
                                <MenuItem onClick={() => navigate(`/certificate_mentees/${seletedItem.program}`)} className='!text-[12px]'>
                                    <img src={ViewIcon} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                    View
                                </MenuItem>
                                {
                                    (seletedItem.status === 'new' || seletedItem.status === 'pending') &&

                                    <>

                                        <MenuItem onClick={handleAcceptCeritificateRequest} className='!text-[12px]'>
                                            <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                            Approve
                                        </MenuItem>
                                        <MenuItem onClick={handleCancelCeritificateRequest} className='!text-[12px]'>
                                            <img src={CloseCircle} alt="CancelIcon" className='pr-3 w-[27px]' />
                                            Reject
                                        </MenuItem>
                                    </>
                                }

                            </>
                        }
                    </Menu>
                </>
            }
        },
    ]

    let learningAccessRequestsColumn = learningAccessRequestsColumns.filter(request => request.for.includes(role))
    let newGoalsRequestsColumn = newGoalsRequestsColumns.filter(request => request.for.includes(role))

    const handleClick = (menu) => {
        navigate(`/all-request?type=${menu.status}`)
        handleStatus("all")
        setFilter({ search: '', filter_by: '' })
    }

    const getProgramRequestApi = () => {
        let payload = {
            request_type: actionTab,
            ...filterStatus !== 'all' ? { status: filterStatus } : '',
            page: paginationModel?.page + 1, limit: paginationModel?.pageSize,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }


        if (role === 'mentor') {
            payload.created_at = 'mentee'
            // payload.request_type = 'joining_request'
        }
        dispatch(getprogramRequest(payload))
    }

    const getLearningAccessApi = async () => {
        dispatch(getlearningAccessRequest({
            ...filterStatus !== 'all' && { status: filterStatus },
            created_at: 'mentor',
            filter_by: 'month',
            page: paginationModel?.page + 1, limit: paginationModel?.pageSize,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }))

    }

    const getGoalsRequestApi = () => {
        dispatch(goalsRequest({
            ...filterStatus !== 'all' && { status: filterStatus },
            created_by: actionTab,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }))
    }

    const getReportsRequestApi = () => {
        dispatch(getReportRequest({
            ...filterStatus !== 'all' && { rep_status: filterStatus },
            page: paginationModel?.page + 1,
            limit: paginationModel?.pageSize,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }))
    }

    const getCerificateRequestAPi = () => {
        dispatch(certificateRequest({
            filterStatus: filterStatus !== 'all' ? filterStatus : "",
            page: paginationModel?.page + 1,
            limit: paginationModel?.pageSize ?? 10,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }))
    }

    const getMembersRequestApi = () => {
        dispatch(getMemberRequest({
            ...filterStatus !== 'all' && { status: filterStatus },
            user: actionTab,
            page: paginationModel?.page + 1, limit: paginationModel?.pageSize,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }));
    }

    const getResourceRequestApi = () => {
        dispatch(getResourceRequest({
            ...filterStatus !== 'all' && { status: filterStatus },
            created_at: actionTab,
            ...filter.search !== '' && { search: filter.search },
            ...filter.filter_by !== '' ? { filter_by: filter.filter_by } : { filter_by: 'month' }
        }))
    }

    const handleStatus = (val) => {
        setFilterStatus(val)
        setPaginationModel({
            page: 0,
            pageSize: 10
        })
    }

    const handleSearchCategory = (e) => {
        let catList = categoryInfo.list.filter(list => list.name.toLowerCase().includes(e.target.value.toLowerCase()))
        if (e.target.value === '') catList = categoryList
        setCategoryInfo({ search: e.target.value, list: catList })
    }

    useEffect(() => {
        if (searchParams.get("type") && role !== '' && !userInfo.loading) {
            const tab = searchParams.get("type")
            const requestTabDetails = RequestStatusArray.find(request => request.key === tab)
            let tableDetails = { ...activeTableDetails }
            let actionFilter = []
            let activeTabName = ''
            switch (tab) {
                case RequestStatus.programRequest.key:
                    let programInfoTab = programRequestTab
                    if (role === 'mentor') {
                        // programInfoTab = [{
                        //     name: 'Joining Request',
                        //     key: 'joining_request'
                        // }
                        // ]
                    }
                    tableDetails = { column: programRequestColumn, data: [] }
                    actionFilter = programInfoTab
                    activeTabName = role === 'mentee' || role === 'mentor' ? 'joining_request' : 'new_program_request'
                    console.log('activeTabName', activeTabName, actionTab)
                    if(actionTab !== 'joining_request' && actionTab !== 'new_program_request'){
                        activeTabName = actionTab
                    }
                   
                    break;
                case RequestStatus.memberJoinRequest.key:
                    tableDetails = { column: memberMentorRequestColumns, data: [] }
                    actionFilter = memberJoinRequestTab
                    activeTabName = 'mentor'
                    break;
                case RequestStatus.goalRequest.key:
                    tableDetails = { column: goalColumns, data: [] }
                    actionFilter = goalsRequestTab
                    activeTabName = 'mentor'
                    break;
                case RequestStatus.resourceAccessRequest.key:
                    tableDetails = { column: resourceColumns, data: [] }
                    actionFilter = resourceAccessRequestTab
                    activeTabName = 'mentor'
                    break;
                case RequestStatus.technicalSupportRequest.key:
                    tableDetails = { column: techinicalColums, data: [] }
                    break;
                case RequestStatus.testimonicalRequest.key:
                    tableDetails = { column: testimonialRequestColumns, data: [] }
                    break;
                case RequestStatus.certificateRequest.key:
                    tableDetails = { column: certificateColumns, data: [] }
                    break;
                case RequestStatus.reportRequest.key:
                    tableDetails = { column: reportRequestColumns, data: [] }
                    break;
                case RequestStatus.learningAccessRequests.key:
                    tableDetails = { column: learningAccessRequestsColumn, data: [] }
                    actionFilter = []
                    break;
                case RequestStatus.newGoalsRequests.key:
                    tableDetails = { column: newGoalsRequestsColumn, data: [] }
                    actionFilter = []
                    break;
                default:
                    tableDetails = { column: programRequestTab, data: [] }
                    actionFilter = []
                    break;
            }
            setActiveTableDetails(tableDetails)
            setCurrentRequestTab(requestTabDetails)
            setActionTabFilter(actionFilter)
            setActiveTab(activeTabName)
        } else {
            if (role !== '') {
                setActionTabFilter(programRequestTab)
                setActiveTab(role !== 'admin' ? 'joining_request' : 'new_program_request')
            }
        }
    }, [searchParams, role])


    useEffect(() => {
        // Program update action
        if (status === requestStatus.programupdate) {
            setShowToast({ show: true, message: 'Program Request updated successfully' })
            getProgramRequestApi()
            if (confirmPopup.show) resetConfirmPopup()
            if (cancelPopup.show) resetCancelReasonPopup()
            setTimeout(() => {
                setShowToast({ show: false, message: '' })
                dispatch(updateLocalRequest({ status: '' }))
            }, [3000])
        }

        // Category load action
        if (status === requestStatus.categoryload) {
            setCategoryPopup({ show: true, selectedItem: [], page: currentRequestTab.key, tab: actionTab })
            setCategoryInfo({ search: '', list: categoryList })
            setTimeout(() => {
                dispatch(updateLocalRequest({ status: '' }))
            }, 2000)
        }


        // Member update action
        if (status === requestStatus.memberupdate || status === requestStatus.membercancel) {
            if (confirmPopup.show) resetConfirmPopup()
            if (categoryPopup.show) handleCloseCategoryPopup()
            getMembersRequestApi()
            setShowToast({ show: true, message: 'Member Request updated successfully' })
            setTimeout(() => {
                setShowToast({ show: false, message: '' })
                dispatch(updateLocalRequest({ status: '' }))
            }, 3000)
        }

        // Goal update action
        if (status === requestStatus.goalupdate) {
            if (confirmPopup.show) resetConfirmPopup()
            if (categoryPopup.show) handleCloseCategoryPopup()
            getGoalsRequestApi()
            setShowToast({ show: true, message: 'Goal Request updated successfully' })
            setTimeout(() => {
                setShowToast({ show: false, message: '' })
                dispatch(updateLocalRequest({ status: '' }))
            }, 3000)
        }

        // Certificate update action
        if (status === requestStatus.certificateupdate) {
            if (confirmPopup.show) resetConfirmPopup()
            if (categoryPopup.show) handleCloseCategoryPopup()
            getCerificateRequestAPi()
            setShowToast({ show: true, message: 'Certificate Request updated successfully' })
            setTimeout(() => {
                setShowToast({ show: false, message: '' })
                dispatch(updateLocalRequest({ status: '' }))
            }, 3000)
        }


        // Report update action
        if (status === requestStatus.reportupdate) {
            if (confirmPopup.show) resetConfirmPopup()
            if (cancelPopup.show) resetCancelReasonPopup()
            getReportsRequestApi()
            setShowToast({ show: true, message: 'Reports Request updated successfully' })
            setTimeout(() => {
                setShowToast({ show: false, message: '' })
                dispatch(updateLocalRequest({ status: '' }))
            }, 3000)
        }

    }, [status])

    useEffect(() => {

        if (searchParams.get('type') === 'program_request' || !searchParams.get('type')) {
            setActiveTableDetails({ column: programRequestColumn, data: programTableInfo.results, rowCount: programTableInfo?.count })
        }

        if (searchParams.get('type') === 'member_join_request') {
            setActiveTableDetails({ column: actionTab === 'mentor' ? [...memberMentorRequestColumns, ...membersColumns] : [...memberMenteeRequestColumns, ...membersColumns], data: memberRequest?.results, rowCount: memberRequest?.count })
        }

        if (searchParams.get('type') === 'goal_request') {
            setActiveTableDetails({ column: goalColumns, data: goalsRequestInfo?.results, rowCount: goalsRequestInfo?.count })
        }
        if (searchParams.get('type') === 'certificate_request') {
            setActiveTableDetails({ column: certificateColumns, data: certificateRequestList?.results, rowCount: certificateRequestList?.count })
        }

        if (searchParams.get('type') === 'resource_access_request') {
            setActiveTableDetails({ column: resourceColumns, data: resourceRequest })
        }

        if (searchParams.get('type') === 'report_request') {
            setActiveTableDetails({ column: reportRequestColumn, data: reportsRequestInfo?.results, rowCount: reportsRequestInfo?.count })
        }
        if (searchParams.get('type') === 'learning_access_requests') {
            setActiveTableDetails({ column: learningAccessRequestsColumns, data: learningAccessRequests?.results, rowCount: learningAccessRequests?.count })
        }

    }, [programTableInfo, memberRequest, resourceRequest, goalsRequestInfo, certificateRequestList, reportsRequestInfo, anchorEl, learningAccessRequests])
    // console.log("searchParams.get('type') ===>", searchParams.get('type'))
    useEffect(() => {

        if (role !== '') {
            if (!searchParams.get('type') || searchParams.get('type') === 'program_request') {
                getProgramRequestApi()
            }

            if (searchParams.get('type') === 'learning_access_requests') {
                getLearningAccessApi()
            }
            if (searchParams.get('type') === 'member_join_request') {
                getMembersRequestApi()
            }

            if (searchParams.get('type') === 'resource_access_request') {
                getResourceRequestApi()
            }

            if (searchParams.get('type') === 'goal_request') {
                getGoalsRequestApi()
            }


            if (searchParams.get('type') === 'certificate_request') {
                getCerificateRequestAPi()
            }
            if (searchParams.get('type') === 'report_request') {
                getReportsRequestApi()
            }
        }



    }, [actionTab, searchParams, filterStatus, role, paginationModel])

    const footerComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setCategoryPopup({ show: false, selectedItem: [] })} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => { handleSelectedItems(props.selectedRows) }}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Submit</button>
            </div>)
    }

    const resetPageDetails = () => {
        handleStatus("all")
    }


    const handleSearch = (e) => {
        setFilter({ ...filter, search: e.target.value })
    }

    useEffect(() => {
        if (filter.search !== '') {
            searchParams.set('search', filter.search)
        }else{
            searchParams.delete('search')
        }
        if (filter.filter_by !== '') {
            searchParams.set('filter_by', filter.filter_by)
        }else{
            searchParams.delete('filter_by')
        }
        setSearchParams(searchParams)
    }, [filter])


    return (
        <div className="program-request px-8 mt-10">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[18px] font-semibold'>
                        <p>{role === 'admin' ? 'All ' : 'My '} Request</p>
                    </div>
                </div>

                {
                    showToast.show &&
                    <ToastNotification message={showToast.message} handleClose={handleClose} />
                }

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => 1 }}
                    open={confirmPopup.show}
                >
                    <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                        <img src={confirmPopup.type === 'approve' ? TickColorIcon : confirmPopup.type === 'reject' ? CancelColorIcon : ''} alt="TickColorIcon" />
                        <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
                            {confirmPopup.type === 'approve' ? 'Approve' : confirmPopup.type === 'reject' ? 'Reject' : ''}
                        </span>
                        <div className='py-5'>
                            <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>
                                Are you sure want to {confirmPopup.type} {confirmPopup.title}?
                            </p>
                        </div>
                        <div className='flex justify-center'>
                            <div className="flex gap-6 justify-center align-middle">
                                <Button btnCls="w-[110px]" btnName={confirmPopup.type === 'approve' ? 'Cancel' : confirmPopup.type === 'reject' ? 'No' : ''} btnCategory="secondary" onClick={handleCancelConfirmPopup} />
                                <Button btnType="button" btnCls="w-[110px]" btnName={confirmPopup.type === 'approve' ? 'Approve' : confirmPopup.type === 'reject' ? 'Yes' : ''}
                                    style={{ background: confirmPopup.type === 'approve' ? '#16B681' : '#E0382D' }} btnCategory="primary"
                                    onClick={handleConfirmPopup}
                                />
                            </div>
                        </div>
                    </div>

                </Backdrop>

                {/* {'Cancel Popup'} */}
                <MuiModal modalSize='md' modalOpen={cancelPopup.show} modalClose={handleCloseCancelReasonPopup} noheader>

                    <div className='px-5 py-5'>
                        <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                            style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                            <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Reject Request Reason </p>
                                <img className='cursor-pointer' onClick={handleCloseCancelReasonPopup} src={CancelIcon} alt="CancelIcon" />
                            </div>

                            <div className='px-5'>
                                {
                                    error !== '' ? <p className="error" role="alert">{error}</p> : null
                                }


                                <form onSubmit={handleSubmit(handleCancelReasonPopupSubmit)}>
                                    <div className='relative pb-8'>
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                            Reject Reason
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
                                        <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={handleCloseCancelReasonPopup} />
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

                {/* { 'Select Categort Popup'} */}
                <MuiModal modalSize='md' modalOpen={categoryPopup.show} modalClose={handleCloseCategoryPopup} noheader>
                    <div className='px-5 py-5'>
                        <div className='flex justify-center flex-col gap-5 px-5 pb-5 mt-4 mb-4'
                            style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                            <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                                <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Select Category</p>
                                <img className='cursor-pointer' onClick={handleCloseCategoryPopup} src={CancelIcon} alt="CancelIcon" />
                            </div>
                            <div className='flex justify-between px-3 mb-4'>
                                <div className="relative w-full">
                                    <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                        placeholder="Search here..." style={{
                                            border: '1px solid rgba(29, 91, 191, 1)',
                                            borderRadius: '50px',
                                            height: '60px',
                                            width: '100%'
                                        }}
                                        onChange={handleSearchCategory}
                                        value={categoryInfo.search}
                                    />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                        <img src={SearchIcon} alt='SearchIcon' />
                                    </div>
                                </div>
                            </div>


                            <DataTable
                                rows={categoryInfo.list}
                                columns={categoryColumns}
                                height={'460px'}
                                footerComponent={footerComponent}
                                selectedAllRows={categoryPopup.selectedItem}
                            />

                        </div>
                    </div>

                </MuiModal>

                <div className='px-4'>
                    <div className="grid grid-cols-5 gap-3">
                        <div className="row-span-3 flex flex-col gap-8">
                            <Card cardTitle={'Request Overview'} cardContent={requestList} handleClick={handleClick} activeItem={currentRequestTab.key} />
                        </div>


                        <div className="col-span-4">
                            <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                    <div className="flex gap-4" style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600 }}>
                                        {currentRequestTab.name}
                                    </div>
                                    <div className="flex gap-7 items-center">
                                        <div className="relative">
                                            <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                                placeholder="Search here..." style={{
                                                    border: '1px solid rgba(29, 91, 191, 1)',
                                                    height: '45px',
                                                    width: '280px'
                                                }}
                                                value={filter.search}
                                                onChange={handleSearch}
                                            />
                                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                                <img src={SearchIcon} alt='SearchIcon' />
                                            </div>
                                        </div>
                                        {/* <img src={SearchIcon} alt="statistics" /> */}

                                        <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>
                                            <img src={CalendarIcon} alt="CalendarIcon" />

                                            <select className='focus:outline-none' style={{ background: 'rgba(223, 237, 255, 1)', border: 'none' }}
                                                onChange={(e) => setFilter({ ...filter, filter_by: e.target.value })}>
                                                <option value="month" selected={filter.filter_by === 'month'}>Month</option>
                                                <option value="day" selected={filter.filter_by === 'day'}>Day</option>
                                            </select>
                                        </p>

                                        <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px', height: '40px' }}>
                                            <select className='focus:outline-none' style={{ background: 'rgba(29, 91, 191, 1)', border: 'none', color: '#fff' }} onChange={(e) => handleStatus(e?.target?.value)}>

                                                {
                                                    statusOptions.map((option, index) =>
                                                        <option style={{background: '#fff', color: '#000'}} key={index} selected={option?.value === filterStatus} value={option?.value}>{option?.label}</option>
                                                    )
                                                }
                                            </select>
                                        </p>
                                    </div>
                                </div>


                                <div className='px-6 py-7 program-info'>
                                    {
                                        actionTabFilter.length ?
                                            <div className='flex justify-between px-5 mb-8 items-center border-b-2 '>
                                                <ul className='tab-list'>
                                                    {
                                                        actionTabFilter.map((discussion, index) =>
                                                            <li className={`${actionTab === discussion.key ? 'active' : ''} relative`} key={index}
                                                                onClick={() => {
                                                                    setActiveTab(discussion.key)
                                                                    resetPageDetails()
                                                                    // setFilter({ search: '', filter_by: '' })
                                                                }}
                                                            >
                                                                {/* <div className='flex justify-center pb-1'>
                                                                    <div className={`total-proram-count relative ${actionTab === discussion.key ? 'active' : ''}`}>10

                                                                        <p className='notify-icon'></p>
                                                                    </div>
                                                                </div> */}
                                                                <div className='text-[13px]'> {`${discussion.name}`}</div>
                                                                {actionTab === discussion.key && <span></span>}
                                                            </li>)
                                                    }
                                                </ul>
                                            </div>

                                            : null
                                    }

                                    <Backdrop
                                        sx={{ zIndex: (theme) => 999999999 }}
                                        open={loading}
                                    >
                                        <CircularProgress color="inherit" />

                                    </Backdrop>

                                    <DataTable rows={activeTableDetails.data} columns={activeTableDetails.column} hideFooter={!activeTableDetails?.data?.length} rowCount={activeTableDetails?.rowCount}
                                        paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}
