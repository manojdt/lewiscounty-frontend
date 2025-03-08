import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  empty,
  programActionStatus,
  programMenus,
  user,
} from "../../utils/constant";

import ListCard from "../../shared/Card/ListCard";
import ProgramMetrix from "./ProgramMetrix";
import CardWrapper from "../../shared/Card/CardWrapper";
import {
  chartProgramList,
  getProgramCounts,
} from "../../services/userprograms";
import protectedApi from "../../services/api";
import { getProgramPost } from "../../services/feeds";
import { useWindowSize } from "../../utils/windowResize";
import api from "../../services/api";
import { requestPageBreadcrumbs } from "../Breadcrumbs/BreadcrumbsCommonData";
import TopProgramsDataTable from "./Admin/TopProgramsDataTable";
import TopMentorsDataTable from "./Admin/TopMentorsDataTable";
import ProgramTypeChart from "./Admin/ProgramTypeChart";
import ProgramModeChart from "./Admin/ProgramModeChart";
import { useGetProgramMetricsQuery } from "../../features/program/programApi.services";

export default function Admin() {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category_id"); // Extract category ID
  const filterType = searchParams.get("type");
  const userInfo = useSelector((state) => state.userInfo);
  const userpragrams = useSelector((state) => state.userPrograms);
  const { feeds } = useSelector((state) => state.feeds);
  const breadcrumbsType = searchParams.get("breadcrumbsType") || "";

  const [programMenusList, setProgramMenusList] = useState([]);
  const [chartList, setChartList] = useState([]);
  const [membersCount, setMembersCount] = useState([]);
  // const [topPrograms, setTopPrograms] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  // const [topMentotList, setTopMentorList] = useState([]);
  const [listActivity, setListActivity] = React.useState([]);
   const {data:programMetrics} = useGetProgramMetricsQuery();
  const role = userInfo.data.role;
  const dispatch = useDispatch();
  const handleViewAllMembers = () => {
    navigate("/members")
  };
  const onItemClick = (menu) => {
    if (menu.role === user.mentor) {
      navigate(`/members?breadcrumbsType=${requestPageBreadcrumbs.dashboardMemberMentor || ""}`);
    } else {
      navigate(`/members?breadcrumbsType=${requestPageBreadcrumbs.dashboardMemberMentee || ""}`);
    }
  }
  // const membersList = [
  //     {
  //         name: 'Mentor Managers',
  //         count: 10
  //     },
  //     {
  //         name: 'Mentors',
  //         count: 20
  //     },
  //     {
  //         name: 'Mentees',
  //         count: 30
  //     },
  //     {
  //         name: 'Technical Supports',
  //         count: 40
  //     },
  // ]


  const fetchMembersCount = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await protectedApi.get("/dashboard/member-count");
      setMembersCount(response.data);
    } catch (error) {
      console.error("Error fetching member-count data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };
  // const fetchTopPrograms = async () => {
  //   setLoading(true); // Set loading to true while fetching
  //   try {
  //     const response = await protectedApi.get("/rating/top_programs");
  //     setTopPrograms(response?.data?.results);
  //   } catch (error) {
  //     console.error("Error fetching Top programs data:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false after data is fetched
  //   }
  // };
  useEffect(() => {
    fetchMembersCount();
    dispatch(getProgramCounts());
    // getTopMentors()
    getActivityListDetails();
    //fetchTopPrograms()
  }, []);

  // const getTopMentors = async () => {
  //   const topMentor = await api.get("rating/top_mentor");
  //   if (topMentor.status === 200 && topMentor.data?.results) {
  //     setTopMentorList(topMentor.data.results);
  //   }
  // };

  const getActivityListDetails = async () => {
    const listActivity = await api.get(
      "recent_activities/recent-activities?limit=5"
    );
    setListActivity(listActivity?.data?.results);
    // if (topMentor.status === 200 && topMentor.data?.results) {
    //   setTopMentorList(topMentor.data.results);
    // }
  };

  useEffect(() => {
    const totalCount = userpragrams.statusCounts;
    if (Object.keys(totalCount).length) {
      const programMenu = [...[{
        name: "Programs",
        count: 0,
        page: "/programs",
        for: ["admin"],
        mentorStatus: "all",
        menteeStatus: "allprogram",
        adminStatus: "all",
        status: "all",
      },], ...programMenus("dashboard")]
        .filter((men) => men.for.includes(role))
        .map((menu) => {
          if (menu.status === "all") {
            return { ...menu, count: userpragrams.totalPrograms };
          }

          // Admin Response Count
          if (role === "admin") {
            return { ...menu, count: totalCount[menu.adminStatus] };
          }

          return menu;
        });
      setProgramMenusList(programMenu);
    }
  }, [userpragrams]);
  const data = [
    { title: "Ongoing Programs", value: 40, color: "#1D5BBF" },
    { title: "Completed", value: 25, color: "#00AEBD" },
    { title: "Abort Programs", value: 35, color: "#FEA7BB" },
  ];

  const activityList = [
    {
      id: 1,
      name: "Report 1",
      action_message: "Approved by Admin",
      time_since_action: "10 min ago",
      action: "create",
    },
    {
      id: 2,
      name: "Report 1",
      action_message: "Approved by Admin",
      time_since_action: "10 min ago",
      action: "create",
    },
    {
      id: 3,
      name: "Report 1",
      action_message: "Approved by Admin",
      time_since_action: "10 min ago",
      action: "create",
    },
    {
      id: 4,
      name: "Report 1",
      action_message: "Approved by Admin",
      time_since_action: "10 min ago",
      action: "create",
    },
    {
      id: 5,
      name: "Report 1",
      action_message: "Approved by Admin",
      time_since_action: "10 min ago",
      action: "create",
    },
  ];

  const handlePerformanceFilter = (e) => {
    const res = e?.target?.value || "date";
    dispatch(chartProgramList(res));
  };

  const handleDetails = () => {
    console.log("handleDetails");
  };

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  // useEffect(() => {
  //     const programMenu = [...programMenus('dashboard')].filter(men => men.for.includes(role)).map(menu => {
  //         return { ...menu, count: 0 }
  //     })
  //     setProgramMenusList(programMenu)
  // }, [userpragrams])

  useEffect(() => {
    chartData();
  }, [userpragrams.chartProgramDetails]);

  const chartData = () => {
    if (
      userpragrams?.chartProgramDetails?.data &&
      userpragrams?.chartProgramDetails?.data?.length > 0
    ) {
      const res = userpragrams?.chartProgramDetails?.data.every(
        (val) => val.value === 0
      );
      if (res) {
        return setChartList(empty);
      } else {
        return setChartList(userpragrams?.chartProgramDetails?.data);
      }
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
  useEffect(() => {
    // If there's no type and no bookmark parameter, set type to planned while preserving other params
    if (!filterType) {
      const newSearchParams = new URLSearchParams(searchParams);

      // Preserve all existing parameters
      for (const [key, value] of searchParams.entries()) {
        newSearchParams.set(key, value);
      }

      // Add the type parameter
      newSearchParams.set("type", "yettojoin");

      setSearchParams(newSearchParams);
    }
  }, []);
  return (
    <div className="dashboard-content px-4 sm:px-4 md:px-4 lg:px-8 xl:px-8 mt-10 py-5">
      <div className="grid grid-cols-10 gap-4 max-md:block">
        <div className="col-span-4">
          <div
            className="w-full h-[350px] bg-white rounded-lg"
            style={{
              boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
              background: "rgba(255, 255, 255, 1)",
            }}
          >
            {/* <UserInfoCard /> */}
            {/* <div className="flex flex-col items-center pb-10 pt-14 border-b-2">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
                src={UserImage}
                alt="User logo"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900  max-lg:text-[16px]">
                {userInfo?.data?.first_name} {userInfo?.data?.last_name}
              </h5>
              <span
                className="text-sm text-gray-500 max-lg:text-[12px] "
                style={{ textTransform: "capitalize" }}
              >
                {userInfo.data.role} |{" "}
                {role === "mentee"
                  ? "Student"
                  : role === "mentor"
                    ? "Teaching Professional"
                    : role === "admin"
                      ? "Organizational Admin"
                      : ""}
              </span>
            </div> */}

            <ul className="flex gap-2 p-4 md:p-0 font-medium h-full">
              <ListCard
                title="Overview"
                // viewall
                // handleViewall={handleViewAllMembers}
                onItemClick={onItemClick}
                items={membersCount}
                programCount={programMenusList.map((menu, index) => {
                  if (role === "admin" && index > 0) return null;
                  return (

                    <div
                      key={index}
                      className={`flex flex-col justify-between p-4 rounded cursor-pointer menu-content
                                    ${searchParams.get("type") ===
                          menu.status ||
                          (searchParams.get("is_bookmark") ===
                            "true" &&
                            menu.status ===
                            programActionStatus.bookmark) ||
                          (searchParams.get("type") === null &&
                            searchParams.get("is_bookmark") ===
                            null &&
                            menu.status ===
                            programActionStatus.yettojoin)
                          ? "active"
                          : ""
                        }`}
                      aria-current="page"

                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Navigating to:", menu.page);
                        navigate(menu.page);
                      }}
                    >

                      <div className="w-[140px] h-[140px] rounded-[12px] bg-[#FFF4DE] flex items-center justify-center">
                        <span className="text-[38px] font-semibold">
                          {menu.count}
                        </span>
                      </div>
                      <span className="text-sm max-lg:text-[40px] font-semibold flex items-center justify-center p-5">
                        {menu.name}
                      </span>
                    </div>
                  );
                })}
              />

            </ul>
            {/* <div className="flex justify-center mt-2 mb-2">
              <button
                className="text-white flex justify-center items-center gap-3 px-4 py-3 text-[12px]"
                style={{
                  borderRadius: "3px",
                  background:
                    "linear-gradient(97.32deg, #1D5BBF -32.84%, #00AEBD 128.72%)",
                }}
                onClick={() => navigate("/programs")}
              >
                <span>View All</span>
                <img src={RightArrow} alt={"RightArrow"} />
              </button>
            </div> */}
          </div>

          <div className="mt-4">

          </div>

          {/* asdfsdfsd */}

        </div>

        <div className="col-span-6">
          <CardWrapper title="Program Status Metrics">
            <ProgramMetrix />
          </CardWrapper>

          {/* <div className="">
            <DashboardPrograms searchParams={searchParams} type={filterType} categoryId={categoryId} />
          </div> */}
          {/* <div className="grid grid-cols-10 md:grid-cols-12 gap-7 mt-3 max-md:block">
            <div className="col-span-2 sm:col-span-2 md:col-span-5 lg:col-span-5 xl:col-span-2"> 


             <div>
          <CardWrapper title="Recent Activities">
            <div style={{ height: "700px" }}>
              {listActivity?.length ? (
                <div className="program-status flex items-center flex-col justify-center w-max py-4 px-4">
                  {listActivity?.map((recentActivity) => (                    
                    <div className="flex items-center flex-col relative" key={recentActivity.id}>
                                                    <div className="absolute top-0 left-full ml-4 w-max">
                                                        <Tooltip title={recentActivity.name}>
                                                            <p className="activity-name text-[14px]" >{recentActivity.name}</p>
                                                        </Tooltip>
                                                        <Tooltip title={recentActivity.action_message}>
                                                            <h6 className="text-[10px] activity-msg" style={{ color: activityStatusColor[recentActivity.action] }}>{recentActivity.action_message}</h6>
                                                        </Tooltip>
                                                    </div>
                                                    <div className="timeline absolute lg:right-[-205px] md:right-[-227px] sm:right-[-200px] text-[10px]">{recentActivity.time_since_action}</div>
                                                    <div
                                                        className="w-8 h-3  mx-[-1px]  flex items-center justify-center">
                                                        <span className="w-3 h-3  rounded-full" style={{ background: activityStatusColor[recentActivity.action] }}></span>
                                                    </div>
                                                    <div className="w-1 h-16 " style={{ background: 'rgba(0, 174, 189, 1)' }}></div>
                                                </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center py-5">
                  There is no recent activities
                </div>
              )}
            </div>
          </CardWrapper>
          </div>

            </div>
        <div className="col-span-5 sm:col-span-5 md:col-span-12 lg:col-span-6 xl:col-span-6">
              <MemberRequest />
            </div>

            <div className="col-span-5 sm:col-span-5 md:col-span-12 lg:col-span-6 xl:col-span-6">
            <div
            className="recent-request"
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
                    onClick={() => navigate("/mentors")}
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
                    onClick={() => navigate(`/mentor-details/${recentReq?.id}?fromType=topmentor&breadcrumbsType=${requestPageBreadcrumbs.dashboardtopmentor || requestPageBreadcrumbs.dashboardtopmentor}`)}

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
            </div> 
          </div> */}
        </div>
        <div className="col-span-5  bg-white rounded-lg" style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 1)",
        }}>
          <TopProgramsDataTable role={role} /></div>
        <div className="col-span-5  bg-white rounded-lg" style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 1)",
        }}>
          <TopMentorsDataTable /></div>
        <div className="col-span-5  bg-white rounded-lg" style={{
          boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 1)",
        }}>
          <ProgramTypeChart programMetrics ={programMetrics}/>
        </div>
        <div className="col-span-5 bg-white rounded-lg"
          style={{
            boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
            background: "rgba(255, 255, 255, 1)",
          }}>

          <ProgramModeChart programMetrics ={programMetrics} />
        </div>

      </div>


    </div>
  );
}
