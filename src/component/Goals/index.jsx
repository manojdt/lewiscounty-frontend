import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import { Backdrop, CircularProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

import DataTable from '../../shared/DataGrid';
import MoreIcon from '../../assets/icons/moreIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import DeleteIcon from '../../assets/images/delete1x.png'
import AddGoalIcon from '../../assets/icons/addGoal.svg'
import { goalsColumns, goalsRow } from '../../mock';
import RecentActivities from '../Dashboard/RecentActivities';
import CreateGoal from './CreateGoal';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGoals } from '../../services/goalsInfo';
import './goal.css'
import { goalStatus } from '../../utils/constant';


const Goals = () => {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [requestTab, setRequestTab] = useState('mentor-goals')
    const [activeGoalList, setActiveGoalList] = useState('total_goal')
    const [actionModal, setActionModal] = useState(false)
    const [dateFormat, setDateFormat] = useState({})
    const [goals, setGoals] = useState([])

    const { goalsList, loading, status, error } = useSelector(state => state.goals)

    const dispatch = useDispatch()

    const requestBtns = [
        {
            name: 'Mentor Goals',
            key: 'mentor-goals'
        },
        {
            name: 'Mentee Goals',
            key: 'mentee-goals'
        }
    ]

    const goalsListMenu = [
        {
            name: 'Total Goals',
            key: 'total_goal',
            count: 39
        },
        {
            name: 'Active Goals',
            key: 'active_goal',
            count: 23
        },
        {
            name: 'Goals in Progress',
            key: 'inprogress_goal',
            count: '04'
        },
        {
            name: 'Completed Goals',
            key: 'completed_goal',
            count: '09'
        },
        {
            name: 'Cancel Goals',
            key: 'cancel_goal',
            count: '02'
        }
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const goalColumn = [
        ...goalsColumns,
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            id: 4,
            renderCell: (params) => {
                console.log('params', params)
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={handleClick}>
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
                        <MenuItem onClick={() => navigate('/view-report/1')} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                        <MenuItem onClick={() => console.log('delete', params)} className='!text-[12px]'>
                            <img src={DeleteIcon} alt="DeleteIcon" className='pr-3 w-[27px]' />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            }


        },
    ]

    const title = goalsListMenu.find(option => option.key === activeGoalList)?.name || ''

    const handleTab = (key) => setRequestTab(key)

    const handleSelectedRow = (row) => {
        setSelectedRows(row)
        console.log('selected', row)
    }

    const handleDeleteSelectedRows = () => {
        setDeleteModal(true)
    }

    const handleCloseModal = () => {
        setActionModal(false)
    }

    useEffect(() => {
        if (!goalsList.length) {
            dispatch(getAllGoals())
        }
    }, [])

    useEffect(() => {
        if(status === goalStatus.create){
            setActionModal(false);
            dispatch(getAllGoals())
        }
    },[status])

    useEffect(() => {
        setGoals(goalsList)
    },[goalsList])


    return (
        <div className="goals px-9 py-9">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />

            </Backdrop>

            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Goals</p>
                    </div>

                </div>

                <div className='mx-5'>

                    <div className='flex gap-7 mb-9 py-5'>
                        {
                            requestBtns.map((actionBtn, index) =>
                                <button key={index} className='px-5 py-4 text-[14px]' style={{
                                    background: requestTab === actionBtn.key ? 'linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)' :
                                        '#fff',
                                    border: requestTab !== actionBtn.key ? '1px solid rgba(136, 178, 232, 1)' : 'none',
                                    color: requestTab === actionBtn.key ? '#fff' : '#000',
                                    borderRadius: '30px',
                                    width: '180px'
                                }}
                                    onClick={() => handleTab(actionBtn.key)}
                                >{actionBtn.name}</button>
                            )
                        }
                    </div>

                    <div className='goals-container'>
                        <div className='title-container flex justify-between items-center'>
                            <div className='flex gap-5 items-center '>
                                <p className='text-[18px] font-semibold'>{title}</p>
                            </div>
                            <div className='flex gap-8 items-center'>
                                <div className="relative flex gap-3 py-3 px-3" style={{ border: '1px solid rgba(24, 40, 61, 0.25)' }}>
                                    <img src={CalenderIcon} alt="CalenderIcon" />
                                    <select className='focus:outline-none'>
                                        <option>Month</option>
                                        <option>Week</option>
                                        <option>Day</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='goals-info'>
                            <div className='goals-list flex items-center gap-4'>
                                {
                                    goalsListMenu.map(goal =>
                                        <div className={`goal-counts-container ${activeGoalList === goal.key ? 'active' : ''}`} key={goal.key}
                                            onClick={() => setActiveGoalList(goal.key)}
                                        >
                                            <p>{goal.name}</p>
                                            <p className='goal-count'>{goal.count}</p>
                                        </div>
                                    )
                                }
                                <div className="create-goal flex justify-center items-center flex-col gap-4"
                                    onClick={() => setActionModal(true)}
                                >
                                    <p>Create New Goal</p>
                                    <img src={AddGoalIcon} alt="AddGoalIcon" />
                                </div>
                            </div>



                            <div className="grid grid-cols-4 gap-7 py-5">
                                <div className="col-span-3">
                                    <div style={{ border: '1px solid rgba(29, 91, 191, 1)', padding: '10px 30px 20px' }}>
                                        <div className='px-2 py-5'>
                                            {title}
                                        </div>
                                        <DataTable rows={goals} columns={goalColumn} handleSelectedRow={handleSelectedRow} />
                                    </div>
                                </div>

                                <div>
                                    <RecentActivities />
                                </div>

                            </div>
                        </div>



                    </div>

                    <CreateGoal open={actionModal} handleCloseModal={handleCloseModal} />
                </div>
            </div>

        </div>
    )
}

export default Goals

