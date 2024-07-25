import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import { Backdrop, CircularProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useSearchParams } from 'react-router-dom';

import DataTable from '../../shared/DataGrid';
import MoreIcon from '../../assets/icons/moreIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import DeleteIcon from '../../assets/images/delete1x.png'
import AddGoalIcon from '../../assets/icons/addGoal.svg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import OverDeleteIcon from '../../assets/images/delete_1x.png'
import CancelIcon from '../../assets/images/cancel1x.png'
import EditIcon from '../../assets/images/Edit1x.png'
import { goalsColumns, goalsRow } from '../../mock';
import RecentActivities from '../Dashboard/RecentActivities';
import CreateGoal from './CreateGoal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGoalInfo, getAllGoals, getGoalInfo, getGoalsCount, updateGoalStatus } from '../../services/goalsInfo';
import './goal.css'
import { goalPeriods, goalStatus } from '../../utils/constant';
import MuiModal from '../../shared/Modal';


const Goals = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [requestTab, setRequestTab] = useState('mentor-goals')
    const [activeGoalList, setActiveGoalList] = useState('total_goals')
    const [actionModal, setActionModal] = useState(false)
    const [dateFormat, setDateFormat] = useState({})
    const [goals, setGoals] = useState([])
    const [seletedItem, setSelectedItem] = useState({})
    const [popupModal, setPopupModal] = useState('')

    const { goalsList, loading, status, error, createdGoal, goalsCount } = useSelector(state => state.goals)

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
            key: 'total_goals',
        },
        {
            name: 'Active Goals',
            key: 'active',
        },
        {
            name: 'Goals in Progress',
            key: 'ongoing',
        },
        {
            name: 'Completed Goals',
            key: 'completed',
        },
        {
            name: 'Cancel Goals',
            key: 'aborted',
        }
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event, data) => {
        console.log('ggggggg', data)
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };

    const handleDeleteGoal = () => {
        dispatch(deleteGoalInfo(seletedItem.id))
    }

    const handleDelete = () => {
        handleClose()
        setDeleteModal(true)
    }

    const handlEditGoal = () => {
        setActionModal(true)
    }

    useEffect(() => {
        dispatch(getGoalsCount())
        navigate('/goals?type=active')
    }, [])


    useEffect(() => {
        console.log('searchParams', searchParams)
        const filterType = searchParams.get("type");

        let query = ''

        if (filterType && filterType !== '') {
            query = filterType
        }


        dispatch(getAllGoals(query));


    }, [searchParams])

    useEffect(() => {
        if (status === goalStatus.delete) {
            setPopupModal('Deleted')
            setDeleteModal(false)
            dispatch(getAllGoals())
            setTimeout(() => {
                setPopupModal('')
            }, [3000])
        }
    }, [status])

    const goalColumn = [
        ...goalsColumns,
        {
            field: 'period',
            headerName: 'Period',
            width: 330,
            id: 2,
            renderCell: (params) => {
                return <div>{goalPeriods.find(goalPeriod => parseInt(goalPeriod.value) === parseInt(params.row.period))?.name}</div>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 350,
            id: 4,
            renderCell: (params) => {
                console.log('params', params)
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
                        {
                            params.row.goal_status === 'active' &&
                            <MenuItem onClick={handlEditGoal} className='!text-[12px]'>
                                <img src={EditIcon} alt="EditIcon" className='pr-3 w-[27px]' />
                                Edit
                            </MenuItem>
                        }

                        <MenuItem onClick={(e) => {
                            navigate(`/view-goal/${seletedItem.id}`);
                        }
                        } className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View
                        </MenuItem>

                        {
                            params.row.goal_status !== 'completed' &&
                            <MenuItem onClick={handleDelete} className='!text-[12px]'>
                                <img src={DeleteIcon} alt="DeleteIcon" className='pr-3 w-[27px]' />
                                Delete
                            </MenuItem>
                        }


                    </Menu>
                </>
            }


        },
    ]

    const title = goalsListMenu.find(option => option.key === searchParams.get("type"))?.name || ''

    const handleTab = (key) => {
        setRequestTab(key)
    }

    const handleSelectedRow = (row) => {
        setSelectedRows(row)
        console.log('selected', row)
    }

    const handleCloseModal = () => {
        setActionModal(false)
    }


    useEffect(() => {
        if (Object.keys(createdGoal).length && status === goalStatus.create) {
            dispatch(updateGoalStatus({ id: parseInt(createdGoal.goal_id), action: 'active' }))
        }

        if (Object.keys(createdGoal).length && status === goalStatus.statusupdate) {
            setActionModal(false);
            setPopupModal('Created')
            setTimeout(() => {
                setPopupModal('')
            }, [3000])
            dispatch(getAllGoals())
        }

    }, [status])


    useEffect(() => {
        setGoals(goalsList)
    }, [goalsList])


    return (
        <div className="goals px-9 py-9">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />

            </Backdrop>

            <MuiModal modalOpen={popupModal !== ''} modalClose={() => setPopupModal('')} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Goal {popupModal} Successfully</p>
                    </div>

                </div>
            </MuiModal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={deleteModal}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">

                    <div style={{ border: '1px solid rgba(229, 0, 39, 1)', borderRadius: '15px' }} className='relative flex flex-col gap-2 justify-center 
                        items-center py-14 px-16'>

                        <img className='absolute top-2 right-3 cursor-pointer' onClick={() => setDeleteModal(false)}
                            src={CancelIcon} alt="CancelIcon" />

                        <img className='w-[50px]' src={OverDeleteIcon} alt="OverDeleteIcon" />


                        <div className='py-5 mb-3'>
                            <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>
                                Are you sure want to delete this goal?</p>
                        </div>
                        <div className='flex justify-center'>
                            <div className="flex gap-6 justify-center align-middle">
                                <button style={{
                                    background: 'rgba(229, 0, 39, 1)', color: '#fff', borderRadius: '3px',
                                    width: '130px', padding: '13px'
                                }}
                                    onClick={() => setDeleteModal(false)} >
                                    No
                                </button>
                                <button style={{
                                    border: '1px solid rgba(229, 0, 39, 1)', color: 'rgba(229, 0, 39, 1)', borderRadius: '3px',
                                    width: '130px', padding: '13px'
                                }}
                                    onClick={handleDeleteGoal} >
                                    Yes
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

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
                                        <div className={`goal-counts-container ${searchParams.get("type") === goal.key ? 'active' : ''}`} key={goal.key}
                                            onClick={() => { navigate('/goals?type=' + goal.key) }}
                                        >
                                            <p>{goal.name}</p>
                                            <p className='goal-count'>{goalsCount[goal.key]}</p>
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

                    <CreateGoal open={actionModal} handleCloseModal={handleCloseModal} editMode={Object.keys(seletedItem).length} seletedItem={seletedItem} />
                </div>
            </div>

        </div>
    )
}

export default Goals

