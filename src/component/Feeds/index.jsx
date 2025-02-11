import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import SearchIcon from "../../assets/icons/SearchColor.svg";
import FeedImage from "../../assets/images/feed1.png";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import SuccessTik from "../../assets/images/blue_tik1x.png";
import MaleIcon from "../../assets/images/male-profile1x.png";
import FemaleIcon from "../../assets/images/female-profile1x.png";
import NoProgramImageBg from "../../assets/icons/noProgramImageBg.svg";
import NoProgramImageIcon from "../../assets/icons/noProgramImageIcon.svg";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SettingsModal from "./SettingsModal";
import CreatePostModal from "./CreatePostModal";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getPost } from "../../services/feeds";
import { Backdrop, CircularProgress } from "@mui/material";
import { feedStatus } from "../../utils/constant";
import { Icon } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "../../shared";
import { requestPageBreadcrumbs } from "../Breadcrumbs/BreadcrumbsCommonData";
import UserIcon from "../../assets/icons/user-icon.svg";

export default function Feeds() {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [pageSize, setPageSize] = useState(6);

  const defaultState = {
    create: false,
    settings: false,
    control: false,
    visibility: false,
  };
  const defaultForm = {
    visibility: "anyone",
    comment_control: "anyone",
    brand_partnership: false,
    is_published: true,
  };
  const [postModal, setPostModal] = useState({
    create: false,
    settings: false,
    control: false,
    visibility: false,
  });
  const [formData, setFormData] = useState({
    visibility: "anyone",
    comment_control: "anyone",
    brand_partnership: false,
    is_published: true,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { feeds, loading, status } = useSelector((state) => state.feeds);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    if (feeds) {
      setCurrentPage((prevState) => feeds.current_page);
      setPreviousPage((prevState) => feeds.previous);
      setTotalPages((prevState) => feeds.count);
      setPageSize((prevState) => feeds.page_size);
    }
  }, [feeds]);

  useEffect(() => {
    let feedData = {
      page: currentPage,
      pageSize: 6,
    };
    dispatch(getPost(feedData));
  }, [currentPage, pageSize]);

  // // console.log("---feeds---", feeds)
  // const feedList = [
  //   {
  //     name: 'Lorem ipsum dolor sit amet, consectetur',
  //     comment: '85M Views . 2 months ago',
  //   },
  //   {
  //     name: 'Lorem ipsum dolor sit amet, consectetur',
  //     comment: '85M Views . 2 months ago',
  //   },
  //   {
  //     name: 'Lorem ipsum dolor sit amet, consectetur',
  //     comment: '85M Views . 2 months ago',
  //   },
  //   {
  //     name: 'Lorem ipsum dolor sit amet, consectetur',
  //     comment: '85M Views . 2 months ago',
  //   },
  //   {
  //     name: 'Lorem ipsum dolor sit amet, consectetur',
  //     comment: '85M Views . 2 months ago',
  //   },
  // ];

  const handleClose = () => {
    setPostModal(defaultState);
  };

  const handleVisibilty = () => {
    setPostModal({ ...postModal, settings: true });
  };

  const handleSettingsBack = () => {
    setPostModal({ ...postModal, settings: false, create: true });
  };

  const handleSettingsData = (data) => {
    setFormData({ ...formData, ...data });
    setPostModal({ ...postModal, settings: false, create: true });
  };

  const handlePostData = (data) => {
    const apiData = {
      ...formData,
      ...data,
    };
    dispatch(createPost(apiData));
    setFormData(defaultForm);
  };

  const handleCreatePostPopup = () => {
    setPostModal({ create: true, visibility: false });
  };

  useEffect(() => {
    if (status === feedStatus.create) {
      handleClose();
      setTimeout(() => {
        dispatch(getPost());
      }, 2000);
    }
  }, [status]);

  // useEffect(() => {
  //   dispatch(getPost());
  // }, []);

  // console.log(formData);

  const onSubmit = (data) => {
    const formDatas = new FormData();

    console.log("data", data);

    if (data?.uploaded_files) {
      if (Array.isArray(data.uploaded_files)) {
        data.uploaded_files.forEach((file, index) => {
          formDatas.append("uploaded_files", file);
        });
      } else {
        formDatas.append("uploaded_files", data.uploaded_files[0]);
      }
    }

    formDatas.append("title", data.title);
    formDatas.append("content", data.content);
    formDatas.append("brand_partnership", formData.brand_partnership);
    formDatas.append("comment_control", formData.comment_control);
    formDatas.append("visibility", formData.visibility);
    formDatas.append("is_published", formData.is_published);

    console.log("formData", formDatas);

    console.log(formDatas);
    dispatch(createPost(formDatas));
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  // const renderPagination = () => {
  //   return (

  //   );
  // };

  return (
    <div className="feed-container px-4 py-6 sm:px-6 lg:px-9">
      <div
        className="px-6 pt-5 pb-12 sm:pb-24 lg:pb-56 mb-8"
        style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        <div className="flex flex-wrap justify-between items-center px-4 sm:px-5 pb-4 mb-8 border-b-2">
          <div>
            <p className="text-lg font-bold text-gray-800">Feed</p>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            {/* <img
              src={SearchIcon}
              alt="SearchIcon"
              className="cursor-pointer w-6 h-6"
            /> */}
            <Button
              btnName="Add Post"
              btnCls="w-[140px] sm:w-[170px]"
              onClick={handleCreatePostPopup}
            />
          </div>
        </div>

        {/* Backdrop for Loading */}
        <Backdrop sx={{ color: "#fff", zIndex: 99999 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Backdrop for Success Message */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={status === feedStatus.create}
        >
          <div className="px-4 sm:px-5 py-2 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-8 py-10 px-8 bg-white rounded-md shadow-lg">
              <img src={SuccessTik} alt="SuccessTik" />
              <p
                className="text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]"
                style={{
                  fontWeight: 600,
                }}
              >
                Your post is successfully uploaded
              </p>
            </div>
          </div>
        </Backdrop>

        {/* Post Modals */}
        {postModal.create && (
          <CreatePostModal
            register={register}
            handleSubmit={handleSubmit}
            formData={formData}
            errors={errors}
            reset={reset}
            setValue={setValue}
            getValues={getValues}
            open={postModal.create}
            handlePostData={onSubmit}
            handleClose={handleClose}
            handleVisibilty={handleVisibilty}
          />
        )}
        {postModal.settings && (
          <SettingsModal
            formData={formData}
            register={register}
            errors={errors}
            reset={reset}
            handleSubmit={handleSubmit}
            handleSettingsData={onSubmit}
            open={postModal.settings}
            handleClose={handleClose}
            handleSettingsBack={handleSettingsBack}
            handlePostData={handleSettingsData}
          />
        )}

        <div className="feeds-list">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
            {feeds &&
              feeds.results &&
              feeds.results.length > 0 &&
              feeds.results.map((feed, index) => {
                let imageUrl = feed?.image_url || "";

                if (imageUrl === "") {
                  // imageUrl = feed.gender === "male" ? MaleIcon : FemaleIcon;
                  imageUrl = UserIcon;
                }

                return (
                  <div
                    className="feed-card cursor-pointer"
                    key={index}
                    onClick={() =>
                      navigate(
                        `/feed-details/${feed.id}?breadcrumbsType=${requestPageBreadcrumbs.feed}`
                      )
                    }
                  >
                    {feed?.media_files?.length > 0 ? (
                      <img
                        className="feed-image h-[200px] sm:h-[250px] w-full object-cover rounded"
                        src={
                          feed?.media_files?.length > 0 &&
                          feed.media_files[0].media_files
                        }
                        alt="FeedImage"
                      />
                    ) : (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          className="feed-image  h-[200px] sm:h-[250px] w-full object-cover rounded"
                          src={NoProgramImageBg}
                          alt="Background"
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img src={NoProgramImageIcon} alt="Icon" />
                        </div>
                      </div>
                    )}
                    <div className="feed-content flex justify-between pt-4 sm:pt-5">
                      <div className="flex gap-3 items-center">
                        <img
                          className="user-image w-10 h-10"
                          src={imageUrl}
                          alt="UserIcon"
                        />
                        <div>
                          <p className="text-sm font-medium">{feed.title}</p>
                          <p className="text-xs text-gray-500">
                            {feed.post_view_count} . {feed.time_since_action}
                          </p>
                        </div>
                      </div>
                      <img
                        src={MoreIcon}
                        className="cursor-pointer w-5 h-5"
                        alt="MoreIcon"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end mt-8 sm:mt-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="py-2 px-4 sm:py-3 sm:px-6 border border-blue-500 rounded-lg text-blue-500 disabled:border-gray-400 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="py-2 px-4 sm:py-3 sm:px-6 border border-blue-500 rounded-lg text-blue-500 disabled:border-gray-400 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
