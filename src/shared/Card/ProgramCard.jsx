import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';

import FilterIcon from '../../assets/icons/Filter.svg';
import UserImage from "../../assets/images/user.jpg";
import MoreIcon from '../../assets/icons/moreIcon.svg'
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg'
import BookmarkedColorIcon from '../../assets/images/bookmarked-colour1x.png'
import CalenderIcon from '../../assets/icons/Calender.svg';
import StarColorIcon from '../../assets/icons/starColor.svg';
import { ProgramStatusInCard } from '../../utils/constant';


export default function ProgramCard({ title, viewpage, handleNavigateDetails, handleBookmark, programs, height, action = [], noTitle = false }) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const userInfo = useSelector(state => state.userInfo)
    const role = userInfo.data.role

    const statusNotShow = ['yettoapprove', 'yettojoin', 'yettostart', 'draft', 'new_program_request_rejected', 'start_request_submitted']

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (

        <div className='main-program' style={{ boxShadow: noTitle ? 'none' : '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
            {
                !noTitle &&

                <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                    <div className="flex gap-4">
                        <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                        <h4>{title}</h4>
                        <img src={FilterIcon} alt="statistics" />
                    </div>
                    {
                        programs && programs.length ?

                            <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                                background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                            }}
                                onClick={() => navigate(viewpage)}
                            >View All</p>

                            : null
                    }

                    {
                        action && action.length ?
                            <>
                                <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e)}>
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

                                    {
                                        action.map((act, i) =>
                                            <MenuItem key={i} onClick={() => navigate(act.url)} className='!text-[12px]'>
                                                {act.icon && <img src={act.icon} alt="Icon" className='pr-3 w-[30px]' />}
                                                {act.name}
                                            </MenuItem>
                                        )
                                    }
                                </Menu>
                            </>

                            : null

                    }

                </div>
            }


            <div className="py-3 px-3 ">
                <div className="flex flex-wrap">
                    {
                       programs && programs.length ?

                            programs.map((currentProgram, index) => {
                                let startDate = ''
                                if (currentProgram.start_date !== '') {
                                    startDate = new Date(currentProgram.start_date).toISOString().substring(0, 10).split("-")
                                }
                                const actualStartDate = startDate.length ? `${startDate[2]}/${startDate[1]}/${startDate[0]}` : ''

                                return (
                                    <div key={index} className={`curated-programs program-container flex gap-1 items-center py-5 px-5 
                                                           w-[33%]`}
                                        style={{
                                            ...currentProgram.status === 'yettoapprove' || currentProgram.status === 'draft' ? {
                                                opacity: '0.5',
                                                pointerEvents: 'none',
                                                cursor: 'not-allowed',
                                            }
                                                :
                                                {}


                                        }}
                                    >

                                        <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                            <div className="py-6 px-7 border-b-2 relative">
                                                <div className="h-full relative" style={{ borderRadius: '10px' }}>
                                                    <img className="object-cover w-full h-[150px]" src={currentProgram.image} alt="Program Logo" />

                                                    <div className='absolute top-2 right-0' style={{ background: '#fff', borderRadius: '50%', padding: '14px 17px' }}>
                                                        <img className="cursor-pointer"
                                                            onClick={() => handleBookmark(currentProgram)}
                                                            src={currentProgram.bookmark ? BookmarkedColorIcon : BookmarkedIcon} alt="BookmarkedIcon" />
                                                    </div>
                                                </div>

                                                <div className='flex justify-between py-4'>
                                                    <h4 className="text-[16px]" title={currentProgram.program_name} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '180px' }}>
                                                        {currentProgram.program_name}
                                                    </h4>
                                                    {
                                                        currentProgram.categories.length &&
                                                        <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-[90px]"
                                                            style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{currentProgram?.categories[0]?.name}</p>
                                                    }
                                                </div>
                                                <div>
                                                    <span className="text-[12px] line-clamp-2 ">{currentProgram.description}</span>
                                                </div>
                                                <div className='flex gap-2 items-center py-3 text-[12px]'>
                                                    <img src={StarColorIcon} alt="StarColorIcon" />
                                                    <span>4.6</span>
                                                    <span style={{ borderRight: '1px solid #18283D' }}></span>
                                                    <img className="w-6 h-6 rounded-full shadow-lg object-cover" src={UserImage} alt="User logo" />
                                                    <span style={{
                                                        textOverflow: 'ellipsis', overflow: 'hidden',
                                                        width: '215px', whiteSpace: 'nowrap'
                                                    }}>Instructor : {currentProgram?.mentor_name}</span>
                                                </div>
                                                <div className='flex justify-center pt-2'>

                                                    {
                                                        currentProgram.status === 'yettoapprove' || currentProgram.status === 'draft' ?

                                                            <button className={`text-white text-[12px] py-3 ${currentProgram.status === 'draft' ? 'w-[110px]' : 'w-[170px]'}`}
                                                                onClick={undefined}
                                                                style={{ background: currentProgram.status === 'yettoapprove' ? '#76818E' : 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>
                                                                {currentProgram.status === 'draft' ? 'Continue' : 'Waiting for approval'}

                                                            </button>
                                                            :

                                                            <button className="text-white text-[12px] py-3 w-[140px]"
                                                                onClick={() => handleNavigateDetails(currentProgram)}
                                                                style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                                    }
                                                </div>

                                            </div>


                                            <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                                <div className="program-time-info flex text-[12px] gap-4 items-center">
                                                    <img src={CalenderIcon} alt="CalendarImage" />
                                                    <span className='program-date'>{actualStartDate}</span>
                                                    <div
                                                        className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                                        <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                                    </div>

                                                    <span className='program-time'>{'10 A.M'}</span>
                                                </div>

                                                {
                                                    !statusNotShow.includes(currentProgram.status) ?

                                                        <div className="text-[12px] px-2 py-2" style={{
                                                            background: `${ProgramStatusInCard[currentProgram.status]?.bg}`,
                                                            color: `${ProgramStatusInCard[currentProgram.status]?.color}`, borderRadius: '3px'
                                                        }}>
                                                            {ProgramStatusInCard[currentProgram.status]?.text}
                                                        </div>

                                                        :

                                                        <div className="posted-tim text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{'10 Mins ago'}</div>


                                                }

                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            )
                            : <div>No Programs found</div>
                    }

                </div>

            </div>
        </div>

    )
}
