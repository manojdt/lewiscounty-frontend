import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from "react-redux";
import NotificationIcon from "../../assets/images/message1x.png";
import SettingsIcon from "../../assets/images/setting1x.png";
import UserImage from "../../assets/images/user.jpg";
import SearchIcon from "../../assets/images/search1x.png";
import SearchNavIcon from '../../assets/icons/search.svg';

export const Navbar = () => {
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.userInfo)
    const location = useLocation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { pathname } = location
    const role = userInfo.data.role || ''


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        dispatch({ type: "logout" })
        navigate("/login");
    };

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("mySidenav").style.display = 'block';
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.display = 'none';

    }

    const handleLeftSidebar = () => {
        const leftElement = document.getElementById("leftSideNav");
        const leftBar = document.getElementsByClassName('left-bar')[0];
        leftElement.style.width = "300px";
        leftElement.style.display = 'block';
        document.getElementById("left-content").appendChild(leftBar)
    
        console.log('left', leftBar)
    }

    
    function closeLeftNav() {
        document.getElementById("leftSideNav").style.width = "0";
        document.getElementById("leftSideNav").style.display = 'none';

    }

    return (
        <div className="navbar-content px-4" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
            <nav className="bg-white border-gray-200">
                <div className='flex justify-between'>
                    <div className="contain flex justify-between w-3/12 p-4">
                        <div className="site-logo cursor-pointer flex items-center space-x-3 rtl:space-x-reverse">
                            <svg
                                width="40"
                                height="35"
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
                        </div>
                        <div className='navbar-mobile-menu' onClick={handleLeftSidebar}>
                            <div className='user-image'>
                                <img className="rounded-3xl object-cover h-10 w-10 cursor-pointer" src={UserImage} alt="User logo1" />
                            </div>
                        </div>
                        {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
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
                        </div> */}
                    </div>

                    <div className={`navbar-icons flex items-center justify-between ${getWindowDimensions().width <= 1536 ? 'w-3/6' : 'w-2/5'} p-4`}>
                        <div className="relative mt-1 search-container">
                            <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none rounded-lg"
                                placeholder="Search..." style={{ backgroundColor: '#F5F9FF', width: '430px', height: '50px', borderRadius: '3px' }} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt="SearchIcon" />
                            </div>
                        </div>
                        <img className='search-icon hidden' src={SearchIcon} alt="SearchIcon" />
                        <img src={NotificationIcon} alt="NotificationIcon" />
                        <img src={SettingsIcon} alt="SettingsIcon" />

                        <span className='more-icon-menu cursor-pointer hidden text-[25px]' onClick={() => openNav()}>&#9776;</span>

                        <div className='reletive action-menu'>
                            <img className='rounded-3xl object-cover h-8 w-8 cursor-pointer' src={UserImage} alt="User Icon"
                                onClick={handleClick} />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>

                        </div>

                        <div id="mySidenav" class="sub-menu sidenav hidden">
                            <a href="javascript:void(0)" class="closebtn" onClick={() => closeNav()}>&times;</a>


                            <ul className="flex flex-col gap-2  p-4 md:p-0 mt-4 font-medium">
                                <li className={`${pathname === '/dashboard' ? 'dashboard-menu-active' : ''}`}>
                                    <span onClick={() => navigate('/dashboard')} className="block py-2 text-black px-3 rounded md:p-0 cursor-pointer" aria-current="page">Dashboard</span>
                                </li>
                                <li className={`${pathname === '/programs' ? 'dashboard-menu-active1' : ''}`}>
                                    <span onClick={() => navigate('/programs')} className="block py-2 px-3 text-black rounded md:hover:bg-transparent md:p-0 cursor-pointer">Programs</span>
                                </li>
                                {
                                    role === 'mentee' &&
                                    <li className={`${pathname === '/mentors' ? 'dashboard-menu-active' : ''}`}>
                                        <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 text-white rounded md:hover:bg-transparent md:p-0 cursor-pointer">Mentors</span>
                                    </li>
                                }

                                {
                                    role === 'mentors' &&
                                    <li className={`${pathname === '/mentees' ? 'dashboard-menu-active' : ''}`}>
                                        <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 text-white rounded md:hover:bg-transparent md:p-0 cursor-pointer">Mentees</span>
                                    </li>
                                }


                                <li>

                                    <div className="relative inline-block text-left">
                                        <div>
                                            <button type="button" className="inline-flex w-full justify-center gap-x-1.5  px-3 py-2 text-black" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                                Objectives
                                                <svg className="-mr-1 h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                    </div>
                                </li>
                                <li className={`${pathname === '/calendar' ? 'dashboard-menu-active' : ''}`}>
                                    <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 text-black rounded md:hover:bg-transparent md:p-0 cursor-pointer">Calendar</span>
                                </li>
                                <li className={`${pathname === '/discussions' ? 'dashboard-menu-active' : ''}`}>
                                    <span onClick={() => navigate('/dashboard')} className="block py-2 px-3 text-black rounded md:hover:bg-transparent md:p-0 cursor-pointer">Discussions</span>
                                </li>
                                <li>
                                    <div className="relative inline-block text-left">
                                        <div>
                                            <button type="button" className="inline-flex w-full justify-center gap-x-1.5  px-3 py-2  text-black" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                                More
                                                <svg className="-mr-1 h-6 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                    </div>
                                </li>
                                <li>
                                    <span onClick={() => navigate('/logout')} className="block py-2 px-3 text-black rounded md:hover:bg-transparent md:p-0 cursor-pointer">Logout</span>
                                </li>
                            </ul>
                        </div>


                        <div id="leftSideNav" class="sub-menu leftsidenav hidden">
                            <a href="#" class="closebtn" onClick={() => closeLeftNav()}>&times;</a>

                            <div id='left-content' className="px-3"></div>
                            
                        </div>
                    </div>
                </div>

            </nav>
        </div>
    )
}

