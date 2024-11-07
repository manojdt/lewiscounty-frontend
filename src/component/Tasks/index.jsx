import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import DataTable from '../../shared/DataGrid';

import MoreIcon from '../../assets/icons/moreIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import SearchIcon from '../../assets/images/search1x.png'
import RequestIcon from '../../assets/images/Requesttask1x.png'
import CancelIcon from '../../assets/images/cancel-colour1x.png'

import { taskColumns } from '../../mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MuiModal from '../../shared/Modal';
import { Button } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../../services/task';
import { Backdrop, CircularProgress } from '@mui/material';
import { pipeUrls, taskStatusColor, taskStatusText } from '../../utils/constant';

export const Tasks = () => {
    const [requestTab, setRequestTab] = useState('all')
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTask, setSearchTask] = useState('')
    const open = Boolean(anchorEl);
    const [searchParams] = useSearchParams();
    const [requestTask, setRequestTask] = useState(false)
    const [seletedItem, setSelectedItem] = useState({})
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { taskList, loading } = useSelector(state => state.tasks)


    const taskMenuList = [
        {
            name: 'All Task',
            key: 'all'
        },
        {
            name: 'New Task',
            key: 'newtask'
        },
        {
            name: 'Completed Task',
            key: 'completed'
        },
        {
            name: 'Pending Task',
            key: 'pending'
        },
        {
            name: 'Waiting Task',
            key: 'waiting_for_approval'
        },
        {
            name: 'Rejected Task',
            key: 'rejected'
        },
        {
            name: 'Draft',
            key: 'draft'
        },
    ]

    const list = [...taskColumns].map(column => {
        if (column.field === 'status') {
            return {
                ...column,
                renderCell: (params) => {
                    return <>
                        <div className='cursor-pointer flex items-center h-full relative'>
                            <span className='w-[80px] flex justify-center h-[30px] px-3'
                                style={{
                                    background: taskStatusColor[params.row.status]?.bg || '', lineHeight: '30px',
                                    borderRadius: '3px', width: '110px', height: '34px', color: taskStatusColor[params.row.status]?.color || '',
                                    fontSize: '12px'
                                }}
                            > {taskStatusText[params.row.status]}</span>
                        </div>
                    </>
                }
            }
        }
        return column
    })


    const mentorColumn = [
        ...list,
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
                        <MenuItem onClick={() => navigate(`/mentee-tasks-details/${seletedItem.id}`)} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                        {/* <MenuItem onClick={() => { setAnchorEl(null); setRequestTask(true) }} className='!text-[12px]'>
                            <img src={RequestIcon} alt="RequestIcon" className='pr-3 w-[27px]' />
                            Request Task
                        </MenuItem> */}
                    </Menu>
                </>
            }
        },
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event, data) => {
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };

    const handleTab = (key) => {
        let typeString = `?type=${key}`
        if (key === 'all') {
            typeString = ''
        }
        navigate(`${pipeUrls.menteetask}${typeString}`)
        setRequestTab(key)
    }



    const handleTaskSearch = (value) => {
        setSearchTask(value)
    }

    useEffect(() => {
        dispatch(getAllTasks({ search: searchTask }))
    }, [searchTask])


    useEffect(() => {
        const filterType = searchParams.get("type");

        let query = {}
        if (filterType && filterType !== '') {
            query = { status: filterType }
        }
        dispatch(getAllTasks(query));
    }, [searchParams])


    return (
        <div className="px-9 py-9">

            <MuiModal modalSize='lg' modalOpen={requestTask} modalClose={() => { setRequestTask(false) }} noheader>
                <div className='px-5 py-5'>
                    <div className='flex justify-center flex-col gap-5  mt-4 mb-4'
                        style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px', }}>
                        <div className='flex justify-between px-3 py-4 items-center' style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}>
                            <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>Request Task </p>
                            <img className='cursor-pointer' onClick={() => setRequestTask(false)} src={CancelIcon} alt="CancelIcon" />
                        </div>

                        <div className='px-5'>
                            <div className='relative pb-8'>
                                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Request Title
                                </label>

                                <div className='relative'>
                                    <input
                                        type="text"
                                        className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                            focus-visible:outline-none text-[14px] h-[60px]"
                                        placeholder={''}
                                        style={{
                                            color: "#232323",
                                            borderRadius: '3px'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className='relative pb-8'>
                                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Comments
                                </label>

                                <div className='relative'>
                                    <textarea id="message" rows="4" className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                   focus-visible:outline-none focus-visible:border-none`}
                                        placeholder={''}
                                    ></textarea>
                                </div>
                            </div>

                            <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                                <Button btnName='Cancel' btnCls="w-[18%]" btnCategory="secondary" onClick={() => setRequestTask(false)} />
                                <button onClick={() => setRequestTask(false)}
                                    className='text-white py-3 px-7 w-[18%]'
                                    style={{ background: 'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)', borderRadius: '3px' }}>Submit to Mentor</button>
                            </div>

                        </div>

                    </div>

                </div>
            </MuiModal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />

            </Backdrop>



            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[20px]'>
                        <p>Task</p>
                    </div>
                    <div className='flex gap-8 items-center'>
                        <div className="relative">
                            <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                placeholder="Search here..." style={{
                                    border: '1px solid rgba(29, 91, 191, 1)',
                                    height: '41px',
                                    width: '345px'
                                }}
                                value={searchTask}
                                onChange={(e) => handleTaskSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt='SearchIcon' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-5'>
                    <div className='flex gap-3 mb-6'>
                        {
                            taskMenuList.map((actionBtn, index) =>
                                <button key={index} className='px-5 py-4 text-[14px]' style={{
                                    background: requestTab === actionBtn.key ? 'linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)' :
                                        'rgba(249, 249, 249, 1)',
                                    color: requestTab === actionBtn.key ? '#fff' : '#000',
                                    borderRadius: '3px'
                                }}
                                    onClick={() => handleTab(actionBtn.key)}
                                >{actionBtn.name}</button>
                            )
                        }
                    </div>

                    {
                        !loading &&
                        <DataTable rows={taskList} columns={mentorColumn} hideCheckbox />
                    }
                </div>
            </div>


        </div>
    )
}

