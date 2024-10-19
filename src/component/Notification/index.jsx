import React, { useEffect } from 'react'
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'
import RightArrowIcon from '../../assets/icons/RightSingleArrow.svg';
import { useNavigate } from 'react-router-dom';
import { getTimeFromDate } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { userActivities, userActivitiyVisited } from '../../services/activities';


export default function Notification({ handleClose }) {

    const { activity, loading } = useSelector(state => state.activity)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const handleNavigation = () => {
        handleClose && handleClose()
        navigate('/notification')
    }

    const handleVisitActivity = (data) => {
        dispatch(userActivitiyVisited(data.id))
        const actionType = data?.notification_type
        switch (actionType) {
            case 'program':
                handleClose && handleClose()
                navigate(`/program-details/${data.related_data.program_id}?request_id=${data.related_data.program_request_id}`)
                break;
            default:
                handleNavigation()
                break;
        }
    }

    useEffect(() => {
        dispatch(userActivities())
    }, [])

    return (
        <div className='notification-container'>
            <div className='title'>Notifications</div>
            {
                !loading ?
                    <>
                        {
                            activity.length ?
                                <ul>
                                    {activity.map((list, index) => {
                                        return (
                                            <li className='notification-list cursor-pointer' onClick={() => handleVisitActivity(list)} key={index}>
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
                                    No activities found
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
                    </>
                    :
                    <div>Loading...</div>
            }

        </div>
    )
}
