import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Menu, MenuItem } from '@mui/material';

import SearchIcon from '../../assets/icons/search.svg';
import DownloadIcon from '../../assets/icons/Document.svg';
import { Button } from '../../shared';
import DataTable from '../../shared/DataGrid';
import ViewIcon from '../../assets/images/view1x.png'
import MoreIcon from '../../assets/icons/moreIcon.svg'

import { certificateColumns } from '../../utils/tableFields';
import { useNavigate } from 'react-router-dom';
import { getCertificateList, getCertificates } from '../../services/certificate';
import { certificateColor, certificateText, requestStatusColor, requestStatusText } from '../../utils/constant';


export default function Certificate() {
    const navigate = useNavigate()
    const [actionTab, setActiveTab] = useState('waiting')
    const [requestTab, setRequestTab] = useState('all')
    const userInfo = useSelector(state => state.userInfo)
    const { certificatesList, loading } = useSelector(state => state.certificates)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [seletedItem, setSelectedItem] = useState({})
    console.log(certificatesList, "cer")
    const role = userInfo.data.role
    const dispatch = useDispatch()
    const handleSearch = (value) => {
        dispatch(getCertificateList(value))
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCeritificateDownload = () => {

    }
    const handleMoreClick = (event, data) => {
        console.log('more')
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };
    const certificateRequestTab = [
        {
            name: 'Waiting For Response',
            key: 'waiting'
        },
        {
            name: 'Pending Certificates',
            key: 'pending'
        },
        {
            name: 'Generate Certificates',
            key: 'generate'
        }
    ]

    let certificateColumn = [
        ...certificateColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                console.log('paramsppppp', params)
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-3'
                            style={{
                                background: requestStatusColor[params.row.status]?.bg || '', lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: requestStatusColor[params.row.status]?.color || '',
                                fontSize: '12px'
                            }}
                        > {requestStatusText[params.row.status]}</span>
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
                console.log('params', params)
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

                        {/* <MenuItem onClick={() => navigate(`/view-report/${seletedItem.id}`)} className='!text-[12px]'>
                                <img src={TickCircle} alt="AcceptIcon" className='pr-3 w-[27px]' />
                                View
                            </MenuItem> */}


                        <MenuItem onClick={handleCeritificateDownload} className='!text-[12px]'>
                            <img src={DownloadIcon} alt="AcceptIcon" className='pr-3 w-[27px]' />
                            Download
                        </MenuItem>



                    </Menu>
                </>
            }

        },
    ]

    const handleTab = (key) => {
        setRequestTab(key)
    }

    const requestBtns = [
        {
            name: 'My Certificates',
            key: 'all'
        },
        {
            name: 'Approve Certificates',
            key: 'pending'
        }
    ]

    const mentorFields = ['pass', 'fail']

    if (role === 'admin') {
        certificateColumn = certificateColumn.filter(column => !mentorFields.includes(column.field))
    }


    useEffect(() => {
        dispatch(getCertificateList(role === "admin" ? requestTab : role === "mentor" ? actionTab : "generate"))
        // dispatch(getCertificates({search: role === "admin" ? requestTab : actionTab}))
    }, [requestTab, actionTab])
    return (
        <div className="program-request px-8 mt-10">

            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={false}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[18px] font-semibold'>
                        <p>Generate Certificates Request</p>
                    </div>

                    <div className='flex gap-5'>
                        <div className="relative">
                            <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                placeholder="Search here..." style={{
                                    border: '1px solid rgba(29, 91, 191, 1)',
                                    borderRadius: '1px',
                                    height: '45px',
                                    width: '280px'
                                }}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt='SearchIcon' />
                            </div>
                        </div>

                        <Button btnName="Create Certificate" onClick={() => navigate('/create-certificate')} />
                    </div>

                </div>


                <div className='mx-4' style={{ border: '1px solid #D9E4F2', borderRadius: '3px' }}>
                    <div className='px-6 py-7 program-info'>


                        {
                            role === 'admin' ?


                                <>
                                    <div className='flex gap-7 mb-6'>
                                        {
                                            requestBtns.map((actionBtn, index) =>
                                                <button key={index} className='px-5 py-4 text-[14px]' style={{
                                                    background: requestTab === actionBtn.key ? 'linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)' :
                                                        '#fff',
                                                    border: requestTab !== actionBtn.key ? '1px solid rgba(136, 178, 232, 1)' : 'none',
                                                    color: requestTab === actionBtn.key ? '#fff' : '#000',
                                                    borderRadius: '3px',
                                                    width: '180px'
                                                }}
                                                    onClick={() => handleTab(actionBtn.key)}
                                                >{actionBtn.name}</button>
                                            )
                                        }
                                    </div>
                                </>

                                :
                                role === 'mentor' ?
                                    <>
                                        {
                                            certificateRequestTab.length > 0 &&
                                            <div className='flex justify-between px-5 mb-8 items-center border-b-2 '>
                                                <ul className='tab-list'>
                                                    {
                                                        certificateRequestTab.map((request, index) =>
                                                            <li className={`${actionTab === request.key ? 'active' : ''} relative`} key={index}
                                                                onClick={() => setActiveTab(request.key)}
                                                            >
                                                                <div className='flex justify-center pb-1'>
                                                                    <div className={`total-proram-count relative ${actionTab === request.key ? 'active' : ''}`}>10

                                                                        <p className='notify-icon'></p>
                                                                    </div>
                                                                </div>
                                                                <div className='text-[13px]'> {`${request.name}`}</div>
                                                                {actionTab === request.key && <span></span>}
                                                            </li>)
                                                    }
                                                </ul>
                                            </div>


                                        }
                                    </>

                                    : null
                        }



                        <DataTable rows={certificatesList || []} columns={certificateColumn} hideFooter />
                    </div>
                </div>
            </div>


        </div>
    )
}