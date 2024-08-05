import React, { useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import FeedbackIcon from '../../assets/icons/feedback.svg'
import CalenderIcon from '../../assets/icons/CalenderIcon.svg'
import SearchIcon from '../../assets/icons/SearchColor.svg'
import ChatImage from '../../assets/images/chatimage.png'
import LikeIcon from '../../assets/icons/like.svg'
import LikeWhiteIcon from '../../assets/icons/LikeWhite.svg'
import CommentWhiteIcon from '../../assets/icons/CommentWhite.svg'
import CommentIcon from '../../assets/icons/feedbackComment.svg'
import ShareFeedbackIcon from '../../assets/icons/ShareFeedback.svg'
import ReplyFeedbackIcon from '../../assets/icons/ReplyFeedback.svg'
import MoreIcon from '../../assets/icons/moreIcon.svg'

import { PostList, RecentDiscussion } from '../../mock'

export default function Feedback() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [activePost, setActivePost] = useState(0)
    const [activePostInfo, setActivePostInfo] = useState(PostList[0])

    const open = Boolean(anchorEl);

    const handlePostClick = (list, index) => {
        setActivePost(index)
        setActivePostInfo(list)
    }


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="feedback px-9 py-9">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex w-full gap-5 items-center justify-between'>
                        <p style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 700 }}>Feedback</p>
                        <img className='cursor-pointer' src={FeedbackIcon} alt={'FeedbackIcon'} />
                    </div>
                </div>
                <div className='feedback-content'>

                    <div className='feedback-action'>
                        <div className="relative">
                            <input type="text" className="block w-full p-2 text-sm text-gray-900 border-none"
                                placeholder="Search feedback" style={{
                                    background: 'rgba(238, 245, 255, 1)',
                                    height: '55px',
                                    width: '400px',
                                    borderRadius: '6px'
                                }} />
                            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                                <img src={SearchIcon} alt='SearchIcon' />
                            </div>
                        </div>

                        <div className="relative flex gap-3 py-3 px-3"
                            style={{ border: '1px solid rgba(24, 40, 61, 0.25)', background: 'rgba(238, 245, 255, 1)', borderRadius: '3px' }}>
                            <img src={CalenderIcon} alt="CalenderIcon" />
                            <select className='focus:outline-none' style={{ background: 'rgba(238, 245, 255, 1)' }}>
                                <option>Month</option>
                                <option>Week</option>
                                <option>Day</option>
                            </select>
                        </div>

                    </div>


                    <div className='feedback-info'>

                        <div className="grid grid-cols-6 gap-7 py-5">
                            <div className="col-span-4">
                                <div className="post-content" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                                    <div className="grid grid-cols-5">
                                        <div className='list-post col-span-2'>
                                            <div className="title flex justify-between py-3 px-4 br-bt-blue">
                                                <h4 className="text-base">Post</h4>
                                                <p className="text-sm leading-8">View All</p>
                                            </div>

                                            {
                                                PostList.map((list, index) =>

                                                    <div className={`post-info ${activePost === index ? 'active' : ''}`} key={index} onClick={() => handlePostClick(list, index)}>

                                                        <div className='program-name py-1'>
                                                            {list.name}
                                                        </div>
                                                        <p className='text-[12px] py-1'>
                                                            {list.message}
                                                        </p>
                                                        <div className='flex gap-3 py-1'>
                                                            <div className='flex items-center gap-2'>
                                                                <img src={activePost === index ? LikeWhiteIcon : LikeIcon} alt="likeicon" />
                                                                <span className='like-count text-[14px]'>({list.likeCount})</span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <img src={activePost === index ? CommentWhiteIcon : CommentIcon} alt="CommentIcon" />
                                                                <span className='comment-count text-[14px]'>({list.commentCount})</span>
                                                            </div>
                                                        </div>

                                                    </div>)
                                            }

                                        </div>
                                        <div className='post-program-detail list-post col-span-3'>


                                            <div className="title flex justify-between py-3 px-4 br-bt-blue">
                                                <h4 className="text-base">{activePostInfo.name}</h4>

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
                                                    <MenuItem onClick={handleClose} className='!text-[12px]'>

                                                        More form this Program
                                                    </MenuItem>
                                                    <MenuItem onClick={handleClose} className='!text-[12px]'>

                                                        Remove this feedback
                                                    </MenuItem>
                                                </Menu>
                                            </div>

                                            <div className='post-details'>
                                                <img className='user-img' src={ChatImage} alt="Userimage" />
                                                <div>
                                                    <div className='flex justify-between py-1'>
                                                        <p className='text-[14px]'><span style={{ fontWeight: 700 }}>Johnson</span> ({activePostInfo.type})</p>
                                                        <p className='text-[10px]'>{activePostInfo.posted}</p>
                                                    </div>
                                                    <div className='py-5 my-2 text-[13px]' style={{ background: 'rgba(217, 217, 217, 0.15)', padding: '10px' }}>
                                                        {activePostInfo.message}
                                                    </div>
                                                    <div className='flex gap-3 py-1'>
                                                        <div className='count-content'>
                                                            <img src={LikeIcon} alt="likeicon" />
                                                            <p>Like({activePostInfo.likeCount})</p>
                                                        </div>
                                                        <div className='count-content' style={{
                                                            background: 'rgba(255, 219, 225, 1)', color: 'rgba(243, 81, 109, 1)'
                                                        }}>
                                                            <img src={CommentIcon} alt="CommentIcon" />
                                                            <p>Comment({activePostInfo.commentCount})</p>
                                                        </div>
                                                        <div className='count-content' style={{
                                                            background: 'rgba(182, 249, 255, 1)', color: 'rgba(0, 174, 189, 1)'
                                                        }}>
                                                            <img src={ShareFeedbackIcon} alt="ShareFeedbackIcon" />
                                                            <p>Share({activePostInfo.shareCount})</p>
                                                        </div>
                                                        <div className='count-content' style={{
                                                            background: 'rgba(201, 239, 214, 1)', color: 'rgba(51, 161, 90, 1)'
                                                        }}>
                                                            <img src={ReplyFeedbackIcon} alt="ReplyFeedbackIcon" />
                                                            <p>Reply({activePostInfo.replyCount})</p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col-span-2'>
                                <div className="recent-discussion pb-3" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                                    <div className="title flex justify-between py-3 px-4 border-b-2">
                                        <h4 className="text-base">Recent Discussion</h4>
                                        <p className="text-sm leading-8">View All</p>
                                    </div>

                                    <div className='chat-discussions'>


                                        {
                                            RecentDiscussion.map(discussion =>
                                                <div className='chat-user-info' key={discussion.id}>
                                                    <div className='user-details gap-3'>
                                                        <img src={ChatImage} alt="ChatImage" />
                                                        <div>
                                                            <p>{discussion.name}</p>
                                                            <span className='text-[12px]'>{discussion.message}</span>
                                                        </div>
                                                    </div>

                                                    <div className='text-[12px]'>
                                                        {discussion.posted}
                                                    </div>
                                                </div>


                                            )
                                        }



                                    </div>
                                </div>

                            </div>



                        </div>


                    </div>

                </div>

            </div>
        </div >
    )
}
