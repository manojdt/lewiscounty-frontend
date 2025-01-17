import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserImage from "../../assets/icons/user-icon.svg";
import {
  activityStatusColor,
  empty,
  programActionStatus,
  programMenus,
  statusAction,
} from "../../utils/constant";

import RightArrow from "../../assets/icons/rightArrow.svg";
import BlueStarIcon from "../../assets/icons/bluefilledStar.svg";
import MoreIcon from "../../assets/icons/moreIcon.svg";
import ListCard from "../../shared/Card/ListCard";
import ProgramMetrix from "./ProgramMetrix";
import CardWrapper from "../../shared/Card/CardWrapper";
import DashboardPrograms from "./Admin/DashboardPrograms";
import ProgramPerformance from "./ProgramPerformance";
import ReportsInfo from "./Admin/ReportsInfo";
import Tooltip from "../../shared/Tooltip";
import { programFeeds } from "../../utils/mock";
import {
  chartProgramList,
  getProgramCounts,
} from "../../services/userprograms";
import MemberRequest from "./MemberRequest";
import protectedApi from "../../services/api";
import { getPost } from "../../services/feeds";
import ProgramFeeds from "../../shared/ProgramFeeds";

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userInfo = useSelector((state) => state.userInfo);
  const userpragrams = useSelector((state) => state.userPrograms);
  const { feeds } = useSelector((state) => state.feeds);

  const [programMenusList, setProgramMenusList] = useState([]);
  const [chartList, setChartList] = useState([]);
  const [membersCount, setMembersCount] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const role = userInfo.data.role;
  const dispatch = useDispatch();
  const handleViewAllMembers = () => {
    console.log("View all");
  };

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
  useEffect(() => {
    fetchMembersCount();
    dispatch(getProgramCounts());
  }, []);
  useEffect(() => {
    const totalCount = userpragrams.statusCounts;
    if (Object.keys(totalCount).length) {
      const programMenu = [...programMenus("dashboard")]
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

  React.useEffect(() => {
    //   if (feedsList?.length === 0) {
    let feedData = {
      page: 1,
      pageSize: 5,
    };
    dispatch(getPost(feedData));
    //   }
  }, []);

  return (
    <div className="dashboard-content px-8 mt-10 py-5">
      <div className="grid grid-cols-7 gap-7">
        <div className="col-span-2">
          <div
            className="pb-3 w-full  bg-white rounded-lg"
            style={{
              boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
              background: "rgba(255, 255, 255, 1)",
            }}
          >
            <div className="flex flex-col items-center pb-10 pt-14 border-b-2">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
                src={UserImage}
                alt="User logo"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 ">
                {userInfo?.data?.first_name} {userInfo?.data?.last_name}
              </h5>
              <span
                className="text-sm text-gray-500 "
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
            </div>

            <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
              {programMenusList.map((menu, index) => {
                if (role === "admin" && index > 3) return null;
                return (
                  <li className="" key={index}>
                    <div
                      className={`flex justify-between py-2 px-6 rounded cursor-pointer menu-content 
                                    ${
                                      searchParams.get("type") ===
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
                      onClick={() => navigate(menu.page)}
                    >
                      <span className="text-sm">{menu.name}</span>
                      <span className="text-base">{menu.count}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-center mt-2 mb-2">
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
            </div>
          </div>

          <div className="mt-4">
            <ListCard
              title="Members"
              viewall
              handleViewall={handleViewAllMembers}
              items={membersCount}
            />
          </div>
        </div>

        <div className="col-span-5">
          <CardWrapper title="Metrics at a Glance">
            <ProgramMetrix />
          </CardWrapper>

          <div className="py-3">
            <DashboardPrograms />
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-8 gap-7 mt-4">
                <div className='col-span-3'>
                    <ProgramPerformance data={userpragrams?.chartProgramDetails?.data &&
                        userpragrams?.chartProgramDetails?.data?.length > 0 ?
                        userpragrams?.chartProgramDetails?.data : data} total={userpragrams?.chartProgramDetails?.total_program_count || 10} handleFilter={handlePerformanceFilter} handleDetails={handleDetails} height={'440px'} />
                </div>
                <div className='col-span-5'>
                    <ReportsInfo />
                </div>

            </div> */}

      <div className="grid grid-cols-10 gap-7 mt-4">
        <div className="col-span-2">
          <CardWrapper title="Recent Activities" viewAll>
            <div style={{ height: "640px" }}>
              {activityList.length ? (
                <div className="program-status flex items-center flex-col justify-center w-max py-4 px-4">
                  {activityList.map((recentActivity) => (
                    <div
                      className="flex items-center flex-col relative"
                      key={recentActivity.id}
                    >
                      <div className="absolute top-0 left-full ml-4 w-max">
                        <Tooltip title={recentActivity.name}>
                          <p className="activity-name text-[14px]">
                            {recentActivity.name}
                          </p>
                        </Tooltip>
                        <Tooltip title={recentActivity.action_message}>
                          <h6
                            className="text-[10px] activity-msg"
                            style={{
                              color: activityStatusColor[recentActivity.action],
                            }}
                          >
                            {recentActivity.action_message}
                          </h6>
                        </Tooltip>
                      </div>
                      <div className="timeline absolute lg:right-[-205px] md:right-[-227px] sm:right-[-200px] text-[10px]">
                        {recentActivity.time_since_action}
                      </div>
                      <div className="w-8 h-3  mx-[-1px]  flex items-center justify-center">
                        <span
                          className="w-3 h-3  rounded-full"
                          style={{
                            background:
                              activityStatusColor[recentActivity.action],
                          }}
                        ></span>
                      </div>
                      <div
                        className="w-1 h-16 "
                        style={{ background: "rgba(0, 174, 189, 1)" }}
                      ></div>
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
        <div className="col-span-4">
          <MemberRequest />
          {/* <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px', padding: '20px', marginTop: '20px' }} >
                        <div className='flex justify-evenly items-center'>
                            <div style={{ background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px', padding: '10px', fontWeight: 600 }}>
                                NGO Performance
                            </div>
                            <div className='flex items-center gap-2'>
                                <span style={{ fontWeight: 600 }}>4.6</span>
                                <p>
                                    <img className='h-[24px]' src={BlueStarIcon} alt="BlueStarIcon" />
                                </p>
                            </div>
                            <div>
                                (78,293,393 <span style={{ color: 'rgba(29, 91, 191, 1)', fontWeight: 600 }}> Views</span>)
                            </div>
                        </div>
                    </div> */}
        </div>

        <div className="col-span-4">
          {/* <CardWrapper title="Program Feeds" viewAll>
            <div style={{ height: "640px", overflowY: "scroll" }}>
              {programFeeds.map((programFeeds, index) => (
                <div key={index} className="program-feed-root mx-7 my-3">
                  <div className="flex items-center py-3 px-3 gap-4">
                    <img
                      src={UserImage}
                      className={`program-user-image ${
                        getWindowDimensions().width <= 1536 ? "w-1/4" : "w-1/6"
                      } rounded-xl`}
                      style={{
                        height:
                          getWindowDimensions().width <= 1536
                            ? "105px"
                            : "100px",
                      }}
                      alt=""
                    />
                    <div className="feed-content flex flex-col gap-4">
                      <h3>{programFeeds.title}</h3>
                      <h4
                        className="text-[12px]"
                        style={{ color: "rgba(29, 91, 191, 1)" }}
                      >
                        {"10 Mins ago"}
                      </h4>
                      <h4 className="text-[12px]">{programFeeds.desc}</h4>
                    </div>
                    <div
                      style={{
                        background: "rgba(241, 247, 255, 1)",
                        padding: "14px 18px",
                      }}
                    >
                      <img src={MoreIcon} alt="MoreIcon" />
                    </div>
                  </div>
                </div>

                
              ))}
            </div>
          </CardWrapper> */}

          <ProgramFeeds feedsList={feeds?.results} />
        </div>
      </div>
    </div>
  );
}
