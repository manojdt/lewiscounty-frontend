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
// Updated TimeBlock component with fixed time column positioning
function TimeBlock({
  isWeek,
  colIdx,
  time,
  currentDate,
  savedEvents,
  fetchEvents,
  deleteAppointment,
  actionActionBtn,
  newData,
  renderData,
}) {
  const startTime = time.format("h:mm A");
  const endTime = time.add(1, "hour").format("h:mm A");

  function getCurrentTimeClass() {
    return time.format("H") === dayjs().format("H")
      ? "bg-[#FE634E] text-white rounded-md h-5 m-0 w-100"
      : "pt-2";
  }

  // Filter for events in this time slot and day
  const eventsForHour = newData.filter((event) => {
    // Parse the start time from the event (assuming format is "HH:mm")
    const [hours, minutes] = event.start.split(':').map(Number);
    
    // Create a dayjs object from the event date
    const eventDate = dayjs(new Date(event.date));
    
    // Create a dayjs object from the column date (currentDate)
    const columnDate = dayjs(currentDate);
    
    // First check if the event is on the same day as this column
    const isSameDay = eventDate.format('YYYY-MM-DD') === columnDate.format('YYYY-MM-DD');
    
    // Then check if the event's hour matches this time block
    const matchesTimeSlot = hours === time.hour();
    
    // Only return true if both conditions are met
    return isSameDay && matchesTimeSlot;
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEventClick = (item) => {
    setSelectedEvent(item);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // IMPORTANT: Determine if we should show the time column based on column index
  // In week view, only show time in the leftmost column (colIdx === 0)
  const showTimeColumn = !isWeek || (isWeek && colIdx === 0);
  
  return (
    <div className={`border-b border-gray-200 ${isWeek ? "h-16" : ""}`}>
      {/* Use a flex container with no gap between time and events */}
      <div className="flex h-full">
        {/* Time column - only show in first column */}
        {showTimeColumn && (
          <div className="w-20 border-r border-gray-200 flex justify-center items-center">
            <p className={`text-center text-sm ${getCurrentTimeClass()} w-full h-full flex justify-center items-center`}>
              <span className="m-auto">{startTime}</span>
            </p>
          </div>
        )}
        
        {/* Events area - takes remaining width with no gap */}
        <div className="flex-1 flex items-center justify-center">
          {eventsForHour.map((event, index) => {
            // Display only one event for week and rest in modal
            if (isWeek && index > 0) {
              return null;
            }

            return (
              <div
                key={index + 1}
                className="cursor-pointer mx-auto w-11/12"
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
                  <div className="meeting-details px-2 pt-2 pb-3">
                    <div className="mb-2 text-xs">
                      Instructor : {event?.created_by}
                    </div>
                    <div
                      className="text-[12px] meeting-time"
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

          {/* "More" indicator */}
          {isWeek && eventsForHour.length > 1 && (
            <div
              className="flex items-center justify-center mt-2 text-sm text-background-primary-main cursor-pointer"
              onClick={() => {
                setShowModal(true);
              }}
            >
              +{eventsForHour.length - 1} more
            </div>
          )}
        </div>
      </div>
      
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
