import React from 'react'
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'
import RightArrowIcon from '../../assets/icons/RightSingleArrow.svg';
import { useNavigate } from 'react-router-dom';
import { getTimeFromDate } from '../../utils';
import { useSelector } from 'react-redux';


export default function Notification({ handleClose }) {

    const { activity } = useSelector(state => state.activity)

    const navigate = useNavigate()

    const handleNavigation = () => {
        handleClose && handleClose()
        navigate('/notification')
    }

    return (
        <div className='notification-container'>
            <div className='title'>Notifications</div>
            {
                activity.length ?
                    <ul>
                        {activity.map((list, index) => {
                            return (
                                <li className='notification-list' key={index}>
                                    <img src={index % 2 === 0 ? MaleIcon : FemaleIcon} alt="MaleIcon" />
                                    <p className='notification-message'>{list.content}</p>
                                    <p>{getTimeFromDate(list.created_at)}</p>
                                </li>
                            )
                        })

                        }
                    </ul>
                    :
                    <div className='px-2 py-3'>
                        No activies found
                    </div>
            }
            {
                activity.length ?

                    <div className='py-4 w-full'>
                        <button className='py-3 px-16 text-white text-[14px] w-full flex items-center justify-center' style={{
                            background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                            borderRadius: '5px'
                        }}
                            onClick={handleNavigation}
                        >See all notifications
                            <span className='pl-8 pt-1'><img style={{ width: '22px', height: '22px' }} src={RightArrowIcon} alt="RightArrowIcon" /></span>
                        </button>
                    </div>

                    : null
            }
        </div>
    )
}
