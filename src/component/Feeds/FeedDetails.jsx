import React from 'react'
import { useNavigate } from 'react-router-dom'
import Tooltip from '../../shared/Tooltip'
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import FeedImage from '../../assets/images/feed1.png'
import LikeBlackIcon from '../../assets/icons/LikeBlack.svg'
import ShareIcon from '../../assets/icons/Share.svg'
import CommentIcon from '../../assets/icons/CommentBlack.svg'
import ChatImage from '../../assets/images/chatimage.png'
import UserIcon from '../../assets/images/user.jpg'
import LikeIcon from '../../assets/icons/like.svg'
import CommentRedIcon from '../../assets/icons/feedbackComment.svg'
import ShareFeedbackIcon from '../../assets/icons/ShareFeedback.svg'
import ReplyFeedbackIcon from '../../assets/icons/ReplyFeedback.svg'
import Programs from '../Dashboard/Programs'

export default function FeedDetails() {
    const navigate = useNavigate()

    const postComments = [
        {
            type: 'Mentor',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        },
        {
            type: 'Mentee',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        },
        {
            type: 'Mentor',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        },
        {
            type: 'Mentee',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        },

    ]
    return (
        <div className="feed-container px-9 py-9">
            <div className='px-3 pt-5 pb-56 mb-8' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '10px',border: '1px solid rgba(219, 224, 229, 1)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex items-center justify-between'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Teaching Program Detail page</p>
                    </div>
                    <div className="flex gap-20 items-center">
                        <Tooltip title="Cancel">
                            <img className='cursor-pointer' onClick={() => navigate('/feeds')} src={CancelIcon} alt="CancelIcon" />
                        </Tooltip>
                    </div>
                </div>


                <div className='feed-details'>
                    <div className="grid grid-cols-6 gap-7">
                        <div className='col-span-4'>
                            <div className='feed-info'>
                                <img className='feed-detail-image' src={FeedImage} alt="FeedImage" />
                                <div className='feed-action-info'>
                                    <div className='list-item'>
                                        <img src={LikeBlackIcon} alt="LikeBlackIcon" />
                                        <p>Like (20)</p>
                                    </div>
                                    <div className='list-item'>
                                        <img src={CommentIcon} alt="CommentIcon" />
                                        <p>Comment (20)</p>
                                    </div>
                                    <div className='list-item'>
                                        <img src={ShareIcon} alt="ShareIcon" />
                                        <p>Share (20)</p>
                                    </div>
                                </div>

                                <div className='post-details'>
                                    <h4 className='pb-5 font-semibold' style={{ color: 'rgba(0, 0, 0, 1)' }}>Teaching Program 1</h4>
                                    <p className='text-[12px] leading-6'>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumLorem ipsum dolor
                                        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                                    </p>
                                </div>


                                <div className='post-comments'>
                                    <h3>Post Comments(05)</h3>
                                    <div className='add-comments'>
                                        <img src={UserIcon} alt="UserIcon" />
                                        <input className='comment-input' type="text" placeholder='Add Comment...' />
                                    </div>
                                    <div>
                                        {
                                            postComments.map((postComment, index) =>
                                                <div className='post-list-comments' key={index}>
                                                    <img className='user-img' src={ChatImage} alt="Userimage" />
                                                    <div style={{ width: 'calc(100% - 50px)' }}>
                                                        <div className='flex gap-3 items-center py-1'>
                                                            <p className='text-[14px]'><span style={{ fontWeight: 700 }}>Johnson</span> ({postComment.type})</p>
                                                            <p className='text-[10px]'>2 Months ago</p>
                                                        </div>
                                                        <div className='py-5 my-2 text-[13px]' style={{ background: 'rgba(217, 217, 217, 0.15)', padding: '10px' }}>
                                                            {postComment.content}
                                                        </div>
                                                        <div className='flex gap-3 py-1'>
                                                            <div className='count-content'>
                                                                <img src={LikeIcon} alt="likeicon" />
                                                                <p>Like(10)</p>
                                                            </div>
                                                            <div className='count-content' style={{
                                                                background: 'rgba(255, 219, 225, 1)', color: 'rgba(243, 81, 109, 1)'
                                                            }}>
                                                                <img src={CommentRedIcon} alt="CommentRedIcon" />
                                                                <p>Comment(29)</p>
                                                            </div>
                                                            <div className='count-content' style={{
                                                                background: 'rgba(182, 249, 255, 1)', color: 'rgba(0, 174, 189, 1)'
                                                            }}>
                                                                <img src={ShareFeedbackIcon} alt="ShareFeedbackIcon" />
                                                                <p>Share(30)</p>
                                                            </div>
                                                            <div className='count-content' style={{
                                                                background: 'rgba(201, 239, 214, 1)', color: 'rgba(51, 161, 90, 1)'
                                                            }}>
                                                                <img src={ReplyFeedbackIcon} alt="ReplyFeedbackIcon" />
                                                                <p>Reply(40)</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            )
                                        }

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='col-span-2'>
                            <Programs />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
