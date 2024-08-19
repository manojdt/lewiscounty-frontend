import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import DataTable from '../../shared/DataGrid';
import FilterIcon from '../../assets/icons/Filter.svg';
import StarIcon from '../../assets/icons/filledStar.svg'
import MoreIcon from '../../assets/icons/moreIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import SearchIcon from '../../assets/images/search1x.png'
import ReportIcon from '../../assets/icons/report.svg'
import FollowIcon from '../../assets/images/connect1x.png'

import Dropdown from '../../shared/Dropdown';
import { mentorColumns, mentorRows } from '../../mock';
import { getMyMentors } from '../../services/userList';
import { myMentorColumns } from '../../utils/formFields';
import { Backdrop, CircularProgress } from '@mui/material';


export const Mentors = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null);

    const { mentorList, loading } = useSelector(state => state.userList)

    const [mentorType, setMentorType] = useState('mymentor')
    const [requestTab, setRequestTab] = useState('all-request')
    const [selectedItem, setSelectedItem] = useState({})

    const mentorOption = [
        {
            name: 'My Mentor',
            value: 'mymentor'
        },
        {
            name: 'Top Mentors',
            value: 'topmentor'
        },
        {
            name: 'Request  Mentors',
            value: 'requestmentor'
        },
    ]

    const requestBtns = [
        {
            name: 'All Request',
            key: 'all-request'
        },
        {
            name: 'Pending Request',
            key: 'pending-request'
        },
        {
            name: 'Accept Request',
            key: 'accept-request'
        },
        {
            name: 'Cancel Request',
            key: 'cancel-request'
        },
    ]

    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event, row) => {
        setSelectedItem(row)
        setAnchorEl(event.currentTarget);
    };

    const mentorColumn = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            id: 0,
            renderCell: (params) => {
                return <div className='flex gap-2 items-center'>{params.row.first_name}{' '} {params.row.last_name}</div>
            }
        },
        ...myMentorColumns,
        {
            field: 'ratings',
            headerName: 'Ratings',
            flex: 1,
            id: 5,
            renderCell: (params) => {
                return <div className='flex gap-2 items-center'> <img src={StarIcon} alt="StarIcon" /> 4.5</div>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 6,
            renderCell: (params) => {
                console.log('params', params)
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(event) => handleClick(event, params.row)}>
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
                        <MenuItem onClick={() => navigate(`/mentor-details/${selectedItem.id}`)} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                        <MenuItem onClick={() => console.log('report', params)} className='!text-[12px]'>
                            <img src={FollowIcon} alt="FollowIcon" className='pr-3 w-[27px]' />
                            Follow
                        </MenuItem>
                    </Menu>
                </>
            }


        },
    ]

    const title = mentorOption.find(option => option.value === mentorType)?.name || ''

    const handleTab = (key) => setRequestTab(key)

    useEffect(() => {
        dispatch(getMyMentors())
    }, [])

    return (
        <div className="px-9 py-9">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center '>
                        <p>{title}</p>
                        <p><img src={FilterIcon} alt="FilterIcon" /></p>
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
                        <Dropdown
                            label={'My Mentors'}
                            options={mentorOption}
                            value={mentorType}
                            handleDropdown={(event) => setMentorType(event.target.value)}
                        />
                    </div>
                </div>
                <div className='mx-5'>
                    {
                        mentorType === 'requestmentor' &&
                        <div className='flex gap-3 mb-6'>
                            {
                                requestBtns.map((actionBtn, index) =>
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
                    }

                    <DataTable rows={mentorList} columns={mentorColumn} hideCheckbox />

                </div>
            </div>
        </div>
    )
}

