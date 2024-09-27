import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Card from '../../../shared/Card'
import { programRequestStatusColor, programRequestStatusText, requestOverview, requestStatus, RequestStatus, RequestStatusArray, requestStatusColor, requestStatusText } from '../../../utils/constant'
import SearchIcon from '../../../assets/icons/search.svg';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import ArrowRightIcon from '../../../assets/icons/arrowRightColor.svg';
import MoreIcon from '../../../assets/icons/moreIcon.svg'
import TickCircle from '../../../assets/icons/tickCircle.svg'
import CloseCircle from '../../../assets/icons/closeCircle.svg'
import ViewIcon from '../../../assets/images/view1x.png'
import CancelIcon from '../../../assets/images/cancel1x.png'
import TickColorIcon from '../../../assets/icons/tickColorLatest.svg'
import CancelColorIcon from '../../../assets/icons/cancelCircle.svg'
import ShareIcon from '../../../assets/icons/Share.svg'


import DataTable from '../../../shared/DataGrid';
import { categoryColumns, certificateRequestColumns, goalsRequestColumns, memberMenteeRequestColumns, memberMentorRequestColumns, programRequestColumns, programRequestData, reportRequestColumns, resourceAccessRequestColumns, techinicalSupportRequestColumns, testimonialRequestColumns } from '../../../mock';

import './request.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cancelMemberRequest, getCategoryList, getMemberRequest, getprogramRequest, getResourceRequest, goalsRequest, updateGoalRequest, updateLocalRequest, updateMemberRequest, updateProgramRequest } from '../../../services/request';
import { Backdrop, CircularProgress } from '@mui/material';
import ToastNotification from '../../../shared/Toast';
import MuiModal from '../../../shared/Modal';
import { useForm } from 'react-hook-form';
import { Button } from '../../../shared';

export default function AllRequest() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();
    const { programRequest: programTableInfo, memberRequest, resourceRequest, categoryList, goalsRequest: goalsRequestInfo,
        loading, status, error } = useSelector(state => state.requestList);
    const [currentRequestTab, setCurrentRequestTab] = useState(RequestStatus.programRequest)
    const [filterStatus, setFilterStatus] = useState('new')
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [actionTab, setActiveTab] = useState('new_program_request')
    const [actionTabFilter, setActionTabFilter] = useState([])
    const [activeTableDetails, setActiveTableDetails] = useState({ column: [], data: [] })
    const [seletedItem, setSelectedItem] = useState({})
    const [confirmPopup, setConfirmPopup] = useState({ show: false, title: '', type: '', action: '' })
    const [cancelPopup, setCancelPopup] = useState({ show: false })
    const [showToast, setShowToast] = useState({ show: false, message: '' })
    const [categoryPopup, setCategoryPopup] = useState({ show: false, selectedItem: [], page: '', tab: '' })
    const userInfo = useSelector(state => state.userInfo)

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const role = userInfo.data.role
    const programRequestTab = [
        {
            name: 'New Program Request',
            key: 'new_program_request'
        },
        // {
        //     name: 'Joining Request',
        //     key: 'joining_request'
        // },
        {
            name: 'Program Start',
            key: 'program_start'
        },
        {
            name: 'Program Reschedule',
            key: 'program_reschedule'
        },
        {
            name: 'Program Cancel',
            key: 'program_cancel'
        }
    ]

    const memberJoinRequestTab = [
        {
            name: 'Mentor Request',
            key: 'mentor'
        },
        {
            name: 'Mentee Request',
            key: 'mentee'
        }
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

    const handleClose = () => {
        setAnchorEl(null);
    };
  
    


    const handleMoreClick = (event, data) => {
        console.log('more')
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
    }

    // Cancel Accept Popup
    const handleCancelConfirmPopup = () => {
        resetConfirmPopup()
    }


    // ACCEPT API CALLS

    // Accepting Program Request Api Call 
    const handleAcceptProgramApiRequest = () => {
        dispatch(updateProgramRequest({
            "id": seletedItem.id,
            "action": "accept"
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
        setCancelPopup({ show: false })
    }

    // Cancel Reason Popup Submit
    const handleCancelReasonPopupSubmit = (data) => {
        if (data.cancel_reason !== '') {
            console.log('seletedItem', seletedItem, confirmPopup)
            if (cancelPopup.show) {
                dispatch(updateProgramRequest({
                    id: seletedItem.id,
                    action: "cancel",
                    cancelled_reason: data.cancel_reason
                }))
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
        setCancelPopup({ show: true })
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
                        <MenuItem onClick={(e) => navigate(`/program-details/${seletedItem.program}?request_id=${seletedItem.id}`)} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                        {
                            (role === 'admin' && (params.row.status === 'new' || params.row.status === 'pending')) &&
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

    ]

    const goalColumns = [
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
                        <MenuItem onClick={(e) => { navigate(`/view-goal/${seletedItem.id}`) }} className='!text-[12px]'>
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
                console.log('ssss', params)
                // if (params.row.status !== 'new' && params.row.status !== 'pending') return <></>
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
                        <MenuItem onClick={(e) => { handleClose(); navigate(`/mentor-profile/${params?.row?.id}`) }} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View Profile
                        </MenuItem>

                        {
                            role === 'admin' &&

                            <>
                                {
                                    (params.row.status === 'new' || params.row.status === 'pending') &&

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

                                <MenuItem onClick={() => undefined} className='!text-[12px]'>
                                    <img src={ShareIcon} alt="ShareIcon" className='pr-3 w-[27px]' />
                                    Share
                                </MenuItem>
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
            // renderCell: (params) => {
            //     return <>
            //         <div className='cursor-pointer flex items-center h-full relative'>
            //             <span className='w-[80px] flex justify-center h-[30px] px-7'
            //                 style={{
            //                     background: certificateColor[params.row.status]?.bg || '', lineHeight: '30px',
            //                     borderRadius: '3px', width: '110px', height: '34px', color: certificateColor[params.row.status]?.color || '',
            //                     fontSize: '12px'
            //                 }}>
            //                 {certificateText[params.row.status] || ''}
            //             </span>
            //         </div>
            //     </>
            // }
        },
        {

            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                console.log('params', params)
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleMoreClick(e, params.row)}>
                        <img src={MoreIcon} alt='MoreIcon' />
                    </div>
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
            // renderCell: (params) => {
            //     return <>
            //         <div className='cursor-pointer flex items-center h-full relative'>
            //             <span className='w-[80px] flex justify-center h-[30px] px-7'
            //                 style={{
            //                     background: certificateColor[params.row.status]?.bg || '', lineHeight: '30px',
            //                     borderRadius: '3px', width: '110px', height: '34px', color: certificateColor[params.row.status]?.color || '',
            //                     fontSize: '12px'
            //                 }}>
            //                 {certificateText[params.row.status] || ''}
            //             </span>
            //         </div>
            //     </>
            // }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            // renderCell: (params) => {
            //     console.log('params', params)
            //     return <>
            //         <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e, params.row)}>
            //             <img src={ActionIcon} alt='ActionIcon' />
            //         </div>
            //     </>
            // }
        },
    ]

    const certificateColumns = [
        ...certificateRequestColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            // renderCell: (params) => {
            //     return <>
            //         <div className='cursor-pointer flex items-center h-full relative'>
            //             <span className='w-[80px] flex justify-center h-[30px] px-7'
            //                 style={{
            //                     background: certificateColor[params.row.status]?.bg || '', lineHeight: '30px',
            //                     borderRadius: '3px', width: '110px', height: '34px', color: certificateColor[params.row.status]?.color || '',
            //                     fontSize: '12px'
            //                 }}>
            //                 {certificateText[params.row.status] || ''}
            //             </span>
            //         </div>
            //     </>
            // }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            // renderCell: (params) => {
            //     console.log('params', params)
            //     return <>
            //         <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e, params.row)}>
            //             <img src={ActionIcon} alt='ActionIcon' />
            //         </div>
            //     </>
            // }
        },
    ]

    const handleClick = (menu) => {
        navigate(`/all-request?type=${menu.status}`)
    }

    const getProgramRequestApi = () => {
        const payload = {
            request_type: actionTab,
            status: filterStatus
        }
        dispatch(getprogramRequest(payload))
    }

    const getGoalsRequestApi = () => {
        dispatch(goalsRequest({
            status: filterStatus,
            created_at: actionTab,
            filter_by: 'day'
        }))
    }


    const getMembersRequestApi = () => {
        dispatch(getMemberRequest({
            status: filterStatus,
            user: actionTab,
        }));
    }

    const getResourceRequestApi = () => {
        dispatch(getResourceRequest({
            status: filterStatus,
            created_at: actionTab,
            filter_by: 'day'
        }))
    }

    const handleStatus = (e) => {
        setFilterStatus(e.target.value)
    }


    useEffect(() => {
        if (searchParams.get("type")) {
            const tab = searchParams.get("type")
            const requestTabDetails = RequestStatusArray.find(request => request.key === tab)
            let tableDetails = { ...activeTableDetails }
            let actionFilter = []
            let activeTabName = ''
            switch (tab) {
                case RequestStatus.programRequest.key:
                    tableDetails = { column: programRequestColumn, data: [] }
                    actionFilter = programRequestTab
                    activeTabName = 'new_program_request'
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
            // setActiveTableDetails({ column: programRequestColumn, data: [] })
            setActionTabFilter(programRequestTab)
            setActiveTab('new_program_request')
        }

        if (searchParams.get('type') === 'program_request') {
            getProgramRequestApi()
        }

    }, [searchParams])


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


    }, [status])

    useEffect(() => {
        console.log('Menu 1')
        if (searchParams.get('type') === 'program_request' || !searchParams.get('type')) {
            setActiveTableDetails({ column: programRequestColumn, data: programTableInfo })
        }

        if (searchParams.get('type') === 'member_join_request') {
            setActiveTableDetails({ column: actionTab === 'mentor' ? [...memberMentorRequestColumns, ...membersColumns] : [...memberMenteeRequestColumns, ...membersColumns], data: memberRequest })
        }
      

        if (searchParams.get('type') === 'goal_request') {
            setActiveTableDetails({ column: goalColumns, data: goalsRequestInfo })
        }

        if (searchParams.get('type') === 'resource_access_request') {
            setActiveTableDetails({ column: resourceColumns, data: resourceRequest })
        }



    }, [programTableInfo, memberRequest, resourceRequest, goalsRequestInfo, anchorEl])


    useEffect(() => {
        if (!searchParams.get('type') || searchParams.get('type') === 'program_request') {
            getProgramRequestApi()
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



    }, [actionTab, searchParams, filterStatus])


    const footerComponent = (props) => {
        return (
            <div className='flex gap-6 justify-center items-center py-4'>
                <button onClick={() => setCategoryPopup({ show: false, selectedItem: [] })} className='py-3 px-6 w-[16%]'
                    style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px', color: 'rgba(29, 91, 191, 1)' }}>Cancel</button>
                <button onClick={() => { console.log(props); handleSelectedItems(props.selectedRows) }}
                    className='text-white py-3 px-6 w-[16%]'
                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Submit</button>
            </div>)
    }

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
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
                                        }} />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                        <img src={SearchIcon} alt='SearchIcon' />
                                    </div>
                                </div>
                                {/* <div>
                                    <select className='form-control' style={{ border: '1px solid #000', height: '50px', width: '250px', padding: '6px' }}>
                                        <option value="category">Category</option>
                                        <option value="general">General Category</option>
                                    </select>
                                </div> */}
                            </div>


                            <DataTable
                                rows={categoryList}
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
                                        <img src={SearchIcon} alt="statistics" />

                                        <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>
                                            <img src={CalendarIcon} alt="CalendarIcon" />
                                            <select className='focus:outline-none' style={{ background: 'rgba(223, 237, 255, 1)', border: 'none' }}>
                                                <option>Day</option>
                                                <option>Month</option>
                                            </select>
                                        </p>

                                        <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px', height: '40px' }}>
                                            <select className='focus:outline-none' style={{ background: 'rgba(29, 91, 191, 1)', border: 'none', color: '#fff' }} onChange={handleStatus}>
                                                <option value="new">New</option>
                                                <option value="pending">Pending</option>
                                                <option value="accept">Approved</option>
                                                <option value="cancel">Rejected</option>
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
                                                                onClick={() => setActiveTab(discussion.key)}
                                                            >
                                                                <div className='flex justify-center pb-1'>
                                                                    <div className={`total-proram-count relative ${actionTab === discussion.key ? 'active' : ''}`}>10

                                                                        <p className='notify-icon'></p>
                                                                    </div>
                                                                </div>
                                                                <div className='text-[13px]'> {`${discussion.name}`}</div>
                                                                {actionTab === discussion.key && <span></span>}
                                                            </li>)
                                                    }
                                                </ul>
                                            </div>

                                            : null
                                    }

                                    <Backdrop
                                        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                        open={loading}
                                    >
                                        <CircularProgress color="inherit" />

                                    </Backdrop>

                                    <DataTable rows={activeTableDetails.data} columns={activeTableDetails.column} hideFooter={!activeTableDetails.data.length} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}
