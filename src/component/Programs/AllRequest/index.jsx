import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Card from '../../../shared/Card'
import { requestOverview, RequestStatus, RequestStatusArray } from '../../../utils/constant'
import SearchIcon from '../../../assets/icons/search.svg';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import ArrowRightIcon from '../../../assets/icons/arrowRightColor.svg';

import DataTable from '../../../shared/DataGrid';
import { certificateRequestColumns, goalsRequestColumns, memberMentorRequestColumns, programRequestColumns, programRequestData, reportRequestColumns, resourceAccessRequestColumns, techinicalSupportRequestColumns, testimonialRequestColumns } from '../../../mock';

import './request.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AllRequest() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [currentRequestTab, setCurrentRequestTab] = useState(RequestStatus.programRequest)
    const [actionTab, setActiveTab] = useState('new')
    const [actionTabFilter, setActionTabFilter] = useState([])
    const [activeTableDetails, setActiveTableDetails] = useState({ column: [], data: [] })
    const userInfo = useSelector(state => state.userInfo)

    const role = userInfo.data.role
    const programRequestTab = [
        {
            name: 'New Program Request',
            key: 'new'
        },
        {
            name: 'Joining Request',
            key: 'deactivate'
        },
        {
            name: 'Program Start',
            key: 'start'
        },
        {
            name: 'Program Reschedule',
            key: 'reschedule'
        },
        {
            name: 'Program Cancel',
            key: 'program_cancel'
        }
    ]

    const memberJoinRequestTab = [
        {
            name: 'Mentor Request',
            key: 'mentor_request'
        },
        {
            name: 'Mentee Request',
            key: 'mentee_request'
        }
    ]

    const goalsRequestTab = [
        {
            name: 'Mentor Goals',
            key: 'mentor_goals'
        },
        {
            name: 'Mentee goals',
            key: 'mentee_goals'
        }
    ]

    const resourceAccessRequestTab = [
        {
            name: 'Mentor Resources',
            key: 'mentor_resources'
        },
        {
            name: 'Mentee Resources',
            key: 'mentee_resources'
        }
    ]

    const requestList = requestOverview.filter(request => request.for.includes(role))

    let programRequestColumn = programRequestColumns.filter(request => request.for.includes(role))


    programRequestColumn = [
        ...programRequestColumn,
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

    const goalColumns = [
        ...goalsRequestColumns,
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
        console.log(menu)
        navigate(`/all-request?type=${menu.status}`)
    }

    useEffect(() => {
        if (searchParams.get("type")) {
            const tab = searchParams.get("type")
            const requestTabDetails = RequestStatusArray.find(request => request.key === tab)
            console.log('requestTabDetails', requestTabDetails)
            let tableDetails = { ...activeTableDetails }
            let actionFilter = []
            let activeTabName = ''
            switch (tab) {
                case RequestStatus.programRequest.key:
                    tableDetails = { column: programRequestColumn, data: [] }
                    actionFilter = programRequestTab
                    activeTabName = 'new'
                    break;
                case RequestStatus.memberJoinRequest.key:
                    tableDetails = { column: memberMentorRequestColumns, data: [] }
                    actionFilter = memberJoinRequestTab
                    activeTabName = 'mentor_request'
                    break;
                case RequestStatus.goalRequest.key:
                    tableDetails = { column: goalColumns, data: [] }
                    actionFilter = goalsRequestTab
                    activeTabName = 'mentor_goals'
                    break;
                case RequestStatus.resourceAccessRequest.key:
                    tableDetails = { column: resourceColumns, data: [] }
                    actionFilter = resourceAccessRequestTab
                    activeTabName = 'mentor_resources'
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
            console.log('Column', tableDetails)
            setActiveTableDetails(tableDetails)
            setCurrentRequestTab(requestTabDetails)
            setActionTabFilter(actionFilter)
            setActiveTab(activeTabName)
        } else {
            setActiveTableDetails({ column: programRequestColumn, data: [] })
            setActionTabFilter(programRequestTab)
            setActiveTab('new')
        }

    }, [searchParams])

    console.log('tableDetails', activeTableDetails, actionTabFilter)

    return (
        <div className="program-request px-8 mt-10">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[14px]'>
                        <p style={{ color: 'rgba(89, 117, 162, 1)', fontWeight: 500 }}>Objectives</p>
                        <img src={ArrowRightIcon} alt="ArrowRightIcon" />
                        <p>All Request</p>
                    </div>

                </div>


                <div className='px-4'>
                    <div className="grid grid-cols-5 gap-3">
                        <div className="row-span-3 flex flex-col gap-8">
                            <Card cardTitle={'Request Overview'} cardContent={requestList} handleClick={handleClick} />
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
                                            <select className='focus:outline-none' style={{ background: 'rgba(29, 91, 191, 1)', border: 'none', color: '#fff' }}>
                                                <option value="new">New</option>
                                                <option value="pending">Pending</option>
                                                <option value="accept">Accept</option>
                                                <option value="cancel">Cancel</option>
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
                                                                <div className='flex justify-center pb-3'>
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


                                    <DataTable rows={activeTableDetails.data} columns={activeTableDetails.column} hideFooter />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}
