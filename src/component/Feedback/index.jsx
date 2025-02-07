import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";

import FeedbackIcon from "../../assets/icons/feedback.svg";
import CalenderIcon from "../../assets/icons/CalenderIcon.svg";
import SearchIcon from "../../assets/icons/SearchColor.svg";
import ChatImage from "../../assets/images/chatimage.png";
import LikeIcon from "../../assets/icons/like.svg";
import LikeWhiteIcon from "../../assets/icons/LikeWhite.svg";
import CommentWhiteIcon from "../../assets/icons/CommentWhite.svg";
import UserIcon from "../../assets/icons/user-icon.svg";
import CommentIcon from "../../assets/icons/feedbackComment.svg";
import ShareFeedbackIcon from "../../assets/icons/ShareFeedback.svg";
import ReplyFeedbackIcon from "../../assets/icons/ReplyFeedback.svg";

import MoreIcon from "../../assets/icons/moreIcon.svg";
// import UserIcon from "../../assets/images/user.jpg";

import {
  getPost,
  getRecentPosts,
  getFeedTrack,
  postCommentLike,
  postComment,
} from "../../services/feeds";

import { PostList, RecentDiscussion } from "../../mock";
import ReadableDate from "../../shared/ReadableDateTime";
import { Button } from "../../shared";






export default function Feedback() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activePost, setActivePost] = useState(0);
  const [activePostInfo, setActivePostInfo] = useState(null);
  const { recentPosts, feeds, feedTrack, loading, status } = useSelector(
    (state) => state.feeds
  );
  const [replyInfo, setReplyInfo] = useState({ id: "", msg: "" });

  const [activePostComments, setActivePostComments] = useState({
    commentId: null,
  });
  // const [activePostCommentsReplies, setActivePostCommentsReplies] = useState({
  //   commentId: null
  // })
const [activeComment,setActiveComment] = useState('')
  const [showComments,setShowComments]  = useState(false)
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleReply = (commendId) => {
    setReplyInfo({ id: commendId, msg: "" });
  };

  const handleCancelReplyComment = () => {
    setReplyInfo({ id: "", msg: "" });
  };

  const handleReplyComment = () => {
    dispatch(
      postComment({
        parent_comment_id: replyInfo.id,
        content: replyInfo.msg,
      })
    )
      .then(() => {
        handleCancelReplyComment();
        dispatch(getPost());
      })
      .catch((error) => {
        console.error("Failed to post comment:", error);
      });
  };

  useEffect(() => {
    dispatch(getPost());
    dispatch(getRecentPosts());
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activePostInfo) {
        dispatch(getFeedTrack(activePostInfo.id));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [activePostInfo, dispatch]);

  const handleCommentLike = (type, id) => {
    // const tempActivePost = activePost;
    const payload = type === "post" ? { post_id: id } : { comment_id: id };
    dispatch(postCommentLike(payload)).then(() => {
      dispatch(getPost());
      setActivePost(activePost ?? 0);
    });
  };

  useEffect(() => {
    if (feeds?.results?.length > 0) {
      setActivePost(activePost ?? 0);
      setActivePostInfo(feeds.results[activePost ?? 0]);
    }
  }, [feeds]);

  const handlePostClick = (list, index) => {
    setActivePost(index);
    setActivePostInfo(list);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewReplies = (commentId) => {
    setActivePostComments((prevState) => ({
      commentId: prevState.commentId === commentId ? null : commentId,
    }));
  };

  console.log('feeds',feeds)


  const displayCommentBtns = (
    replyData,rIndex,marginLeft) =>{
    return  <>
            <div
              className={`post-list-comments ml-${marginLeft} mt-4`}
              key={rIndex}
            >
              <img
                className="user-img"
                src={ChatImage}
                alt="Userimage"
              />
              <div
                style={{
                  width:
                    "calc(100% - 50px)",
                }}
              >
                <div className="flex gap-3 items-center py-1">
                  <p className="text-[14px] capitalize">
                    <span
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {replyData.user_name}
                    </span>{" "}
                    ({replyData.role})
                  </p>
                  <p className="text-[10px]">
                    {
                      replyData.time_since_action
                    }
                  </p>
                </div>
                <div
                  className="py-5 my-2 text-[13px]"
                  style={{
                    background:
                      "rgba(217, 217, 217, 0.15)",
                    padding: "10px",
                  }}
                >
                  {replyData.content}
                </div>
              </div>
            </div>
            <div className={`flex gap-3 py-1 ml-${marginLeft}`}>
              <div
                className="count-content cursor-pointer"
                onClick={() =>
                  handleCommentLike(
                    "comment",
                    replyData.id
                  )
                }
              >
                <img
                  src={LikeIcon}
                  alt="likeicon"
                />
                <p>
                  Like{" "}
                  {/* {replyData.like_count > 0
                    ? `(${replyData.like_count})`
                    : null} */}
                </p>
              </div>
           {  replyData?.comment_count>0 && <div
                                          className="count-content"
                                          style={{
                                            background:
                                              "rgba(255, 219, 225, 1)",
                                            color: "rgba(243, 81, 109, 1)",
                                          }}
                                        >
                                          <img
                                            src={CommentIcon}
                                            alt="CommentIcon"
                                          />
                                          <p>
                                            Comment(
                                            {replyData?.comment_count})
                                          </p>
                                        </div>
  }
              {/* <div
                className="count-content cursor-pointer"
                style={{
                  color:
                    "rgba(0, 174, 189, 1)",
                }}
              >
                <img
                  src={ShareFeedbackIcon}
                  alt="ShareFeedbackIcon"
                />
                <p>Share</p>
              </div> */}
              <div
                className="count-content cursor-pointer"
                style={{
                  background:'#C9EFD6',
                  color:
                    "rgba(51, 161, 90, 1)",
                }}
                onClick={() =>
                  handleReply(replyData.id)
                }
              >
                <img
                  src={ReplyFeedbackIcon}
                  alt="ReplyFeedbackIcon"
                />
                <p>
                  Reply
                  {/* {replyData.replies
                    .length > 0
                    ? `(${replyData.replies.length})`
                    : null} */}
                </p>
              </div>
            </div>
  
            {replyInfo.id ===
              replyData.id && (
              <>
                <div className="add-comments relative">
                  {/* <img
                    src={imageUrl}
                    alt="UserIcon"
                  /> */}
                  <input
                    className={`py-3 pl-1 my-2 text-[13px] ml-${marginLeft} border-none w-full`}
                    type="text"
                    value={replyInfo.msg}
                    placeholder="Add Reply..."
                    onChange={(e) =>
                      setReplyInfo({
                        ...replyInfo,
                        msg: e.target.value,
                      })
                    }
                  />
                </div>
  
                <div className="flex gap-2 justify-end">
                  <button
                    btnType="button"
                    btnCls="w-[150px]"
                    className="w-[100px] p-[4px] !border !border-background-primary-main rounded-[3px] h-[30px] text-[12px] text-font-primary-main"
                    btnName={"Cancel"}
                    onClick={
                      handleCancelReplyComment
                    }
                  >Cancel</button>
                  <button
                    btnType="button"
                    btnCls="w-[150px]"
                    btnName={"Reply"}
                    className="w-[100px] p-[4px] !border !border-background-primary-main rounded-[3px] h-[30px] text-[12px] text-font-secondary-white"
                    btnCategory="primary"
                    onClick={
                      handleReplyComment
                    }
                    style={{background:'linear-gradient(to right, #00AEBD, #1D5BBF'}}
                  >Reply</button>
                </div>
              </>
            )}
          </>
  }

  const getCommentsData  = (comment) =>{
   return comment?.replies.map((reply,index)=>{
    let elements=null;
     let marginLeft = 7;
    elements =   displayCommentBtns(reply,index,marginLeft);
     if(reply?.replies?.length>0){
      elements =  getCommentsData(reply,marginLeft*2)
     }
     return elements;
    })
 }
  
const onCommentClick  = (comment) =>{

  if(comment?.id){
    setActiveComment(comment?.id);
    if(activeComment===comment?.id){
      setShowComments(!showComments)
    }
  }
}
  return (
    <div className="feedback px-2 py-9 sm:px-2 md:px-4 lg:px-9 xl:px-9">
      <div
        className="px-3 py-5"
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        <div className="flex justify-between px-5 pb-4 mb-8 items-center border-b-2">
          <div className="flex w-full gap-5 items-center justify-between">
            <p style={{ color: "rgba(24, 40, 61, 1)", fontWeight: 700 }}>
              Feedback
            </p>
            {/* <img
              className='cursor-pointer'
              src={FeedbackIcon}
              alt={'FeedbackIcon'}
            /> */}
          </div>
        </div>
        <div className="feedback-content">
          {/* <div className='feedback-action'>
            <div className='relative'>
              <input
                type='text'
                className='block w-full p-2 text-sm text-gray-900 border-none'
                placeholder='Search feedback'
                style={{
                  background: 'rgba(238, 245, 255, 1)',
                  height: '55px',
                  width: '400px',
                  borderRadius: '6px',
                }}
              />
              <div className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'>
                <img src={SearchIcon} alt='SearchIcon' />
              </div>
            </div>

            <div
              className='relative flex gap-3 py-3 px-3'
              style={{
                border: '1px solid rgba(24, 40, 61, 0.25)',
                background: 'rgba(238, 245, 255, 1)',
                borderRadius: '3px',
              }}
            >
              <img src={CalenderIcon} alt='CalenderIcon' />
              <select
                className='focus:outline-none'
                style={{ background: 'rgba(238, 245, 255, 1)' }}
              >
                <option>Month</option>
                <option>Week</option>
                <option>Day</option>
              </select>
            </div>
          </div> */}

          <div className="feedback-info">
            <div className="grid grid-cols-6 gap-7 py-5">
              <div className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-4">
                <div
                  className="post-content"
                  style={{
                    boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="grid grid-cols-5">
                    <div className="list-post col-span-5 sm:col-span-5 md:col-span-2 lg:col-span-2 xl:col-span-2 ">
                      <div className="title flex justify-between py-3 px-4 br-bt-blue">
                        <h4 className="text-base">Post</h4>
                        {/* <pn className="text-sm leading-8">View All</pn> */}
                      </div>

                      {feeds &&
                        feeds?.results &&
                        feeds?.results?.length > 0 &&
                        feeds?.results?.map((list, index) => (
                          <div
                            className={`post-info ${
                              activePost === index ? "active" : ""
                            }`}
                            key={index}
                            onClick={() => handlePostClick(list, index)}
                          >
                            <div className="program-name py-1">
                              {list.user_name}
                            </div>
                            <p className="text-[12px] py-1">{list.content}</p>
                            <div className="flex gap-3 py-1">
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    activePost === index
                                      ? LikeWhiteIcon
                                      : LikeIcon
                                  }
                                  alt="likeicon"
                                />
                                <span className="like-count text-[14px]">
                                  ({list.like_post_counts})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    activePost === index
                                      ? CommentWhiteIcon
                                      : CommentIcon
                                  }
                                  alt="CommentIcon"
                                />
                                <span className="comment-count text-[14px]">
                                  ({list.comment_count})
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {activePostInfo && (
                      <div className="post-program-detail list-post col-span-5 sm:col-span-5 md:col-span-3 lg:col-span-3 xl:col-span-3">
                        <div className="title flex justify-between py-3 px-4 br-bt-blue">
                          <h4 className="text-base">
                            {activePostInfo.user_name}
                          </h4>

                          {/* <div
                            className="cursor-pointer flex items-center h-full"
                            onClick={(e) => handleClick(e)}
                          >
                            <img src={MoreIcon} alt="MoreIcon" />
                          </div> */}
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            <MenuItem
                              onClick={handleClose}
                              className="!text-[12px]"
                            >
                              More form this Program
                            </MenuItem>
                            <MenuItem
                              onClick={handleClose}
                              className="!text-[12px]"
                            >
                              Remove this feedback
                            </MenuItem>
                          </Menu>
                        </div>

                        <div className="post-details">
                          {/* <img
                            className="user-img"
                            src={
                              activePostInfo.image_url
                                ? activePostInfo.image_url
                                : UserIcon
                            }
                            alt="Userimage"
                          /> */}
                          <div
                            style={{ width: "calc(100% - 50px)" }}
                            className="relative"
                          >
                            <div className="comments-section">
                              {activePostInfo?.comments &&
                                activePostInfo?.comments?.length > 0 &&
                                activePostInfo?.comments?.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="comment-details pb-[20px]"
                                  >
                                    <img
                                      className="user-img"
                                      src={
                                        comment.image_url
                                          ? comment.image_url
                                          : UserIcon
                                      }
                                      alt="Userimage"
                                    />
                                    <div style={{ width: "calc(100% - 50px)" }}>
                                      <div className="flex justify-between py-1">
                                        <p className="text-[14px]">
                                          <span style={{ fontWeight: 700 }}>
                                            {comment.user_name}
                                          </span>
                                          &nbsp; ({comment.role})
                                        </p>
                                        <p className="text-[10px]">
                                          {comment.time_since_action}
                                        </p>
                                      </div>
                                      <div
                                        className="py-5 my-2 text-[13px]"
                                        style={{
                                          background:
                                            "rgba(217, 217, 217, 0.15)",
                                          padding: "10px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleViewReplies(comment.id)
                                        }
                                      >
                                        {comment.content}
                                      </div>
                                      <div className="flex gap-3 py-1">
                                        <div
                                          className="count-content cursor-pointer"
                                          onClick={() =>
                                            handleCommentLike(
                                              "comment",
                                              comment.id
                                            )
                                          }
                                        >
                                          <img src={LikeIcon} alt="likeicon" />
                                          <p>Like({comment.like_count})</p>
                                        </div>
                                        <div
                                          className="count-content cursor-pointer"
                                          onClick={()=>onCommentClick(comment)}
                                          style={{
                                            background:
                                              "rgba(255, 219, 225, 1)",
                                            color: "rgba(243, 81, 109, 1)",
                                          }}
                                        >
                                          <img
                                            src={CommentIcon}
                                            alt="CommentIcon"
                                          />
                                          <p>
                                            Comment(
                                            {activePostInfo.comment_count})
                                          </p>
                                        </div>
                                        <div
                                          className="count-content"
                                          style={{
                                            background:'#C9EFD6',
                                            color: "rgba(51, 161, 90, 1)",
                                            cursor:'pointer'
                                          }}
                                          onClick={() =>
                                            handleReply(comment.id)
                                          }
                                        >
                                          <img
                                            src={ReplyFeedbackIcon}
                                            alt="ReplyIcon"
                                          />
                                         
                                          <p>Replies({comment.reply_count})</p>
                                        </div>
                                        {/* <div
                                          className="count-content cursor-pointer"
                                          style={{
                                            color: "rgba(51, 161, 90, 1)",
                                          }}
                                          onClick={() =>
                                            handleReply(postComment.id)
                                          }
                                        >
                                          <img
                                            src={ReplyFeedbackIcon}
                                            alt="ReplyFeedbackIcon"
                                          />
                                          <p>
                                            Reply
                                            {postComment.replies.length > 0
                                              ? `(${postComment.replies.length})`
                                              : null}
                                          </p>
                                        </div> */}
                                      </div>

                                      {replyInfo.id === comment.id && (
                                        <>
                                          <div className="add-comments relative">
                                            <input
                                              className="comment-input w-full p-2 m-3 border rounded-md"
                                              type="text"
                                              value={replyInfo.msg}
                                              placeholder="Add Reply..."
                                              onChange={(e) =>
                                                setReplyInfo({
                                                  ...replyInfo,
                                                  msg: e.target.value,
                                                })
                                              }
                                            />
                                          </div>

                                          <div className="flex gap-2 justify-end">
                                            <button
                                              btnType="button"
                                              className="w-[100px] p-[4px] !border !border-background-primary-main rounded-[3px] h-[30px] text-[12px] text-font-primary-main"
                                              btnName={"Cancel"}
                                              onClick={handleCancelReplyComment}
                                              btnCategory ='secondary'
                                            >{"Cancel"}</button>
                                            <button
                                              btnType="button"
                                               className="w-[100px] p-[4px] !border !border-background-primary-main rounded-[3px] h-[30px] text-[12px] text-font-secondary-white"
                                              btnName={"Reply"}
                                              btnCategory="primary"
                                              onClick={handleReplyComment}
                                              style={{background:'linear-gradient(to right, #00AEBD, #1D5BBF'}}
                                            >Reply</button>
                                          </div>
                                        </>
                                      )}

                                      {comment?.replies?.length > 0 && showComments&& activeComment===comment.id &&
                                         getCommentsData(comment)
                                        }
                                      {activePostComments.commentId ===
                                        comment?.id &&
                                        comment?.replies &&
                                        comment?.replies?.length > 0 && (
                                          <div
                                            className="replies-section"
                                            style={{
                                              marginLeft: "20px",
                                              marginTop: "10px",
                                            }}
                                          >
                                            {comment?.replies &&
                                              comment?.replies?.length > 0 &&
                                              comment?.replies?.map((reply) => (
                                                <div
                                                  key={reply.id}
                                                  className="reply-details"
                                                >
                                                  <img
                                                    className="user-img"
                                                    src={
                                                      reply.image_url
                                                        ? reply.image_url
                                                        : UserIcon
                                                    }
                                                    alt="Reply User Image"
                                                  />
                                                  <div
                                                    style={{
                                                      width:
                                                        "calc(100% - 50px)",
                                                    }}
                                                  >
                                                    <div className="flex justify-between py-1">
                                                      <p className="text-[14px]">
                                                        <span
                                                          style={{
                                                            fontWeight: 700,
                                                          }}
                                                        >
                                                          {reply.user_name}
                                                        </span>
                                                        ({reply.role},{" "}
                                                        {reply.gender})
                                                      </p>
                                                      <p className="text-[10px]">
                                                        {
                                                          reply.time_since_action
                                                        }
                                                      </p>
                                                    </div>
                                                    <div
                                                      className="py-2 text-[13px]"
                                                      style={{
                                                        background:
                                                          "rgba(235, 235, 235, 0.15)",
                                                        padding: "8px",
                                                      }}
                                                    >
                                                      {reply.content}
                                                    </div>
                                                    <div className="flex gap-3 py-1">
                                                      <div className="count-content">
                                                        <img
                                                          src={LikeIcon}
                                                          alt="likeicon"
                                                        />
                                                        <p>
                                                          Like(
                                                          {reply.like_count})
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div className="">
                              <input type="text" className="absolute" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-2 xl:col-span-2 ">
                <div
                  className="recent-discussion pb-3"
                  style={{
                    boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="title flex justify-between py-3 px-4 border-b-2">
                    <h4 className="text-base">Recent View</h4>
                    {/* <p className="text-sm leading-8">View All</p> */}
                  </div>

                  <div className="chat-discussions">
                    {feedTrack &&
                      feedTrack.results &&
                      feedTrack.results.length > 0 &&
                      feedTrack.results.map((ft) => (
                        <div className="chat-user-info" key={String(ft.id)}>
                          <div className="user-details gap-3">
                            <img
                              src={ft.image_url ? ft.image_url : UserIcon}
                              alt="ChatImage"
                            />
                            <div>
                              <p>{ft.username}</p>
                            </div>
                          </div>

                          <div className="text-[12px]">
                            {ft.viewed_at ? (
                              <ReadableDate timestamp={ft.viewed_at} />
                            ) : null}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
