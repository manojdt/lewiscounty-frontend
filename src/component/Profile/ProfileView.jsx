import React, { useEffect, useState } from 'react'
import { Button } from '../../shared'
import { useParams } from 'react-router-dom'
import ProfileImageIcon from '../../assets/icons/profile-image-icon.svg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { ProfileFields } from '../../utils/formFields'
import { getFollowList, getProfileInfo, userFollow, userUnFollow } from '../../services/userList';
import ConnectIcon from '../../assets/images/Connectpop1x.png'

export default function ProfileView() {
    const dispatch = useDispatch()
    const [activity, setActivity] = useState({ modal: false, following: false, complete: false })
    const { userDetails, loading: userInfoLoading, followInfo } = useSelector((state) => state.userList);
    const { profile, loading, status } = useSelector(state => state.profileInfo);
    const { data } = useSelector(state => state.userInfo)
    const params = useParams();
    const pageType = window.location.href.includes('mentor-details') ? 'Mentor' : 'Mentee'

    const loadUserProfile = () => {
        dispatch(getProfileInfo(params.id));
        dispatch(getFollowList(params.id))
    }

    const followResponseHandle = () => {
        setActivity({ modal: false, complete: true, following: !activity.following });
        dispatch(getFollowList(params.id)).then(() => {
            setTimeout(() => {
                setActivity({ ...activity, modal: false, complete: false })
            }, 3000)
        })
    }

    const handleFollow = () => {
        if (followInfo.is_following) {
            dispatch(userUnFollow({ user_id: params.id })).then(() => {
                followResponseHandle()
            })
        }
        if (!followInfo.is_following) {
            dispatch(userFollow({ user_id: params.id })).then(() => {
                followResponseHandle()
            })
        }
    }

    const handleShowPopup = () => {
        setActivity({ ...activity, modal: true })
    }

    useEffect(() => {
        if (params.id) {
            loadUserProfile()
        }
    }, [params])


    return (
        <div className="profile-container">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => 999999 }}
                open={loading || userInfoLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={activity.modal}
            >
                <div className="popup-content w-2/6 bg-white flex flex-col gap-2 h-[330px] justify-center items-center">
                    <img src={ConnectIcon} alt="ConnectIcon" />
                    <span style={{ color: '#232323', fontWeight: 600, fontSize: '24px' }}>{followInfo.is_following ? 'Unfollow' : 'Follow'}</span>

                    <div className='py-5'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600, fontSize: '18px' }}>Are you sure you want to {followInfo.is_following ? 'Unfollow' : 'Follow'} {pageType}?</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className="flex gap-6 justify-center align-middle">
                            <Button btnName='Cancel' btnCategory="secondary" onClick={() => setActivity({ modal: false, following: false })} />
                            <Button btnType="button" btnCls="w-[110px]" btnName={followInfo.is_following ? 'Unfollow' : 'Follow'} btnCategory="primary"
                                onClick={handleFollow}
                            />
                        </div>
                    </div>
                </div>
            </Backdrop>


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={activity.complete}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Successfully {followInfo.is_following ? 'followed ' : 'unfollowed '} { pageType.toLowerCase()}</p>
                    </div>

                </div>
            </Backdrop>

            <div className='flex justify-between items-center mb-8'>
                <div className='text-color font-medium' >
                    My {pageType } Profile
                </div>
            </div>

            <div className='profile-content py-8 px-14' style={{ border: '1px solid rgba(219, 224, 229, 1)', background: 'rgba(255, 255, 255, 1)' }}>
                <div className='flex justify-between items-center mb-8'>
                    <div className='text-color font-medium' >
                        Profile Picture
                    </div>

                </div>

                <div className='flex justify-between items-center'>
                    <div className='py-4 relative w-[12%]'>
                        <div className='upload-profile'>
                            <label className="w-[40%] pb-3 rounded-lg text-white text-[14px] cursor-pointer" style={{
                                border: 'none'
                            }}>
                                <img src={profile?.image || ProfileImageIcon} style={{ borderRadius: '50%', height: '143px' }} alt="ProfileImageIcon" />
                            </label>
                        </div>

                    </div>
                    <div className='flex gap-5'>
                        <Button onClick={handleShowPopup} btnType="button" btnCategory="secondary" btnName={followInfo.is_following ? 'Unfollow' : 'Follow'} btnCls={'w-[150px]'} />
                        <Button btnType="button" btnName="Chat" btnCls={'w-[150px]'} />
                    </div>
                </div>

                <div className='grid grid-cols-6 gap-3 mt-12'>
                    {
                        ProfileFields.map((profilefield, index) =>
                            <div className='col-span-2' key={index}>
                                <div className='mb-5'>
                                    <label className="block tracking-wide  text-xs mb-2" style={{ color: 'rgba(116, 116, 116, 1)' }}>
                                        {profilefield.label}
                                    </label>
                                    <p className="text-[14px]">{userDetails[profilefield.name]}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
