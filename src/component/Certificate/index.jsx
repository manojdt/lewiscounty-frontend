import React, { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ViewIcon from '../../assets/images/view1x.png'
import FeedbackIcon from '../../assets/icons/feedback.svg'
import SearchIcon from '../../assets/icons/SearchColor.svg'
import MoreIcon from '../../assets/icons/moreIcon.svg'
import ActionIcon from '../../assets/images/certficate_action.png'

import { listCertificateColumn, listCertificateRow, PostList } from '../../mock'
import DataTable from '../../shared/DataGrid';
import { goalDataStatus, goalStatusColor } from '../../utils/constant';

export default function Certificate() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [activePost, setActivePost] = useState(0)
    const [activePostInfo, setActivePostInfo] = useState(PostList[0])

    const open = Boolean(anchorEl);

    const handlePostClick = (list, index) => {
        setActivePost(index)
        setActivePostInfo(list)
    }


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const listCertificatesColumn = [
        ...listCertificateColumn,
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            id: 2,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full relative'>
                        <span className='w-[80px] flex justify-center h-[30px] px-7'
                            style={{
                                background: goalStatusColor[params.row.status].bg, lineHeight: '30px',
                                borderRadius: '3px', width: '110px', height: '34px', color: goalStatusColor[params.row.status].color,
                                fontSize: '12px'
                            }}>
                            {params.row.status}
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
                console.log('params', params)
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e, params.row)}>
                        <img src={ActionIcon} alt='ActionIcon' />
                    </div>
                    
                </>
            }


        },
    ]

    return (
        <div className="certificate px-9 py-9">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex w-full gap-5 items-center justify-between'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Certificates</p>
                        <img className='cursor-pointer' src={FeedbackIcon} alt={'FeedbackIcon'} />
                    </div>
                </div>
                <div className='certificate-content'>
                    <div className='certificate-action'>
                        <div className="relative">
                            <input type="text" className="block w-full p-2 text-sm text-gray-900 border-none"
                                placeholder="Search Certificate" style={{
                                    background: 'rgba(238, 245, 255, 1)',
                                    height: '55px',
                                    width: '400px',
                                    borderRadius: '6px'
                                }} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt='SearchIcon' />
                            </div>
                        </div>
                    </div>

                    <div className='certificate-table py-9'>
                        <DataTable rows={listCertificateRow} columns={listCertificatesColumn} hideCheckbox />
                    </div>
                </div>
            </div>
        </div >
    )
}
