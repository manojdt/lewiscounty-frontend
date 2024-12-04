import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import SearchIcon from '../../assets/icons/SearchColor.svg'
import FeedImage from '../../assets/images/feed1.png'
import MoreIcon from '../../assets/icons/moreIcon.svg'
import UserIcon from '../../assets/images/user.jpg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import MaleIcon from '../../assets/images/male-profile1x.png'
import FemaleIcon from '../../assets/images/female-profile1x.png'

import { Button } from '../../shared'
import SettingsModal from './SettingsModal'
import CreatePostModal from './CreatePostModal'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, getPost } from '../../services/feeds'
import { Backdrop, CircularProgress } from '@mui/material'
import { feedStatus } from '../../utils/constant'


export default function Feeds() {
    const defaultState = { create: false, settings: false, control: false, visibility: false }
    const defaultForm = { visibility: 'anyone', comment_control: "anyone", brand_partnership: false, is_published: true }
    const [postModal, setPostModal] = useState({ create: false, settings: false, control: false, visibility: false });
    const [formData, setFormData] = useState({ visibility: 'anyone', comment_control: 'anyone', brand_partnership: false, is_published: true })
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { feeds, loading, status } = useSelector(state => state.feeds)
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const feedList = [
        {
            name: 'Lorem ipsum dolor sit amet, consectetur',
            comment: '85M Views . 2 months ago'
        },
        {
            name: 'Lorem ipsum dolor sit amet, consectetur',
            comment: '85M Views . 2 months ago'
        },
        {
            name: 'Lorem ipsum dolor sit amet, consectetur',
            comment: '85M Views . 2 months ago'
        },
        {
            name: 'Lorem ipsum dolor sit amet, consectetur',
            comment: '85M Views . 2 months ago'
        },
        {
            name: 'Lorem ipsum dolor sit amet, consectetur',
            comment: '85M Views . 2 months ago'
        },
    ]

    const handleClose = () => {
        setPostModal(defaultState)
    }

    const handleVisibilty = () => {
        setPostModal({ ...postModal, settings: true })
    }

    const handleSettingsBack = () => {
        setPostModal({ ...postModal, settings: false, create: true })
    }

    const onSubmit = (data) => {
        console.log('Submit', data)
    }

    const handleSettingsData = data => {
        setFormData({ ...formData, ...data })
        setPostModal({ ...postModal, settings: false, create: true })
    }

    const handlePostData = data => {
        const apiData = {
            ...formData,
            ...data
        }
        dispatch(createPost(apiData));
        setFormData(defaultForm)
    }

    const handleCreatePostPopup = () => {
        setPostModal({ create: true, visibility: false })
    }

    useEffect(() => {
        if (status === feedStatus.create) {
            handleClose()
            setTimeout(() => {
                dispatch(getPost())
            }, 2000)
        }
    }, [status])

    useEffect(() => {
        dispatch(getPost())
    }, [])

    return (
        <div className="feed-container px-9 py-9">
            <div className='px-10 pt-5 pb-56 mb-8' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex items-center justify-between'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Feeds</p>
                    </div>
                    <div className='flex gap-12'>
                        <img src={SearchIcon} alt='SearchIcon' className='cursor-pointer' />
                        <Button btnName="Add Posts" btnCls={'w-[170px]'} onClick={handleCreatePostPopup} />
                    </div>
                </div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: 99999 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={status === feedStatus.create}
                >
                    <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[16px] bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Your post is successfully uploaded</p>
                    </div>

                </div>

                </Backdrop>

                {
                    postModal.create && <CreatePostModal formData={formData} open={postModal.create} handleClose={handleClose} handleVisibilty={handleVisibilty} handlePostData={handlePostData} />
                }


                {
                    postModal.settings && <SettingsModal formData={formData} open={postModal.settings} handleClose={handleClose} handleSettingsBack={handleSettingsBack} handlePostData={handleSettingsData} />
                }


                <div className='feeds-list'>
                    <div className="grid grid-cols-3 gap-7">
                        {
                            feeds.map((feed, index) => {
                                let imageUrl = feed?.image_url || ''

                                if (imageUrl === '') {
                                    imageUrl = feed.gender === 'male' ? MaleIcon : FemaleIcon
                                }

                                return (
                                    <div className='feed-card cursor-pointer' key={index} onClick={() => navigate(`/feed-details/${feed.id}`)}>
                                        <img className='feed-image' src={FeedImage} alt="FeedImage" />
                                        <div className='feed-content flex justify-between pt-5'>
                                            <div className='flex gap-4 items-center'>
                                                <img className='user-image' src={imageUrl} alt="UserIcon" />
                                                <div>
                                                    <p className='text-[14px]'>
                                                        {feed.content}
                                                    </p>
                                                    <p className='text-[12px]'>{feed.post_view_count} {' . '} {feed.time_since_action}</p>
                                                </div>
                                            </div>
                                            <img src={MoreIcon} className='cursor-pointer' alt="MoreIcon" />
                                        </div>
                                    </div>
                                )
                            })
                        }


                    </div>
                </div>

            </div>

        </div>
    )
}
