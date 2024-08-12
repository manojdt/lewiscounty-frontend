import React from 'react'
import SearchIcon from '../../assets/icons/SearchColor.svg'
import FeedImage from '../../assets/images/feed1.png'
import MoreIcon from '../../assets/icons/moreIcon.svg'
import UserIcon from '../../assets/images/user.jpg'
import { Button } from '../../shared'
import { useNavigate } from 'react-router-dom'

export default function Feeds() {
    const navigate = useNavigate()

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

    return (
        <div className="feed-container px-9 py-9">
            <div className='px-10 pt-5 pb-56 mb-8' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex items-center justify-between'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Feeds</p>
                    </div>
                    <div className='flex gap-12'>
                        <img src={SearchIcon} alt='SearchIcon' className='cursor-pointer' />
                        <Button btnName="Add Posts" btnCls={'w-[170px]'} />
                    </div>
                </div>

                <div className='feeds-list'>
                    <div className="grid grid-cols-3 gap-7">
                        {
                            feedList.map((feed, index) =>
                                <div className='feed-card cursor-pointer' key={index} onClick={() => navigate('/feed-details/1')}>
                                    <img className='feed-image' src={FeedImage} alt="FeedImage" />
                                    <div className='feed-content flex justify-between pt-5'>
                                        <div className='flex gap-4 items-center'>
                                            <img className='user-image' src={UserIcon} alt="UserIcon" />
                                            <div>
                                                <p className='text-[14px]'>
                                                    {feed.name}
                                                </p>
                                                <p className='text-[12px]'>{feed.comment}</p>
                                            </div>
                                        </div>
                                        <img src={MoreIcon} className='cursor-pointer' alt="MoreIcon" />
                                    </div>
                                </div>)
                        }


                    </div>
                </div>

            </div>

        </div>
    )
}
