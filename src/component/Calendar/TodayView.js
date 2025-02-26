import React, { useState } from "react";
import dayjs from "dayjs";
import { getTodayTime } from "../../utils";
import EventModal from "./EventModal";
import moment from "moment";

export default function TodayView({
  currentDate,
  savedEvents,
  fetchEvents,
  deleteAppointment,
  isWeek,
  rowIdx,
  actionActionBtn,
  colIdx,
  newData,
}) {
  const todayTimes = getTodayTime(currentDate);

  return (
    <>
      <div className="mt-1 p-1">
        {todayTimes.map((time, index) => {
          return (
            <TimeBlock
              isWeek={isWeek}
              rowIdx={rowIdx}
              colIdx={colIdx}
              key={index}
              time={time}
              actionActionBtn={actionActionBtn}
              savedEvents={savedEvents}
              fetchEvents={fetchEvents}
              deleteAppointment={deleteAppointment}
              newData={newData}
            />
          );
        })}
      </div>
    </>
  );
}

function TimeBlock({
  isWeek,
  colIdx,
  time,
  savedEvents,
  fetchEvents,
  deleteAppointment,
  actionActionBtn,
  newData,
}) {
  const startTime = time.format("h:mm A"); // Format the start time
  const endTime = time.add(1, "hour").format("h:mm A"); // Add 1 hour to get the end time

  function getCurrentTimeClass() {
    return time.format("H") === dayjs().format("H")
      ? "bg-[#FE634E] text-white rounded-md h-5 m-0 w-100"
      : "pt-2";
  }


  const eventsForHour = savedEvents.filter((event) => {
    const eventTime = dayjs(event?.start?.dateTime);
    return eventTime.hour() === time.hour() && eventTime.date() === time.date();
  });

  const eventsForHour1 = newData.filter((event) => {
    const eventTime = dayjs(new Date(event.date).toDateString());
    return eventTime.hour() === time.hour() && eventTime.date() === time.date();
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (item) => {
    setSelectedEvent(item);
    setShowModal(true);
  };

  let showTimeBlock = true;
  let showEvent = true;

  if (isWeek && colIdx > 0) {
    showTimeBlock = false;
  }

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div
      className={`flex-1 grid grid-cols-9 gap-2 ${
        isWeek ? "border-b-[1px] h-16" : "border"
      }  border-gray-200`}
    >
      {showTimeBlock && (
        <div
          className={`${
            showTimeBlock && isWeek ? "col-span-9" : "col-span-1"
          } ${
            isWeek ? "" : "border-r-2"
          }  border-gray-200 flex justify-center items-center`}
        >
          <p
            className={`text-center text-sm ${getCurrentTimeClass()} w-full h-full flex justify-center items-center`}
          >
            <span className="m-auto">{startTime}</span>
          </p>
        </div>
      )}
      {showEvent && (
        <div
          className={`${
            showEvent && isWeek ? "col-span-9" : "col-span-8 text-center"
          }`}
        >
          {eventsForHour1.map((event, index) => {
            // Display only one event for week and rest in modal
            if (isWeek && index > 0) {
              return null;
            }

            return (
              <div
                key={index + 1}
                className={`cursor-pointer m-auto ${isWeek ? "" : "w-3/4"}`}
                onClick={() => handleEventClick(event)}
              >
                <div
                  className="text-sm calendar-event-conatiner"
                  style={{
                    boxShadow: "4px 4px 15px 2px rgba(0, 0, 0, 0.1)",
                    borderRadius: "3px",
                    background: "#fff",
                  }}
                >
                  {event?.length > 1 && (
                    <span className="absolute right-[4px] top-[-7px] notification-count bg-yellow-400 rounded-full text-white text-center h-[23px] w-[23px]">
                      {event?.length}
                    </span>
                  )}
                  <div className="line-clamp-1 bg-background-primary-main text-white p-[5px] rounded-sm">
                    <div className="text-xs font-normal truncate">
                      {event.title}
                    </div>
                  </div>
                  <div
                    className={`meeting-details ${
                      isWeek ? "" : "flex justify-around gap-x-2"
                    } px-2 pt-2 pb-3`}
                  >
                    <div
                      className={`mb-2 ${
                        isWeek ? "meeting-scheduler" : ""
                      } text-xs`}
                    >
                      Instructor : {event?.created_by}
                    </div>
                    <div
                      className={`text-[12px] meeting-time`}
                      style={{ color: "rgba(40, 41, 59, 1)" }}
                    >
                      Time: {moment(event.start, "HH:mm").format("hh:mm A")} -
                      {moment(event.end, "HH:mm").format("hh:mm A")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isWeek && eventsForHour.length > 1 && (
            <div
              className="flex items-center justify-center mt-2 text-sm text-[#FE634E] cursor-pointer"
              onClick={() => {
                setShowModal(true);
              }}
            >
              +{eventsForHour.length - 1} more
            </div>
          )}
        </div>
      )}
      {showModal && (
        <EventModal
          open={showModal}
          eventDate={`${startTime}-${endTime}`}
          closeModal={toggleModal}
          event={selectedEvent}
          actionActionBtn={actionActionBtn}
          fetchEvents={fetchEvents}
          deleteAppointment={deleteAppointment}
        />
      )}
    </div>
  );
}
