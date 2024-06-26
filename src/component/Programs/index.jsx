import React from 'react'
import Card from '../../shared/Card';
import { curatedPrograms, menusList } from '../../utils/mock';
import SearchIcon from '../../assets/icons/search.svg';
import CalenderIcon from '../../assets/icons/Calender.svg';
import BookmarkedIcon from '../../assets/icons/Bookmarked.svg';
import CalendarIcon from '../../assets/images/calender_1x.png';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function Programs() {
    const navigate = useNavigate()
    const userInfo = useSelector(state => state.userInfo)
    const programFilter = [
        {
            name: 'Quarter 1',
            key: 'quaeter1',
        },
        {
            name: 'Quarter 2',
            key: 'quaeter2',
        },
    ]
    return (
        <div className="dashboard-content px-8 mt-10">
            <div className='flex justify-between items-center mb-8'>
                <div>All Programs</div>
                {
                    userInfo && userInfo.data && userInfo.data.role === 'mentor' &&
                    <div>
                        <button onClick={() => navigate('/create-programs')} className='text-[12px] px-3 py-4' style={{ background: '#1D5BBF', color: '#fff', borderRadius: '6px' }}>Create New Program Request</button>
                    </div>
                }

            </div>
            <div className="grid grid-cols-5 gap-3">
                <div className="row-span-3 flex flex-col gap-8">
                    <Card cardTitle={'Programs'} cardContent={menusList} />
                    <Card cardTitle={'Program Performance'} cardContent={menusList} cardFilter={programFilter} />
                </div>

                <div className="col-span-4">
                    <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                            <div className="flex gap-4"></div>
                            <div className="flex gap-20 items-center">
                                <img src={SearchIcon} alt="statistics" />

                                <p className="text-[12px] py-2 pl-5 pr-4 flex gap-4" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>
                                    <img src={CalendarIcon} alt="CalendarIcon" />
                                    <select className='focus:outline-none' style={{ background: 'rgba(223, 237, 255, 1)', border: 'none' }}>
                                        <option>Day</option>
                                        <option>Month</option>
                                    </select>
                                </p>
                            </div>

                        </div>
                        <div className="py-3 px-3 flex  flex-wrap">
                            {
                                curatedPrograms.map((curatedProgram, index) =>
                                    <div key={index} className="curated-programs flex gap-4 items-center py-8 px-9 w-1/3">
                                        <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                            <div className="flex py-6 px-7 border-b-2 relative">
                                                <div className="w-6/12 h-full">
                                                    <img className="object-cover w-full h-[130px]" src={curatedProgram.programImage} alt="Program Logo" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-1/3" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{curatedProgram.category}</p>
                                                    <h4 className="text-[16px]">{curatedProgram.name}</h4>
                                                    <span className="text-[12px]">{curatedProgram.desc}</span>
                                                    <button className="text-white text-[12px] py-2 w-5/12" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                                </div>
                                                <img className="absolute top-4 right-4 cursor-pointer" src={BookmarkedIcon} alt="BookmarkedIcon" />
                                            </div>


                                            <div className="flex justify-between pb-3 mx-4 my-4 items-center">
                                                <div className="flex text-[12px] gap-4 items-center">
                                                    <img src={CalenderIcon} alt="CalendarImage" />
                                                    <span>{curatedProgram.time}</span>
                                                    <div
                                                        className="w-[6px] h-[6px]  mx-[-1px]  flex items-center justify-center">
                                                        <span className="w-[6px] h-[6px]  rounded-full" style={{ background: 'rgba(0, 0, 0, 1)' }}></span>
                                                    </div>

                                                    <span>{curatedProgram.hour}</span>
                                                </div>
                                                <div className="text-[12px] px-2 py-2" style={{ background: 'rgba(241, 241, 241, 1)', borderRadius: '3px' }}>{curatedProgram.posted}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
