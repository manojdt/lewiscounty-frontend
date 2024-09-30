import React, { useEffect, useState } from 'react';
import SearchIcon from '../../assets/icons/SearchColor.svg'
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'
import { useDispatch, useSelector } from 'react-redux';
import { userActivities } from '../../services/activities';
import { getTimeFromDate } from '../../utils';

export default function NotificationMenu() {

    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState('')
    const { activity } = useSelector(state => state.activity)

    const handleSearch = (e) => {
        setSearchKey(e.target.value)
        dispatch(userActivities({ search: e.target.value }))
    }


    useEffect(() => {
        dispatch(userActivities())
    }, [])


    return (
        <div className="nofification px-9 py-9">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex w-full gap-5 items-center justify-between'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Notification</p>
                    </div>
                </div>

                <div className='notification-content'>
                    {
                        activity.length || searchKey !== '' ?

                            <div className='nofification-action'>
                                <div className="relative">
                                    <input type="text" className="block w-full p-2 text-sm text-gray-900 border-none"
                                        placeholder="Search notification" style={{
                                            background: 'rgba(238, 245, 255, 1)',
                                            height: '55px',
                                            width: '400px',
                                            borderRadius: '6px'
                                        }}
                                        onChange={handleSearch}
                                    />
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                        <img src={SearchIcon} alt='SearchIcon' />
                                    </div>
                                </div>

                            </div>
                            : null
                    }


                    <div className='notification-container'>
                        {
                            activity.length ?

                                <ul>
                                    {activity.map((list, index) =>
                                        <li key={index}>
                                            <img src={index % 2 === 0 ? MaleIcon : FemaleIcon} alt="MaleIcon" />
                                            <div className='flex justify-between w-full'>
                                                <p className='notification-message'>
                                                    <p className='font-semibold'>{list.content}</p>
                                                    <p className='text-[14px] pt-4 leading-6'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                        nisi ut aliquip ex ea commodo consequat.
                                                    </p>
                                                </p>
                                                <p className='text-[14px]'>{getTimeFromDate(list.created_at)}</p>
                                            </div>
                                        </li>
                                    )
                                    }
                                </ul>
                                : <div>
                                    No activities found
                                </div>
                        }


                    </div>
                </div>

            </div>

        </div>
    )
}
