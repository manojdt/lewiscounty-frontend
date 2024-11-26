import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { getMyMentors, getMyReqMentors, getMyTopMentors, menteeFollowReq, menteeUnFollowReq, updateUserList } from '../../services/userList';
import { myMentorColumns } from '../../utils/formFields';
import { Backdrop, CircularProgress } from '@mui/material';
import { Button } from '../../shared';
import ConnectIcon from '../../assets/images/Connectpop1x.png'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { followBtnText, requestStatusColor, requestStatusText } from '../../utils/constant';

export const Mentors = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchParams] = useSearchParams();
    const mentortype = searchParams.get("type")

    const { mentorList, loading, status } = useSelector(state => state.userList)


    const [mentorType, setMentorType] = useState(mentortype ?? 'mymentor')
    const [requestTab, setRequestTab] = useState('all-request')
    const [selectedItem, setSelectedItem] = useState({})
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
    });
    const [search, setSearch] = React.useState("")
    const [followPopup, setFollowPopup] = React.useState({
        bool: false,
        data: {},
        type: ""
    })
    const [createMeetingLoading, setCreateMeetingLoading] = React.useState({
        bool: false,
        type: ""
    })

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
            name: 'Approve Request',
            key: 'accept-request'
        },
        {
            name: 'Reject Request',
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
                return <div className='flex gap-2 items-center'> <img src={StarIcon} alt="StarIcon" />{params?.row?.average_rating === 0 ? 3 : params?.row?.average_rating}</div>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 6,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(event) => {
                        handleClick(event, params.row)
                    }}>
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
                        <MenuItem onClick={() => {
                            selectedItem?.is_follow !== "waiting" &&
                                handleOpenFollowPopup(selectedItem.id, selectedItem?.is_follow)
                        }} className='!text-[12px]'>
                            <img src={FollowIcon} alt="FollowIcon" className='pr-3 w-[27px]' />
                            {followBtnText[selectedItem?.is_follow]}
                        </MenuItem>
                    </Menu>
                </>
            }


        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            id: 2,
            hide: mentorType !== "mymentor",

            renderCell: (params) => {
                return (
                    <>
                        <div className="cursor-pointer flex items-center h-full relative">
                            <span
                                className="w-[80px] flex justify-center h-[30px] px-3"
                                style={{
                                    background: requestStatusColor[params.row.status]?.bgColor || '', lineHeight: '30px',
                                    borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                    fontSize: '12px'
                                }}
                            >
                                {" "}
                                {requestStatusText[params.row.status]}
                            </span>
                        </div>
                    </>
                );
            },
        }
    ]


    const title = mentorOption.find(option => option.value === mentorType)?.name || ''

    const handleTab = (key) => setRequestTab(key)

    const getMentorDatas = (type = mentorType) => {
        if (type === "topmentor") {
            dispatch(getMyTopMentors(paginationModel))
        } else if (type === "requestmentor") {
            dispatch(getMyReqMentors(paginationModel))
        } else {
            dispatch(getMyMentors(paginationModel))
        }
    }

    useEffect(() => {
        getMentorDatas()
    }, [paginationModel])

    useEffect(() => {
        if (status === "done") {
            setCreateMeetingLoading({
                ...createMeetingLoading,
                bool: true
            })
            setTimeout(() => {
                setCreateMeetingLoading({
                    bool: false,
                    type: ""
                })
                dispatch(updateUserList({ status: '' }))
                getMentorDatas("topmentor")
                setMentorType("topmentor")
                setFollowPopup({
                    bool: false,
                    id: "",
                    type: ""
                })
            }, [2000])
        }
    }, [status])

    const handleMentorTypeChange = (value) => {
        setMentorType(value)
        getMentorDatas(value)
        setPaginationModel({
            page: 0,
            pageSize: 10
        })
    }

    const handleSearch = (value) => {
        setSearch(value)
        if (mentorType === "topmentor") {
            dispatch(getMyTopMentors({ ...paginationModel, search: value }))
        } else if (mentorType === "requestmentor") {
            dispatch(getMyReqMentors({ ...paginationModel, search: value }))
        } else {
            dispatch(getMyMentors({ ...paginationModel, search: value }))
        }
    }

    const handleOpenFollowPopup = (id, type) => {
        handleClose()
        setFollowPopup({
            bool: true,
            id: id,
            type: type
        })
        setCreateMeetingLoading({
            ...createMeetingLoading,
            type: type
        })
    }
    const handleCloseFollowPopup = () => {
        setFollowPopup({
            bool: false,
            data: "",
        })
    }

    const handleSubmitBtn = (id) => {
        if (followPopup?.type === "accepted") {
            handleUnFollowMentor(id)
        } else {
            handleFollowMentor(id)
        }
    }

    const handleFollowMentor = async (id) => {
        const payload = {
            user_id: id
        }
        await dispatch(menteeFollowReq(payload))
        setFollowPopup({
            bool: false,
            id: "",
        })
    }

    const handleUnFollowMentor = (id) => {
        const payload = {
            user_id: id
        }

        dispatch(menteeUnFollowReq(payload))
        setFollowPopup({
            bool: false,
            id: ""
        })
    }

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
                                }}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt='SearchIcon' />
                            </div>
                        </div>
                        <Dropdown
                            label={'My Mentors'}
                            options={mentorOption}
                            value={mentorType}
                            handleDropdown={(event) => handleMentorTypeChange(event.target.value)}
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

                    <DataTable rows={mentorList?.results} columns={mentorColumn} hideCheckbox
                        rowCount={mentorList?.count}
                        paginationModel={paginationModel} setPaginationModel={setPaginationModel} />

                </div>
            </div>

            {/* Follow Request Popup */}

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={followPopup?.bool}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={ConnectIcon} alt="ConnectIcon" />
                    <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>
                        {/* {followInfo.is_following ? 'UnFollow' : 'Follow'} */}
                        {followPopup?.type === "accepted" ? "Unfollow" : "Follow"}
                        {/* Follow */}
                    </span>

                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>Are you sure you want to
                            <span> {followPopup?.type === "accepted" ? "unfollow" : "follow"} </span>
                            Mentor?</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnName='Cancel' btnCategory="secondary" onClick={() => handleCloseFollowPopup()} />
                            <Button btnType="button" btnCls="w-[110px]" btnName={followPopup?.type === "accepted" ? "Unfollow" : "Follow"}
                                btnCategory="primary"
                                onClick={() => handleSubmitBtn(followPopup?.id)}
                            />
                        </div>
                    </div>
                </div>

            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={createMeetingLoading?.bool}
                onClick={() => setCreateMeetingLoading(false)}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>{createMeetingLoading?.type === "accepted" ? "Unfollow is Successfully" : "Connect is Successfully"}</p>
                    </div>

                </div>
            </Backdrop>
        </div>
    )
}

