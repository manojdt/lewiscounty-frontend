import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ReactComponent as NotificationIcon } from "../../assets/icons/notification.svg";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import UserImage from "../../assets/images/user.jpg";

export const Navbar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="px-4" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
            <nav className="bg-white border-gray-200">
                <div className='flex justify-between'>
                    <div className="flex justify-between w-3/12 p-4">
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <svg
                                width="45"
                                height="45"
                                viewBox="0 0 59 59"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M29.0588 58.5365C45.1076 58.5365 58.1177 45.4327 58.1177 29.2682C58.1177 13.1039 45.1076 0 29.0588 0C13.0101 0 0 13.1039 0 29.2682C0 45.4327 13.0101 58.5365 29.0588 58.5365ZM38.1242 13.6344C38.5654 12.0557 37.0444 11.1221 35.6552 12.119L16.2629 26.0335C14.7564 27.1145 14.9934 29.2682 16.6189 29.2682H21.7254V29.2284H31.6778L23.5685 32.1103L19.9935 44.9022C19.5523 46.4809 21.0732 47.4144 22.4625 46.4176L41.8548 32.5031C43.3613 31.4221 43.1242 29.2682 41.4988 29.2682H33.7549L38.1242 13.6344Z"
                                    fill="#00AEBD"
                                    style={{
                                        fill: "#00AEBD;fill:color(display-p3 0.0000 0.6824 0.7412);fill-opacity:1",
                                    }}
                                />
                            </svg>
                            <span className="self-center text-2xl font-semibold whitespace-nowrap">Logo</span>
                        </a>
                        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                                <li>
                                    <a href="/" className="block py-2 px-3 rounded md:p-0" aria-current="page">Learn</a>
                                </li>
                                <li>
                                    <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Courses</a>
                                </li>
                                <li>
                                    <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Survey</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-3/12 p-4">
                        <div className="relative mt-1">
                            <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none rounded-lg"
                                placeholder="Search..." style={{ backgroundColor: '#F5F9FF' }} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                        </div>
                        <NotificationIcon />
                        <SettingsIcon />

                        <div className='reletive'>
                            <img className='rounded-3xl object-cover h-8 w-8 cursor-pointer' src={UserImage} alt="User Icon"
                                onClick={handleClick} />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>

                        </div>
                    </div>
                </div>

            </nav>
        </div>
    )
}

