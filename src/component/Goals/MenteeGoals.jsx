import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import { Backdrop, CircularProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import MoreIcon from '../../assets/icons/moreIcon.svg'
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import DataTable from '../../shared/DataGrid'
import { useDispatch, useSelector } from 'react-redux'
import { menteeGoalsRequestColumn, mentorMenteeGoalsColumn } from '../../mock'
import { getGoalsRequest, getMenteeGoals } from '../../services/goalsInfo';
import { goalDataStatus, goalStatusColor } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';

export default function MenteeGoals() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [seletedItem, setSelectedItem] = useState({})
    const open = Boolean(anchorEl);
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10
    })
    const [timeFrame, setTimeFrame] = React.useState("month")
    const [filterStatus, setFilterStatus] = React.useState("new")

    const timeFrameList = [
        {
            label: "Month",
            value: "month"
        },
        {
            label: "Week",
            value: "week"
        },
        {
            label: "Day",
            value: "day"
        },
    ]

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const { goalRequest } = useSelector(state => state.goals)

    const handleClick = (event, data) => {
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menteeGoalsColumn = [
        ...mentorMenteeGoalsColumn,
        {
            field: 'performance',
            headerName: 'Performance',
            id: 2,
            flex: 1,
            renderCell: (params) => {
                return <>
                    <div className='relative' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%', width: '70%' }}>
                        <div style={{
                            background: '#FFD41B', width: '67%', borderRadius: '30px', height: '30px', top: '20%',
                            position: 'absolute'
                        }}>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#18283D', height: '30px' }}>50%</div>
                        </div>
                        <div style={{
                            background: 'rgba(217, 217, 217, 1)', width: '100%', borderRadius: '30px', height: '30px'
                        }}></div>
                    </div>
                </>
            }
        },
        {
            field: 'goal_status',
            headerName: 'Status',
            id: 2,
            flex: 1,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>

                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: goalStatusColor[params.row.goal_status]?.bg, lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: goalStatusColor[params.row.goal_status]?.color,
                                fontSize: '12px'
                            }}>
                            {goalDataStatus[params.row.goal_status]}
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
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e, params.row)}>
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
                            navigate(`/mentor-view-mentee-goal/${seletedItem.id}`);
                        }
                        } className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View
                        </MenuItem>

                    </Menu>
                </>
            }


        },
    ]

    const getGoalList = (time_frame = timeFrame, status = filterStatus) => {
        dispatch(getGoalsRequest({
            status: status,
            created_by: "mentee",
            time_frame: time_frame,
            page: paginationModel?.page + 1,
            limit: paginationModel?.pageSize
        }))
    }

    const handleFilterMenteeGoals = (value) => {
        // dispatch(getMenteeGoals(value))
        setFilterStatus(value)
        getGoalList(timeFrame, value)
    }

    const handleTimeFrame = (value) => {
        setTimeFrame(value)
        getGoalList(value, filterStatus)
    }

    useEffect(() => {
        getGoalList()
    }, [])

    return (
        <div className='goals-container'>
            <div className='title-container flex justify-between items-center'>
                <div className='flex gap-5 items-center '>
                    <p className='text-[18px] font-semibold'>Mentee Goals</p>
                </div>
                <div className='flex gap-8 items-center'>
                    <div className="relative flex gap-3 py-3 px-4"
                        style={{ border: '1px solid rgba(24, 40, 61, 0.25)', background: 'rgba(238, 245, 255, 1)', borderRadius: '3px' }}>
                        <img src={CalenderIcon} alt="CalenderIcon" />
                        <select className='focus:outline-none' style={{ background: 'rgba(238, 245, 255, 1)' }}
                            value={timeFrame}
                            onChange={(e) => handleTimeFrame(e.target.value)}>
                            {
                                timeFrameList?.map((e) => {
                                    return (
                                        <option value={e?.value}>{e?.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <select className='table-select' onChange={(e) => handleFilterMenteeGoals(e.target.value)}
                        value={filterStatus}>
                        <option value="new">Total Goals</option>
                        <option value="active">Active Goals</option>
                        <option value="ongoing">Goals in progress</option>
                        <option value="completed">Completed Goals</option>
                        <option value="aborted">Aborted Goals</option>
                    </select>
                </div>

            </div>
            <div className='py-8 px-6'>
                <DataTable rows={goalRequest?.results} columns={menteeGoalsColumn}
                    rowCount={goalRequest?.count}
                    paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
            </div>

        </div>
    )
}
