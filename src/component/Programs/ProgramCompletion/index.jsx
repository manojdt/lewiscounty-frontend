import React, { useState } from 'react'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import CompletedIcon from '../../../assets/images/completed-teaching-program1x.png'
import ReopenIcon from '../../../assets/images/reopen-request1x.png'
import ExtendIcon from '../../../assets/images/extend-request1x.png'
import MoreIcon from '../../../assets/images/more1x.png';

import { Button } from '../../../shared'
import { useNavigate } from 'react-router-dom'

export default function ProgramCompletion() {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="px-9 my-6 grid">
            <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                <div className='breadcrum'>
                    <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                    Program
                                </a>
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </li>
                            <li className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                    Curated Program
                                </a>
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </li>
                            <li className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                    Teaching
                                </a>
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                        Completed </a>
                                </div>
                            </li>
                        </ol>
                        <div className='cursor-pointer' onClick={handleClick}>
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
                            <MenuItem onClick={handleClose} className='!text-[12px]'>
                                <img src={ExtendIcon} alt="ExtendIcon" className='pr-3 w-[25px]' />
                                Extend Request </MenuItem>
                            <MenuItem onClick={handleClose} className='!text-[12px]'>
                                <img src={ReopenIcon} alt="ReopenIcon" className='pr-3 w-[25px]' />
                                Reopen  Request
                            </MenuItem>
                        </Menu>
                    </nav>
                </div>
                <div className='flex justify-center items-center flex-col gap-8 py-10'>
                    <div className='font-semibold' style={{ color: 'rgba(29, 91, 191, 1)' }}>Completed Teaching Program</div>
                    <img src={CompletedIcon} alt="CompletedIcon" className='w-[2%]' />
                    <div>
                        <div className="relative ">
                            <table className="w-[800px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Start Date | End Date
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            04/23/2024 | 04/23/2024
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                            Durations
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            8 hrs 30 mins
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 ">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Attended Mentees
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            30 Mentees
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b  dark:bg-gray-800">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Location
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            New York
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Program status
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            Offline
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p>If you want to take more time for this program request to admin,
                        <span style={{ color: 'rgba(29, 91, 191, 1)', textDecoration: 'underline', cursor: 'pointer' }}> CLICK HERE</span>
                    </p>
                </div>

                <div className="flex gap-6 justify-center align-middle py-10">
                    <Button btnName='Cancel' btnCls="w-[13%]" btnCategory="secondary" onClick={() => navigate('/programs')} />
                    <Button btnType="button" btnCls="w-[13%]" onClick={() => { }} btnName='Create Report' btnCategory="primary" />
                </div>

            </div>
        </div>

    )
}
