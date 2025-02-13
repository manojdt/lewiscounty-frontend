import React, { useEffect, useState } from "react";
import InlineCalendar from "../../shared/Calendar/InlineCalendar";
import "./calendar.css";
import PlusWhiteIcon from "../../assets/icons/PlusWhite.svg";
import CalendarMain from "../Calendar/CalendarMain";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCalendarEvents,
  getCalendarFilterEvents,
} from "../../services/scheduler";
import { Backdrop, CircularProgress } from "@mui/material";
import { eventColors, user } from "../../utils/constant";
import { Box, FormControl, MenuItem, Select } from "@mui/material";

export default function Scheduler() {
  const [requestTab, setRequestTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, filteredEvents, loading } = useSelector(
    (state) => state.events
  );
  const { data: userInfo } = useSelector((state) => state.userInfo);
  const [eventsFilter, setEventsFilter] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  const [actionActionBtn, setActionActionBtn] = useState("all");

  let calendarEvents = [
    {
      name: "All Meetings",
      key: "all",
      total: 10,
      view: ["admin", "mentor", "mentee"],
    },
    {
      name: "Upcoming Meetings",
      key: "upcoming",
      total: 10,
      view: ["admin", "mentor", "mentee"],
    },
    // {
    //   name: "Rescheduled Meetings",
    //   key: "reschedule",
    //   total: 10,
    //   view: ["admin", "mentor","mentee"],
    // },
    {
      name: "Completed Meetings",
      key: "completed",
      total: 10,
      view: ["admin", "mentor", "mentee"],
    },
    {
      name: "Cancelled Meetings",
      key: "cancelled",
      total: 10,
      view: ["admin", "mentor", "mentee"],
    },
    {
      name: "Draft Meetings",
      key: "draft",
      total: 10,
      view: ["admin", "mentor"],
    },
  ];

  useEffect(() => {
    setEventsFilter(calendarEvents);
    dispatch(getCalendarEvents());
  }, [dispatch]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const startDate = dateRange.start.format("YYYY-MM-DD");
      const endDate = dateRange.end.format("YYYY-MM-DD");
      console.log("startDate",startDate)
      console.log("endDate",endDate)
      dispatch(
        getCalendarFilterEvents({ startDate, endDate, status: actionActionBtn })
      );
    }
  }, [dateRange, actionActionBtn, dispatch]);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      const events = calendarEvents.filter((event) =>
        event.view.includes(userInfo.role)
      );
      setEventsFilter(events);
      // Set the initial value of mobileValue to the first key in eventsFilter
      if (events.length > 0) {
        setMobileValue(events[0].key);
        setActionActionBtn(events[0].key);
      }
    }
  }, [userInfo]);

  const handleTab = (key) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("tab", key);
    setSearchParams(currentParams);
  };

  const [mobileValue, setMobileValue] = useState("");

  const handleMobileChange = (event) => {
    const value = event.target.value;
    setMobileValue(value);
    setActionActionBtn(value);
    handleTab(value);
  };

  return (
    <div className="calendar-container px-2 py-2 sm:py-2 md:py-4 lg:py-9 xl:py-9 sm:px-2 md:px-4 lg:px-9 xl:px-9">
      <div
        className="px-3 py-5"
        style={{ boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.15)" }}
      >
        <nav
          className="flex px-0 sm:px-0 md:px-0 lg:px-7 xl:px-7  pb-5 mx-2 border-b-2"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a
                href="#"
                className="inline-flex items-center text-[26px] font-medium"
                style={{ color: "rgba(24, 40, 61, 1)" }}
              >
                Scheduler
              </a>
            </li>
          </ol>
        </nav>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className="grid grid-cols-5 gap-5 py-5">
          <div className="left-container col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-1 xl:col-span-1">
            <div
              className="my-program-list pb-3 mb-0 px-6 sm:mb-0 md:mb-0 lg:mb-4 xl:md-4"
              style={{
                boxShadow: "4px 4px 25px 0px rgba(0, 0, 0, 0.05)",
                borderRadius: "10px",
                border: "1px solid rgba(219, 224, 229, 1)",
              }}
            >
              <div className="title flex justify-between py-7">
                <h4
                  className="text-base font-semibold"
                  style={{ color: "rgba(24, 40, 61, 1)" }}
                >
                  My meetings
                </h4>
              </div>
              <div className="flex gap-5 flex-col justify-center items-center pb-5">
                {userInfo.role !== user.mentee && (
                  <button
                    className="flex gap-3 justify-center py-2 w-full text-[12px]"
                    style={{
                      background: "rgba(29, 91, 191, 1)",
                      color: "#fff",
                      borderRadius: "3px",
                    }}
                    onClick={() => navigate("/create-meeting")}
                  >
                    <img src={PlusWhiteIcon} alt="PlusWhiteIcon" />
                    Add New Meeting
                  </button>
                )}

                <Box className="lg:hidden mb-4" sx={{ width: "100%" }}>
                  <FormControl fullWidth>
                    <Select
                      value={mobileValue}
                      onChange={handleMobileChange}
                      displayEmpty
                      className="bg-gray-50"
                      sx={{
                        "& .MuiSelect-select": {
                          padding: "12px 16px",
                        },
                      }}
                    >
                      {eventsFilter.map((actionBtn, index) => (
                        <MenuItem
                          key={index}
                          value={actionBtn.key}
                          sx={{
                            background:
                              mobileValue === actionBtn.key // Use mobileValue to determine the selected item
                                ? "linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)"
                                : "transparent",
                            color:
                              mobileValue === actionBtn.key ? "#fff" : "#000",
                            "&:hover": {
                              background:
                                mobileValue === actionBtn.key
                                  ? "linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)"
                                  : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          {actionBtn.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Desktop View */}

                {eventsFilter.map((calendarevent, index) => (
                  <div className="hidden lg:block w-[100%]">
                    <div
                      key={index}
                      className={`action-btn flex justify-between cursor-pointer ${
                        actionActionBtn === calendarevent.key ? "active" : ""
                      }`}
                      onClick={() => {
                        const currentParams = new URLSearchParams(searchParams);
                        currentParams.set("status", calendarevent.key);
                        setSearchParams(currentParams);
                        setActionActionBtn(calendarevent.key);
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <div
                          style={{
                            background: `${eventColors[calendarevent.key]}`,
                            height: "10px",
                            width: "10px",
                          }}
                        ></div>
                        <span className="text-[12px]">
                          {calendarevent.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div
              className='events-calendar pb-3 px-2'
              style={{
                boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(219, 224, 229, 1)',
              }}
            >
              <InlineCalendar />
            </div> */}
          </div>

          {!loading && (
            <div className="col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-4 xl:col-span-4">
              <div
                style={{
                  border: "1px solid rgba(219, 224, 229, 1)",
                  boxShadow: "rgba(0, 0, 0, 0.05) 4px 4px 25px 0px",
                  borderRadius: "10px",
                }}
              >
                <CalendarMain
                  title="Meeting Scheduler"
                  addSection={false}
                  events={filteredEvents}
                  setDateRange={setDateRange}
                  actionActionBtn={actionActionBtn}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
