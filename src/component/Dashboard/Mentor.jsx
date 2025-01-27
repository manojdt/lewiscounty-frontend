import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import RecentRequests from "./RecentRequests";
import Programs from "./Programs";
import Invite from "./Invite";
import { programActionStatus, programStatus } from "../../utils/constant";
import {
  chartProgramList,
  getProgramCounts,
  getUserPrograms,
} from "../../services/userprograms";
import UserIcon from "../../assets/icons/user-icon.svg";

import { pipeUrls } from "../../utils/constant";
import "./dashboard.css";
import UserInfoCard from "./UserInfoCard";
import ProgramCard from "../../shared/Card/ProgramCard";
import api from "../../services/api";
import { getUserProfile } from "../../services/profile";
import ProgramFeeds from "../../shared/ProgramFeeds";
import { getPost } from "../../services/feeds";
import { requestPageBreadcrumbs } from "../Breadcrumbs/BreadcrumbsCommonData";
import MaleIcon from "../../assets/images/male-profile1x.png";
import FemaleIcon from "../../assets/images/female-profile1x.png";

export const Mentor = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [topMentotList, setTopMentorList] = useState([]);
  const { programRequest } = useSelector((state) => state.requestList);
  const userpragrams = useSelector((state) => state.userPrograms);
  const userInfo = useSelector((state) => state.userInfo);
  const { feeds } = useSelector((state) => state.feeds);

  const handlePerformanceFilter = (e) => {
    const res = e?.target?.value || "date";
    dispatch(chartProgramList(res));
  };

  const getPrograms = () => {
    let query = {};
    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");
    const categoryFilter = searchParams.get("category_id");
    if (filterType && filterType !== "") {
      query = { type: "status", value: filterType };
    }

    if (isBookmark && isBookmark !== "") {
      query = { type: "is_bookmark", value: isBookmark };
    }

    if (categoryFilter && categoryFilter !== "") {
      query.category_id = categoryFilter;
    }
    dispatch(getUserPrograms(query));
  };

  const handleNavigateDetails = (programdetails) => {
    let baseUrl = pipeUrls.programdetails;
    if (Object.keys(programdetails).length) {
      navigate(
        `${baseUrl}/${programdetails?.id ?? programdetails.program}${
          programdetails?.admin_program_request_id
            ? `?request_id=${programdetails?.admin_program_request_id}&type=admin_assign_program`
            : "admin_assign_program" in programdetails
            ? `?program_create_type=admin_program`
            : ""
        }`
      );
    }
  };

  const handleBookmark = async (program) => {
    const payload = {
      program_id: program.id,
      marked: !program.is_bookmark,
    };
    setLoading(true);

    const bookmark = await api.post("bookmark", payload);
    if (bookmark.status === 201 && bookmark.data) {
      setLoading(false);
      getPrograms();
      dispatch(getProgramCounts());
    }
  };

  useEffect(() => {
    handlePerformanceFilter();
    // dispatch(getUserProfile()).then((res)=>{
    //   if(res?.meta?.requestStatus === "fulfilled"){
    //     console.log("sdjsjdflsldnf ===>", res)
    //     if(res?.payload?.approve_status === "accept"){
    //       dispatch(updateToken()).then((response) => {
    //         console.log("res from updateToken ===>", response)
    //         localStorage.setItem("access_token", response.payload.data.access);
    //         localStorage.setItem("refresh_token", response.payload.data.refresh);
    //         dispatch(getUserProfile())
    //       });
    //     }
    //   }
    // })
  }, []);

  useEffect(() => {
    const fetchAndUpdateTokens = async () => {
      try {
        // Initial API call to get the user profile
        const res = await dispatch(getUserProfile()).unwrap(); // Use .unwrap() for cleaner promise handling

        if (res?.approve_status === "accept") {
          const updateToken = await api.post("generate_new_token", {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (updateToken.status === 200) {
            localStorage.setItem("access_token", updateToken.data.access);
            localStorage.setItem("refresh_token", updateToken.data.refresh);
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error during profile or token update:", error);
      }
    };

    fetchAndUpdateTokens();
  }, [dispatch]); // Added dispatch to dependencies for better practice

  useEffect(() => {
    getPrograms();
  }, [searchParams]);

  useEffect(() => {
    const filterType = searchParams.get("type");
    const isBookmark = searchParams.get("is_bookmark");
    dispatch(getProgramCounts());
    if (filterType === null && isBookmark === null) {
      dispatch(getUserPrograms({}));
    }
  }, []);

  useEffect(() => {
    if (userpragrams.status === programStatus.bookmarked) {
      getPrograms();
    }
  }, [userpragrams.status]);

  React.useEffect(() => {
    //   if (feedsList?.length === 0) {
    let feedData = {
      page: 1,
      pageSize: 5,
    };
    dispatch(getPost(feedData));
    getTopMentors();
    //   }
  }, []);

  const getTopMentors = async () => {
    const topMentor = await api.get("rating/top_mentor");
    if (topMentor.status === 200 && topMentor.data?.results) {
      setTopMentorList(topMentor.data.results);
    }
  };

  return (
    <>
      <div className="dashboard-content px-8 mt-10">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={userpragrams.loading || loading}
        >
          {<CircularProgress color="inherit" />}
        </Backdrop>

        <div
          className={
            userInfo?.data?.userinfo?.approve_status === "accept"
              ? "main-grid grid grid-cols-5 gap-3"
              : "w-full"
          }
        >
          {userInfo?.data?.userinfo?.approve_status === "accept" && (
            <div className="left-bar col-span-5 sm:col-span-5 md:col-span-2 lg:col-span-1">
              <UserInfoCard />
              {/* <ViewImpression /> */}
              {/* <RecentActivities /> */}
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
                        className="py-3 px-3 cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-all duration-300"
                        style={{
                          border: "1px solid rgba(29, 91, 191, 1)",
                          borderRadius: "10px",
                        }}
                        onClick={() =>
                          navigate(
                            `/mentor-details/${recentReq?.id}?fromType=topmentor`
                          )
                        }
                      >
                        <div
                          className="flex gap-2 pb-3"
                          style={{
                            borderBottom: "1px solid rgba(29, 91, 191, 1)",
                          }}
                        >
                          {console.log(recentReq)}
                          <div className="w-1/4">
                            {" "}
                            <img
                              src={recentReq?.profile_image || UserIcon}
                              alt="male-icon"
                            />
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
                            <span className="lg:text-[8px]">
                              Attended({recentReq.attended || 0})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                              className="lg:w-2 lg:h-2  rounded-full"
                              style={{ background: "rgba(0, 174, 189, 1)" }}
                            ></span>
                            <span className="lg:text-[8px]">
                              Completed({recentReq.completed || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Invite />
            </div>
          )}

          {!["new", "pending"].includes(
            userInfo?.data?.userinfo?.approve_status
          ) ? (
            <div className="col-span-5 sm:col-span-5 md:col-span-3 lg:col-span-4">
              {searchParams.get("type") === null &&
                searchParams.get("is_bookmark") === null && (
                  <ProgramCard
                    title="All Programs"
                    viewpage="/programs"
                    handleNavigateDetails={handleNavigateDetails}
                    handleBookmark={handleBookmark}
                    programs={userpragrams.allprograms}
                    loadProgram={getPrograms}
                  />
                )}
              {(searchParams.get("type") === "yettojoin" ||
                searchParams.get("type") === "planned") && (
                <ProgramCard
                  title="Planned Programs"
                  viewpage="/programs?type=yettojoin"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={userpragrams.yettojoin}
                  loadProgram={getPrograms}
                />
              )}

              {searchParams.get("type") === "yettostart" && (
                <ProgramCard
                  title="Recent  Programs"
                  viewpage="/programs?type=yettostart"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={userpragrams.yettostart}
                  loadProgram={getPrograms}
                />
              )}

              {searchParams.get("type") === "inprogress" && (
                <ProgramCard
                  title="Ongoing  Programs"
                  viewpage="/programs?type=inprogress"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={userpragrams.inprogress}
                  loadProgram={getPrograms}
                />
              )}

              {/* {
                            searchParams.get("type") === 'planned' &&
                            <ProgramCard
                                title="PLanned Programs"
                                viewpage="/programs?type=planned"
                                handleNavigateDetails={handleNavigateDetails}
                                handleBookmark={handleBookmark}
                                programs={userpragrams.planned}
                                loadProgram={getPrograms}
                            />
                        } */}

              {searchParams.get("is_bookmark") === "true" && (
                <ProgramCard
                  title="Bookmarked  Programs"
                  viewpage="/programs?type=bookmarked"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={userpragrams.bookmarked}
                  loadProgram={getPrograms}
                />
              )}

              {searchParams.get("type") === "completed" && (
                <ProgramCard
                  title="Completed  Programs"
                  viewpage="/programs?type=completed"
                  handleNavigateDetails={handleNavigateDetails}
                  handleBookmark={handleBookmark}
                  programs={userpragrams.completed}
                  loadProgram={getPrograms}
                />
              )}

              <div className="root-layer grid grid-cols-2 gap-8 pt-6">
                <div className="layer-first flex flex-col sm:gap-6 gap-4">
                  <RecentRequests data={programRequest} />
                </div>

                <div className="layer-second flex flex-col gap-8">
                  {/* <Programs /> */}
                  <ProgramFeeds feedsList={feeds?.results} />
                </div>
              </div>
            </div>
          ) : (
            <div className="programs-list !h-[100vh]">
              <div className="flex items-center justify-center h-full w-full flex-col gap-3">
                <p className="text-[24px] text-font-primary-main font-bold">
                  Welcome to Mentoring Management Application
                </p>
                <p className="text-[18px] text-font-primary-main font-bold">
                  Waiting for Admin approval
                </p>
                <Invite />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
