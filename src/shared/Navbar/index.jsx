import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from "react-redux";
import NotificationIcon from "../../assets/icons/notification-icon.svg";
import SettingsIcon from "../../assets/images/setting1x.png";
import UserImage from "../../assets/icons/user-icon.svg";
import SearchIcon from "../../assets/images/search1x.png";
import HelpIcon from '../../assets/icons/Help.svg';
import ProfileIcon from '../../assets/icons/Profile.svg';
import LogoutIcon from '../../assets/icons/Logout.svg';
import LogoutColorIcon from '../../assets/icons/Logoutpop.svg'
import { Backdrop } from '@mui/material';
import { Button } from '../Button';

import { OverlayPanel } from 'primereact/overlaypanel';
import Notification from '../../component/Notification';
import { userActivities } from '../../services/activities';
import api from '../../services/api';

export const Navbar = () => {
    const navigate = useNavigate();
    const searchBar = useRef(null);
    const op = useRef(null);
    const [isLogout, setIsLogout] = useState(false)
    const userInfo = useSelector(state => state.userInfo)
    const location = useLocation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchProps, setSearchProps] = useState({ searchType: 'program', search: '', dropOpen: false, searchData: [], current: null })
    const open = Boolean(anchorEl);
    const { pathname } = location
    const role = userInfo.data.role || ''

    const filterBtn = [
        {
            key: 'program',
            name: 'Program'
        },
        {
            key: 'mentor',
            name: 'Mentors'
        },
        {
            key: 'mentee',
            name: 'Mentees'
        },
    ]

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        dispatch({ type: "logout" })
        navigate("/login");
    }

    const handleProfile = () => {
        handleClose();
        navigate('/my-profile');
    }


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
    }


    function closeLeftNav() {
        document.getElementById("leftSideNav").style.width = "0";
        document.getElementById("leftSideNav").style.display = 'none';

    }

    const handleCloseNotification = () => {
        document.getElementsByClassName('notification-image')[0].click()
    }

    const handleGlobalChange = async (value) => {
        const getSearchData = await api.get(
            `globalsearch?keyword=${searchProps.searchType}&search=${value}`
        );
        if (getSearchData.status === 200 && getSearchData.data) {
            setSearchProps({ ...searchProps, searchData: getSearchData.data });
        }
    }

    const handleSelectFilter = (key) => {
        setSearchProps({ ...searchProps, searchType: key, searchData: [] })
    }


    const handleOpenSearchBar = e => {
        if (!document.getElementById('search_overlay_panel')) {
            searchBar.current.toggle(e)
        }
        setSearchProps({ ...searchProps, searchData: [], dropOpen: true, current: e })
    }

    const searchNavigation = (url) => {
        searchBar.current.toggle(searchProps.current)
        document.getElementById('search-navbar').value = ''
        setSearchProps({ ...searchProps, searchData: [], searchType: 'program', current: null })
        navigate(url)
    }

    const handleLogoClick = () => {
        if (role === 'mentee' && !userInfo?.data?.is_registered) {
          navigate('/programs');
        } else if (
            userInfo?.data?.role === 'super_admin' &&
            userInfo?.data?.is_registered === true
        ) {
        } else {
          navigate('/dashboard');
        }
      };


    useEffect(() => {
        dispatch(userActivities())
    }, [])

    return (
        <div className="navbar-content px-4" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLogout}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={LogoutColorIcon} alt="LogoutColorIcon" />
                    <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>Log out</span>

                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>Are you sure you want to log out ?</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnName='Cancel' btnCategory="secondary" onClick={() => setIsLogout(false)} />
                            <Button btnType="button" btnCls="w-[110px]" btnName={'Logout'} btnCategory="primary"
                                onClick={handleLogout}
                            />
                        </div>
                    </div>
                </div>

            </Backdrop>

            <nav className="bg-white border-gray-200">
                <div className='flex justify-between'>
                    <div className="contain flex justify-between w-3/12 p-4">
                        <div className="site-logo cursor-pointer flex items-center space-x-3 rtl:space-x-reverse" onClick={handleLogoClick}>
                            <span className="self-center text-2xl font-semibold whitespace-nowrap">My Logo</span>
                        </div>
                        <div className='navbar-mobile-menu' onClick={handleLeftSidebar}>
                            <div className='user-image'>
                                <img className="rounded-3xl object-cover h-10 w-10 cursor-pointer" src={UserImage} alt="User logo1" />
                            </div>
                        </div>
                        {/* {
                            role === 'mentee' &&

                            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                                    <li>
                                        <a href="/" onClick={undefined} className="block py-2 px-3 rounded md:p-0" aria-current="page">Learn</a>
                                    </li>
                                    <li>
                                        <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Courses</a>
                                    </li>
                                    <li>
                                        <a href="/" className="block py-2 px-3 rounded md:hover:bg-transparent md:p-0">Survey</a>
                                    </li>
                                </ul>
                            </div>
                        } */}

                    </div>

                    <div className={`navbar-icons flex items-center ${userInfo?.data?.is_registered ? 'justify-between' : 'justify-end'} ${getWindowDimensions().width <= 1536 ? 'w-3/6' : 'w-2/5'} p-4`}>
                        {
                            userInfo?.data?.is_registered &&

                            <div className="relative mt-1 search-container">
                                <input type="text" id="search-navbar" className="block w-full p-2 text-sm text-gray-900 border-none rounded-lg"
                                    placeholder="Search..." style={{ backgroundColor: '#F5F9FF', width: '430px', height: '50px', borderRadius: '3px' }}
                                    onClick={(e) => handleOpenSearchBar(e)}
                                    onChange={(e) => handleGlobalChange(e.target.value)}
                                />
                                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                    <img src={SearchIcon} alt="SearchIcon" />
                                </div>

                                <OverlayPanel ref={searchBar} id="search_overlay_panel" style={{ width: '430px', top: '63px !important' }}
                                    className="notification-container searchbar-container" onClose={() => console.log('Close')}>
                                    <div className='flex gap-4'>
                                        {
                                            filterBtn.map(fBtn =>
                                                <button key={fBtn.key} onClick={() => handleSelectFilter(fBtn.key)}
                                                    className={`${searchProps.searchType === fBtn.key ? 'active-info' : ''}`}>{fBtn.name}</button>)
                                        }
                                    </div>
                                    <div>
                                        <ul>
                                            {
                                                searchProps.searchData.map((sData, i) => {
                                                    let name = searchProps.searchType === 'program' ? sData.program_name : sData.name
                                                    let url = searchProps.searchType === 'program' ? `program-details/${sData.id}` : `mentor-details/${sData.id}`
                                                    return <li key={i} className='cursor-pointer' onClick={() => searchNavigation(url)}>
                                                        {name}
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </OverlayPanel>
                            </div>
                        }

                        {/* <img className='search-icon hidden' src={SearchIcon} alt="SearchIcon" /> */}
                        {
                            userInfo?.data?.is_registered &&

                            <>
                                <div className='relative notitification-group'>
                                    <img src={NotificationIcon} className='cursor-pointer notification-image' onClick={(e) => op.current.toggle(e)} alt="NotificationIcon" />

                                    <OverlayPanel ref={op} id="overlay_panel" style={{ width: '450px' }} className="notification-container">
                                        <Notification handleClose={handleCloseNotification} />
                                    </OverlayPanel>
                                </div>
                                {/* <img src={SettingsIcon} alt="SettingsIcon" /> */}
                            </>
                        }




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

                                {
                                    userInfo?.data?.is_registered &&

                                    <>
                                        <MenuItem onClick={() => {
                                            handleClose();
                                            navigate('/help');
                                        }}>
                                            <img src={HelpIcon} alt="HelpIcon" className='pr-3 w-[30px]' />
                                            Help</MenuItem>

                                        <MenuItem onClick={handleProfile}>
                                            <img src={ProfileIcon} alt="ProfileIcon" className='pr-3 w-[30px]' />
                                            Profile</MenuItem>
                                    </>


                                }

                                <MenuItem onClick={() => { handleClose(); setIsLogout(true) }}>
                                    <img src={LogoutIcon} alt="LogoutIcon" className='pr-3 w-[30px]' />
                                    Log out</MenuItem>
                            </Menu>

                        </div>

                        <div id="mySidenav" className="sub-menu sidenav hidden">
                            <a href="javascript:void(0)" className="closebtn" onClick={() => closeNav()}>&times;</a>


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
                                    <span onClick={() => navigate('/calendar')} className="block py-2 px-3 text-black rounded md:hover:bg-transparent md:p-0 cursor-pointer">Scheduler</span>
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


                        <div id="leftSideNav" className="sub-menu leftsidenav hidden">
                            <a href="#" className="closebtn" onClick={() => closeLeftNav()}>&times;</a>

                            <div id='left-content' className="px-3"></div>

                        </div>
                    </div>
                </div>

            </nav>
        </div>
    )
}

