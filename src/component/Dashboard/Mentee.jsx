import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";

import UserInfoCard from "./UserInfoCard";

import SearchIcon from "../../assets/icons/search.svg";
import UserImage from "../../assets/images/user.jpg";
import MaleIcon from "../../assets/images/male-profile1x.png";
import FemaleIcon from "../../assets/images/female-profile1x.png";

import { pipeUrls } from "../../utils/constant";
import { programStatus } from "../../utils/constant";
import {
  getMenteeProgramCount,
  getMenteePrograms,
} from "../../services/userprograms";

import "./dashboard.css";
import UserIcon from "../../assets/icons/user-icon.svg";
import ProgramCard from "../../shared/Card/ProgramCard";
import GridViewIcon from "../../assets/icons/gridviewIcon.svg";
import ListViewIcon from "../../assets/icons/listviewIcon.svg";
import { programFeeds } from "../../utils/mock";
import Invite from "./Invite";
import api from "../../services/api";
import MuiModal from "../../shared/Modal";
import { CategoryPopup } from "./categoryPopup";
import CloseIcon from "../../assets/icons/blueCloseIcon.svg";
import { acceptMember, getCategory } from "../../services/category";
import { jwtDecode } from "jwt-decode";
import { FeedCard } from "./feedCard";
import { getPost } from "../../services/feeds";
import { getProgramPost } from "../../services/feeds";
import { requestPageBreadcrumbs } from "../Breadcrumbs/BreadcrumbsCommonData";
import { ProgramTableView } from "./ProgramTableView/ProgramTableView";
import { TopProgramsCard } from "../TopPrograms/TopProgramsCard";

export const Mentee = () => {
  const dispatch = useDispatch();
  const [searchParams,setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topMentotList, setTopMentorList] = useState([]);
  const [openCategory, setOpenCategory] = React.useState(false);
  const userpragrams = useSelector((state) => state.userPrograms);
  const userInfo = useSelector((state) => state.userInfo);
  const { feeds } = useSelector((state) => state.feeds);
  const token = localStorage.getItem("access_token");
  let decoded = jwtDecode(token);
  const [topPrograms, setTopPrograms] = useState([]);
  const [programView, setProgramView] = useState("grid");
  const categoryId = searchParams.get("category_id");
  const categoryIDParams=categoryId?`&category_id=${categoryId}`:""
  const categoryIDParamsAll=categoryId?`?category_id=${categoryId}`:""
  const currentType = searchParams.get("type");
  React.useEffect(() => {
    if (!decoded?.category_added && userInfo?.data?.userinfo?.approve_status==='accept') {
      setOpenCategory(true);
    }
  }, []);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  const role = userInfo.data.role;
  const handleViewChange = () => {
    setProgramView(programView === "grid" ? "list" : "grid");
  };

  const ImageComponent = (
      <img
      src={programView === "grid" ? ListViewIcon : GridViewIcon}
      className="cursor-pointer w-[17px] pt-[2px]"
      alt="viewicon"
      onClick={handleViewChange}
    />
    )
  const getPrograms = () => {
    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");
    const categoryFilter = searchParams.get("category_id");

    let query = {};

    if (filterType && filterType !== "") {
      query = { type: "status", value: filterType };
    }else{
      setSearchParams({ type: "yettojoin" });
      query = { type: "status", value: "yettojoin" };
    }

    if (isBookmark && isBookmark !== "") {
      query = { type: "is_bookmark", value: isBookmark };
    }

    if (categoryFilter && categoryFilter !== "") {
      query.category_id = categoryFilter;
    }

    dispatch(getMenteePrograms(query));
  };

  const getTopMentors = async () => {
    const topMentor = await api.get("rating/top_mentor");
    if (topMentor.status === 200 && topMentor.data?.results) {
      setTopMentorList(topMentor.data.results);
    }
  };
  const fetchTopPrograms = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await api.get("/rating/top_programs");
      console.log(response?.data?.results,"response?.data?.results")
      setTopPrograms(response?.data?.results);
    } catch (error) {
      console.error("Error fetching Top programs data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };
  useEffect(() => {
    if (role !== "" && userInfo?.data?.is_registered&&searchParams.get("type")) {
      getPrograms();
    }
  }, [searchParams, role]);

  useEffect(() => {
    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");
    let query = {};
    if (filterType && filterType !== "") {
      query = { type: "status", value: filterType };
    }else{
      setSearchParams({ type: "yettojoin" });
      query = { type: "status", value: "yettojoin" };
    }
    dispatch(getMenteeProgramCount());
    getTopMentors();
    fetchTopPrograms()
    if (
      filterType === null &&
      isBookmark === null &&
      userInfo?.data?.is_registered
    ) {
      dispatch(getMenteePrograms(query));
    }
  }, []);

  const handleNavigateDetails = (program) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(program).length) {
      const filterType = searchParams.get("type");
      if (program?.admin_assign_program) {
        navigate(
          `${baseUrl}/${program.id}?program_create_type=admin_program&breadcrumbsType=${requestPageBreadcrumbs.dashboardPrograms}`
        );
      } else {
        navigate(
          `${baseUrl}/${program.id}?breadcrumbsType=${requestPageBreadcrumbs.dashboardPrograms}`
        );
      }
    }
  };

  const handleBookmark = async (program) => {
    const is_admin_assign_program = program.hasOwnProperty(
      "admin_assign_program"
    );
    const payload = {
      [is_admin_assign_program ? "admin_program_id" : "program_id"]: program.id,
      marked: !program.is_bookmark,
    };
    setLoading(true);

    const bookmark = await api.post("bookmark", payload);
    if (bookmark.status === 201 && bookmark.data) {
      setLoading(false);
      getPrograms();
      if (role === "mentee") dispatch(getMenteeProgramCount());
    }
  };

  useEffect(() => {
    if (
      userpragrams.status === programStatus.bookmarked &&
      userInfo?.data?.is_registered
    ) {
      getPrograms();
    }
  }, [userpragrams.status]);

  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const [category, setCategory] = React.useState([]);

  const handleGetCategory = (searchText = "") => {
    const payload = {
      search: searchText,
    };
    dispatch(getCategory(payload)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setCategory(res?.payload ?? []);
      }
    });
  };

  const handleUpdateGategory = (type = "") => {
    let payload = {};
    if (type === "update") {
      payload = {
        type: "mentee_category",
        categories_id: selectedCategory,
      };
    } else {
      payload = {
        type: "mentee_category",
      };
    }
    dispatch(acceptMember(payload)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setOpenCategory(false);
        setCategory([]);
        localStorage.setItem("access_token", res?.payload?.access);
        localStorage.setItem("refresh_token", res?.payload?.refresh);
        getPrograms();
      }
    });
  };

  const handleSelectCategory = (value) => {
    if (selectedCategory.includes(value)) {
      // Remove the value if it's already selected
      setSelectedCategory(selectedCategory.filter((id) => id !== value));
    } else {
      // Add the value if it's not already selected
      setSelectedCategory([...selectedCategory, value]);
    }
  };

  // React.useEffect(() => {
  //   //   if (feedsList?.length === 0) {
  //   let feedData = {
  //     page: 1,
  //     pageSize: 5,
  //   };
  //   dispatch(getPost(feedData));
  //   //   }
  // }, []);
  React.useEffect(() => {
      //   if (feedsList?.length === 0) {
      let feedData = {
        page: 1,
        // pageSize: 5,
      };
      dispatch(getProgramPost(feedData));
      //   }
    }, []);

  return (
    <>
      <div className="dashboard-content px-8 mt-10">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={userpragrams.loading || loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {  !["new", "pending"].includes(userInfo?.data?.userinfo?.approve_status) &&
          <div className="grid grid-cols-5 gap-7">
          {/* <div className="col-span-5 sm:col-span-5 md:col-span-2 lg:col-span-1"> */}
          <div className="col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-1">
            <UserInfoCard />
              {topPrograms&&topPrograms?.length>0&&
                      <div className="mt-4">
                        <TopProgramsCard topProgramsList={topPrograms} role={role}/>
                      </div>}
            <div
              className="recent-request mt-4"
              style={{
                boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
                borderRadius: "10px",
              }}
            >
              <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                <div className="flex gap-4">
                  <div
                    className="card-dash"
                    style={{
                      background:
                        "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
                    }}
                  ></div>
                  <h4>Top Mentors</h4>
                </div>
                <div className="flex justify-center mt-2 mb-2">
                  <p
                    className="text-[12px] py-2 px-2 cursor-pointer"
                    style={{
                      background: "rgba(217, 228, 242, 1)",
                      color: "rgba(29, 91, 191, 1)",
                      borderRadius: "3px",
                    }}
                    onClick={() => navigate("/mentors?req=topmentor")}
                  >
                    View All
                  </p>
                </div>
              </div>

              <div className="content flex flex-col gap-2 py-2 px-2 overflow-x-auto">
                {topMentotList.map((recentReq, index) => {
                  let name = `${recentReq.first_name} ${recentReq.last_name}`;
                  return (
                    <div
                      key={index}
                      className="py-3 px-2 sm:px-2 md:px-2 lg:px-3 xl:px-3 cursor-pointer"
                      style={{
                        border: "1px solid rgba(29, 91, 191, 1)",
                        borderRadius: "10px",
                      }}
                      onClick={()=>navigate(`/mentor-details/${recentReq?.id}?fromType=topmentor&breadcrumbsType=${requestPageBreadcrumbs.dashboardtopmentor}`)}
                    >
                      <div
                        className="flex gap-2 pb-3"
                        style={{
                          borderBottom: "1px solid rgba(29, 91, 191, 1)",
                        }}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          {" "}
                          <img
                            src={recentReq?.profile_image || UserIcon}
                            alt="male-icon"
                             className="w-full h-full object-cover rounded-full"
                          />{" "}
                        </div>
                        <div className="flex flex-col gap-2">
                          <p
                            className="text-[12px]"
                            style={{
                              width: "100px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                            title={name}
                          >
                            {name}
                          </p>
                          <p className="text-[10px]">{recentReq.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-3">
                        <div className="flex items-center gap-1">
                          <span
                            className="lg:w-2 lg:h-2  rounded-full"
                            style={{ background: "rgba(29, 91, 191, 1)" }}
                          ></span>
                          <span className="text-[8px]">
                            Attended({recentReq.attended || 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className="lg:w-2 lg:h-2  rounded-full"
                            style={{ background: "rgba(0, 174, 189, 1)" }}
                          ></span>
                          <span className="text-[8px]">
                            Completed({recentReq.completed || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6">
              <Invite />
            </div>
          </div>

          {/* <div className="col-span-5 sm:col-span-5 md:col-span-3 lg:col-span-4"> */}
          <div className="col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-4">
          {programView === "grid" && (
                <>
            {/* {searchParams.get("type") === null &&
              searchParams.get("is_bookmark") === null && (
                <ProgramCard
                  title="All Programs"
                  viewpage={`/programs${categoryIDParamsAll}`}
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={userpragrams.allprograms}
                  loadProgram={getPrograms}
                  tableIcon={ImageComponent}
                />
              )} */}

            {(searchParams.get("type") === "yettojoin" ||
              searchParams.get("type") === "planned") && (
              <ProgramCard
                title="Active Programs"
                viewpage={`/programs?type=yettojoin${categoryIDParams}`}
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.yettojoin}
                tableIcon={ImageComponent}
                loadProgram={getPrograms}
              />
            )}

            {/* {searchParams.get("type") === "yettostart" && (
              <ProgramCard
                title="Recently Joined Programs"
                viewpage={`/programs?type=yettostart${categoryIDParams}`}
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.yettostart}
                tableIcon={ImageComponent}
                loadProgram={getPrograms}
              />
            )} */}

            {searchParams.get("type") === "inprogress" && (
              <ProgramCard
                title="Ongoing Programs"
                viewpage={`/programs?type=inprogress${categoryIDParams}`}
                handleNavigateDetails={handleNavigateDetails}
                handleBookmark={handleBookmark}
                programs={userpragrams.inprogress}
                tableIcon={ImageComponent}
                loadProgram={getPrograms}
              />
            )}
 </>
              )}
               {programView === "list" && (
                              <div>
                                <ProgramTableView
                                  title={searchParams.get("type") === null &&
                                    searchParams.get("is_bookmark") === null?"All Programs":
                                    searchParams.get("type") === "yettostart"
                                      ? "Recently Joined Programs"
                                      :searchParams.get("type") === "yettojoin" ||
                                  searchParams.get("type") === "planned"
                                      ? "Active Programs"
                                      : searchParams.get("type") === "inprogress"
                                      ? "Ongoing  Programs"
                                      : ""
                                  }
                                  viewpage={searchParams.get("type") === null &&
                                    searchParams.get("is_bookmark") === null?"/programs":
                                    searchParams.get("type") === "yettostart"
                                      ? "/programs?type=yettostart"
                                      :searchParams.get("type") === "yettojoin" ||
                                  searchParams.get("type") === "planned"
                                      ? "/programs?type=yettojoin"
                                      : searchParams.get("type") === "inprogress"
                                      ? "/programs?type=inprogress"
                                      : "/programs"
                                  }
                                  tableIcon={ImageComponent}
                                  programData={searchParams.get("type") === null &&
                                    searchParams.get("is_bookmark") === null?userpragrams.allprograms:
                                    searchParams.get("type") === "yettostart"
                                      ? userpragrams.yettostart
                                      :searchParams.get("type") === "yettojoin" ||
                                  searchParams.get("type") === "planned"
                                      ? userpragrams.yettojoin
                                      : searchParams.get("type") === "inprogress"
                                      ? userpragrams.inprogress
                                      : []}
                                  programView={programView}
                                  setProgramView={setProgramView}
                                />
                              </div>
                            )}
            <div className="mt-4">
              <div
                className="program-feeds"
                style={{
                  boxShadow: "4px 4px 15px 0px rgba(0, 0, 0, 0.05)",
                  borderRadius: "10px",
                }}
              >
                {/* <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                  <div className="flex gap-4">
                    <div
                      className="card-dash"
                      style={{
                        background:
                          "linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)",
                      }}
                    ></div>
                    <h4>Program Feeds</h4>
                  </div>
                  <div className="flex gap-4 items-center">
                    <img src={SearchIcon} alt="statistics" />
                    <p
                      className="text-[12px] py-2 px-2 cursor-pointer"
                      onClick={() => navigate("/feeds")}
                      style={{
                        background: "rgba(223, 237, 255, 1)",
                        borderRadius: "5px",
                      }}
                    >
                      View All
                    </p>
                  </div>
                </div> */}

                {/* <div className="content flex overflow-x-auto">
                  {feeds?.results?.map((programFeeds, index) => (
                    // <div
                    //   key={index}
                    //   style={{
                    //     border: '1px solid rgba(29, 91, 191, 1)',
                    //     borderRadius: '5px',
                    //   }}
                    //   className='program-feed-root mx-7 my-7'
                    // >
                    //   <div className='flex py-3 px-3 gap-4 w-[340px]'>
                    //     <img
                    //       src={UserImage}
                    //       className={`program-user-image ${
                    //         getWindowDimensions().width <= 1536
                    //           ? 'w-1/5'
                    //           : 'w-1/6'
                    //       } rounded-xl h-[100px]`}
                    //       style={{
                    //         height:
                    //           getWindowDimensions().width <= 1536
                    //             ? '90px'
                    //             : '100px',
                    //       }}
                    //       alt=''
                    //     />
                    //     <div className='feed-content flex flex-col gap-4'>
                    //       <h3>{programFeeds.title}</h3>
                    //       <h4 className='text-[12px]'>{programFeeds.desc}</h4>
                    //       <div className='flex gap-3'>
                    //         <span
                    //           style={{
                    //             background: 'rgba(238, 245, 255, 1)',
                    //             borderRadius: '30px',
                    //           }}
                    //           className='tags py-1 px-4 text-[13px]'
                    //         >
                    //           Tag
                    //         </span>
                    //         <span
                    //           style={{
                    //             background: 'rgba(238, 245, 255, 1)',
                    //             borderRadius: '30px',
                    //           }}
                    //           className='tags py-1 px-4 text-[13px]'
                    //         >
                    //           Tag
                    //         </span>
                    //         <span
                    //           style={{
                    //             background: 'rgba(238, 245, 255, 1)',
                    //             borderRadius: '30px',
                    //           }}
                    //           className='tags py-1 px-4 text-[13px]'
                    //         >
                    //           Tag
                    //         </span>
                    //       </div>
                    //     </div>
                    //   </div>
                    // </div>

                    <FeedCard programFeeds={programFeeds} />
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>}

        {
          ["new", "pending"].includes(userInfo?.data?.userinfo?.approve_status) &&
          <div className="programs-list !h-[100vh]">
            <div className="flex items-center justify-center h-full w-full flex-col gap-3">
              <p className="text-[24px] text-font-primary-main font-bold">
                Welcome to Mentoring Management Application
              </p>
              <p className="text-[18px] text-font-primary-main font-bold">
                Waiting for Admin Approval
              </p>
              <Invite />
            </div>
          </div>
        }
      </div>

      {/* category Popup */}
      <MuiModal
        modalOpen={openCategory}
        modalClose={() => setOpenCategory(false)}
        noheader
        padding={0}
        modalSize="md"
      >
        <Stack
          p={"12px 18px"}
          className="border-b border-[#D9E4F2]"
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography>Select Category</Typography>
          <div onClick={() => setOpenCategory(false)}>
            <img src={CloseIcon} />
          </div>
        </Stack>
        <CategoryPopup
          category={category}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleGetCategory={handleGetCategory}
          handleUpdateGategory={handleUpdateGategory}
          handleSelectCategory={handleSelectCategory}
        />
      </MuiModal>
    </>
  );
};
