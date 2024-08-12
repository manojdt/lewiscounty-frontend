import React from 'react'
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'
import RightArrowIcon from '../../assets/icons/RightSingleArrow.svg';
import { useNavigate } from 'react-router-dom';


export default function Notification({ handleClose }) {
    const navigate = useNavigate()
    const list = [
        {
            message: 'A new mentor joined Program 1 A new mentor joined Program 1',
            time: '3.20am'
        },
        {
            message: 'A new mentor joined Program 1 A new mentor joined Program 1',
            time: '3.20am'
        },
        {
            message: 'A new mentor joined Program 1 A new mentor joined Program 1',
            time: '3.20am'
        },
        {
            message: 'A new mentor joined Program 1 A new mentor joined Program 1',
            time: '3.20am'
        },
        {
            message: 'A new mentor joined Program 1 A new mentor joined Program 1',
            time: '3.20am'
        },
        {
            message: 'A new mentor joined Program 1 A new mentor joined Program 1',
            time: '3.20am'
        },
    ]

    const handleNavigation = () => {
        handleClose && handleClose()
        navigate('/notification')
    }
    return (
        <div className='notification-container'>
            <div className='title'>Notifications</div>
            <ul>
                {
                    list.map((list, index) =>

                        <li className='notification-list' key={index}>
                            <img src={index % 2 === 0 ? MaleIcon : FemaleIcon} alt="MaleIcon" />
                            <p className='notification-message'>{list.message}</p>
                            <p>{list.time}</p>
                        </li>
                    )
                }
            </ul>
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
        </div>
    )
}
