import React, { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import { Backdrop, CircularProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useSearchParams } from 'react-router-dom';

import DataTable from '../../shared/DataGrid';
import MoreIcon from '../../assets/icons/moreIcon.svg'
import ViewIcon from '../../assets/images/view1x.png'
import SearchIcon from '../../assets/images/search1x.png'
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import EditIcon from '../../assets/images/Edit1x.png'
import DownloadIcon from '../../assets/images/download1x.png'
import DeleteIcon from '../../assets/images/delete1x.png'
import OverDeleteIcon from '../../assets/images/delete_1x.png'
import CancelIcon from '../../assets/images/cancel1x.png'
import { menteeColumns, menteeRow } from '../../mock';
import { Button } from '../../shared';
import { getAllReports } from '../../services/reportsInfo';
import { useDispatch, useSelector } from 'react-redux';
import { goalDataStatus, goalStatusColor, pipeUrls } from '../../utils/constant';
import { reportColumns } from '../../utils/formFields';



const Reports = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { allreports, loading } = useSelector(state => state.reports)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [requestTab, setRequestTab] = useState('all')
    const [searchParams] = useSearchParams();

    const requestBtns = [
        {
            name: 'All Reports',
            key: 'all'
        },
        {
            name: 'Pending Reports',
            key: 'pending'
        },
        {
            name: 'Completed',
            key: 'accept'
        },
        {
            name: 'Rejected',
            key: 'cancel'
        },
        {
            name: 'Draft',
            key: 'draft'
        }
    ]

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const reportColumn = [
        ...reportColumns,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 8,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                           >
                            {params.row.goal_status}
                        </span>
                    </div>
                </>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 9,
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
                        <MenuItem onClick={() => navigate('/edit-report/1')} className='!text-[12px]'>
                            <img src={EditIcon} alt="EditIcon" className='pr-3 w-[30px]' />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/view-report/1')} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                        <MenuItem onClick={() => console.log('download', params)} className='!text-[12px]'>
                            <img src={DownloadIcon} alt="DownloadIcon" className='pr-3 w-[30px]' />
                            Download
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

    const title = requestBtns.find(option => option.key === requestTab)?.name || ''

    const handleTab = (key) => {
        let typeString = `?type=${key}`
        if(key === 'all'){
            typeString = ''
        }
        navigate(`${pipeUrls.reports}${typeString}`)
        setRequestTab(key)
    }

    const handleSelectedRow = (row) => {
        setSelectedRows(row)
        console.log('selected', row)
    }

    const handleDeleteSelectedRows = () => {
        setDeleteModal(true)
    }

    useEffect(() => {
        console.log('searchParams', searchParams)
        const filterType = searchParams.get("type");

        let query = ''
        if (filterType && filterType !== '') {
            query = filterType
        }
        dispatch(getAllReports(query));
    }, [searchParams])


    return (
        <div className="reports px-9 py-9">

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={deleteModal || loading}
            >
                {
                    deleteModal &&

                    <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">

                        <div style={{ border: '1px solid rgba(229, 0, 39, 1)', borderRadius: '15px' }} className='relative flex flex-col gap-2 justify-center 
                        items-center py-14 px-16'>

                            <img className='absolute top-2 right-3 cursor-pointer' onClick={() => setDeleteModal(false)}
                                src={CancelIcon} alt="CancelIcon" />

                            <img className='w-[50px]' src={OverDeleteIcon} alt="OverDeleteIcon" />


                            <div className='py-5 mb-3'>
                                <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>
                                    Are you sure want to delete this?</p>
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
                                        onClick={() => setDeleteModal(false)} >
                                        Yes
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    loading && <CircularProgress color="inherit" />
                }


            </Backdrop>


            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center '>
                        <p>Reports</p>
                    </div>
                    <div className='flex gap-8 items-center'>
                        {
                            selectedRows.length ? <img className='cursor-pointer' onClick={handleDeleteSelectedRows} src={OverDeleteIcon} alt="OverDeleteIcon" /> : null
                        }

                        <div className="relative flex gap-3 py-3 px-3" style={{ border: '1px solid rgba(24, 40, 61, 0.25)' }}>
                            <img src={CalenderIcon} alt="CalenderIcon" />
                            <select className='focus:outline-none'>
                                <option>Month</option>
                                <option>Week</option>
                                <option>Day</option>
                            </select>
                        </div>
                        <Button btnName="Create Report" onClick={() => navigate('/create-report')} btnCls="!py-4" />
                    </div>
                </div>

                <div className='mx-5'>

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

                    <div className='reports-table-container'>
                        <div className='flex justify-between px-5 pb-4 mb-8 items-center'>
                            <div className='flex gap-5 items-center '>
                                <p className='text-[18px] font-semibold'>{title}</p>
                            </div>
                            <div className='flex gap-8 items-center'>
                                <div className="relative">
                                    <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none"
                                        placeholder="Search here..." style={{
                                            border: '1px solid rgba(29, 91, 191, 1)',
                                            height: '60px',
                                            width: '345px'
                                        }} />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                        <img src={SearchIcon} alt='SearchIcon' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DataTable rows={allreports} columns={reportColumn} handleSelectedRow={handleSelectedRow} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Reports

