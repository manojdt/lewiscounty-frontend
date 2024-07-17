import React, { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import DataTable from '../../shared/DataGrid';

import MoreIcon from '../../assets/icons/moreIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import SearchIcon from '../../assets/images/search1x.png'
import RequestIcon from '../../assets/images/Requesttask1x.png'

import ReportIcon from '../../assets/icons/report.svg'

import { taskColumns, taskRows } from '../../mock';
import { useNavigate } from 'react-router-dom';

export const Tasks = () => {
    const [requestTab, setRequestTab] = useState('all-task')
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    
    const taskList = [
        {
            name: 'All Task',
            key: 'all-task'
        },
        {
            name: 'New Task',
            key: 'new-task'
        },
        {
            name: 'Completed Task',
            key: 'completed-task'
        },
        {
            name: 'Pending Task',
            key: 'pending-task'
        },
        {
            name: 'Rejected Task',
            key: 'rejected-task'
        },
        {
            name: 'Draft',
            key: 'draft'
        },
    ]

    const list = [...taskColumns].map(column => {
        if(column.field === 'status'){
            return {
                ...column,
                renderCell: (params) => {
                    console.log('paramsppppp', params)  
                    return <>
                        <div className='cursor-pointer flex items-center h-full relative'>
                           <span className='w-[80px] flex justify-center h-[30px] px-3' 
                            style={{background:'rgba(235, 255, 243, 1)', lineHeight: '30px', borderRadius: '3px'}}> {params.row.status}</span>
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
            width: 100,
            id: 4,
            renderCell: (params) => {
                console.log('paramsmmmmm', params)
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
                        <MenuItem onClick={() => navigate(`/tasks-details/1`)} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                        <MenuItem onClick={() => console.log('report', params)} className='!text-[12px]'>
                            <img src={RequestIcon} alt="RequestIcon" className='pr-3 w-[27px]' />
                            Request Task
                        </MenuItem>
                    </Menu>
                </>
            }
        },
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleTab = (key) => setRequestTab(key)

    return (
        <div className="px-9 py-9">
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
                                }} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt='SearchIcon' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-5'>
                    <div className='flex gap-3 mb-6'>
                        {
                            taskList.map((actionBtn, index) =>
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

                    <DataTable rows={taskRows} columns={mentorColumn} hideCheckbox />
                </div>
            </div>
        </div>
    )
}

