import dayjs from "dayjs";
import { useState, useEffect } from "react";
import BackArrowIcon from "../../assets/icons/back-arrow.svg";

// import {
//   getMonth,
//   getWeek,
//   getToday,
//   getYearMonths,
//   getMonth2,
// } from "../utils";
import Month from "./month";
import CalendarHeader from "./calendarheader";
import AddAppointment from "./addappointment";
// import AlertSuccess from "../common/AlertSuccess";
// import apiURL from "../.././apiConfig";
import Week from "./week";
import YearView from "./YearView";
import TodayView from "./TodayView";
import useAppointments from "../../hooks/useAppointments";
// import { PageHeader } from "../ClientDirectory";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
// import { Tooltip } from "react-bootstrap";

const CalendarMain = () => {
  // console.table(getMonth(3));
  const navigate = useNavigate();

  const CALENDAR_VIEWS = ["Today", "Week", "Month", "Year", "day"];
  const [currentCalendarView, setCurrentCalendarView] = useState("Month");

  const [currentDate, setCurrentDate] = useState(dayjs());
  // const [isNew, setIsNew] = useState(false);

  const handleCalendarChange = (mode) => {
    let dateParameter = "month";
    switch (currentCalendarView) {
      case "Today":
      case "day":
        dateParameter = "day";
        break;
      case "Month":
        dateParameter = "month";
        break;
      case "Week":
        dateParameter = "week";
        break;
      case "Year":
        dateParameter = "year";
        break;
      default:
        dateParameter = "month";
        break;
    }
    if (mode === 1) {
      // handle increment

      setCurrentDate((prev) => prev.add(1, dateParameter));
    }

    if (mode === -1) {
      // handle decrement

      setCurrentDate((prev) => prev.subtract(1, dateParameter));
    }
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
    // setIsNew(true);
    if (searchParams.has("date")) {
      if (selectedDate) {
        searchParams.delete("date");
      }
    }
    if (searchParams.has("mode")) {
      searchParams.delete("mode");
    }
    if (searchParams.has("appointmentId")) {
      searchParams.delete("appointmentId");
    }
    setSearchParams(searchParams);
  };

  const submitAppointment = () => {
    setShowModal(false);
    setShowAlert(true);
  };

  const [showAlert, setShowAlert] = useState(false);
  const closeAlert = () => {
    setShowAlert(false);
  };

  const {
    appointmentsLoading,
    internalEventsLoading,
    externalEventsLoading,
    internalEvents,
    externalEvents,
    eventList: savedEvents,
    appointmentsList,
    fetchEvents,
    fetchAppointments,
    deleteAppointment,
  } = useAppointments();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // new changes for redirect from dashboard calendar to appointment calendar
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = searchParams.get("date");
  const mode = searchParams.get("mode");
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    if (appointmentId) {
      setShowModal(true);
    }
  }, [appointmentId])

  useEffect(() => {
    // new changes for redirect from dashboard calendar to appointment calendar
    if (selectedDate && mode) {
      setCurrentDate(dayjs(selectedDate));
      setCurrentCalendarView(mode);
      //-------------------------------------------------------------------
    } else {
      setCurrentDate(dayjs());
    }
  }, [currentCalendarView, location]);

  const renderCalendar = () => {
    switch (currentCalendarView) {
      case "Today":
        return (
          <TodayView
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      case "Week":
        return (
          <Week
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      case "Month":
        return (
          <Month
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      case "Year":
        return (
          <YearView
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      // new changes for redirect from dashboard calendar to appointment calendar
      case "day":
        return (
          <TodayView
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      //--------------------------------------------------------
      default:
        return <p>No view found</p>;
    }
  };

  return (
    <div className="">
      {/* {showAlert && (
        <AlertSuccess
          message="New Appointment Created"
          handleClose={closeAlert}
        />
      )} */}
      <div className={`space-y-5 m-5 ${showModal ? "opacity-50" : ""}`}>
        <div className="flex justify-between items-center w-full">
          <div className="text-gray-900 text-2xl font-medium" id="calendarPage">
            Calendar
          </div>
          <div className="flex item-center justify-center gap-3">
            <button
              className="bg-[#43B09C] rounded text-xs text-white p-3"
              onClick={toggleModal}
            >
              Add new appointment
            </button>
            <Link
              className="p-3 bg-[#EAECEB]"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              <img
                src={BackArrowIcon}
                alt="back arrow"
                className="h-[15px] w-[100%]"
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col bg-white border-1 border-teal-400 rounded-md p-10 space-y-3">
          <CalendarHeader
            //  viewList={CALENDAR_VIEWS}
            viewList={CALENDAR_VIEWS.filter((ele) => ele != "day")} // new changes for redirect from dashboard calendar to appointment calendar
            currentCalendarView={currentCalendarView}
            handleCalendarView={(view) => {
              setCurrentCalendarView(view);
              // new changes for redirect from dashboard calendar to appointment calendar
              if (searchParams.has("date")) {
                if (selectedDate) {
                  searchParams.delete("date");
                }
              }
              if (searchParams.has("mode")) {
                searchParams.delete("mode");
              }
              if (searchParams.has("appointmentId")) {
                searchParams.delete("appointmentId");
              }
              setSearchParams(searchParams);
              //----------------------------------------------------------
            }}
            onIncrement={() => {
              handleCalendarChange(1);
            }}
            onDecrement={() => {
              handleCalendarChange(-1);
            }}
            currentDate={currentDate}
          />
          {!appointmentsLoading && renderCalendar()}
        </div>
      </div>

      <AddAppointment
        show={showModal}
        toggleModal={toggleModal}
        handleSubmit={submitAppointment}
        setShowAlert={setShowAlert}
        fetchEvents={fetchAppointments}
        appointmentId={appointmentId}
        isUpdate={mode == "edit"}
        isView={mode == "view"}
      // isNew={isNew}
      />
      {/* <AddAppointment
                      show={editEvent === index}
                      toggleModal={() => setEditEvent(null)}
                      setShowAlert={null}
                      fetchEvents={fetchEvents}
                      appointmentDetail={event}
                      appointmentId={event.id}
                      isUpdate
                    /> */}
    </div>
  );
};

export default CalendarMain;
