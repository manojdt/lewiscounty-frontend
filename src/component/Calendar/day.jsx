import dayjs from "dayjs";
import React, { useState } from "react";
import TodayView from "./TodayView";
import EventModal from "./EventModal";
import MultiEventModal from "./MultiEventModal";
import moment from "moment";
import { useTheme } from "@mui/material";

export default function Day({
  day,
  rowIdx,
  colIdx,
  savedEvents,
  isMonth,
  isWeek,
  fetchEvents,
  deleteAppointment,
  newData,
  currentMonth,
  actionActionBtn,
  currentYear,
}) {
  const {
    palette: {
      primary: { main },
    },
  } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? `bg-[${main}] text-white rounded-full w-5 h-5 mt-2 mr-2`
      : "pt-2 pr-2";
  }

  const eventsForDay = savedEvents.filter((event) => {
    return (
      new Date(day).toDateString() === new Date(event.start).toDateString()
    );
  });

  const renderData = newData.filter((event) => {
    return new Date(day).toDateString() === new Date(event.date).toDateString();
  });

  // const displayedEvents = eventsForDay.slice(0, isWeek ? 10 : 2);

  const openEvent = () => {
    setShowModal(true);
  };

  const isCurrentMonth = (seconds) => {
    const date = new Date(seconds);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  };

  return (
    <>
      <div
        className={`border border-gray-200 flex flex-col ${
          rowIdx === 0 || isMonth ? "min-h-36" : isWeek ? "" : "h-screen"
        } `}
      >
        {rowIdx === 0 ? (
          <div
            className="flex items-center justify-center min-h-36 text-sm "
            style={{ color: "rgba(24, 40, 61, 1)", fontWeight: 600 }}
          >
            {day}
          </div>
        ) : (
          <div
            className={`${
              isWeek ? "border-b-[1px] py-2" : ""
            } flex justify-end`}
          >
            <div
              className={`text-center text-sm ${getCurrentDayClass()}`}
              data-attr={day}
              data-col={colIdx}
              style={{ display: `${!isCurrentMonth(day) ? "none" : "block"}` }}
            >
              {colIdx === 0 ? "-" : day.format("DD")}
            </div>
          </div>
        )}
        {!isWeek ? (
          <>
            {rowIdx !== 0 && renderData.length ? (
              <div
                className="mt-2 cursor-pointer text-sm mb-4 mx-2 relative calendar-event-conatiner"
                style={{
                  boxShadow: "4px 4px 15px 2px rgba(0, 0, 0, 0.1)",
                  borderRadius: "3px",
                  background: "#fff",
                }}
                onClick={() => {
                  openEvent(renderData);
                }}
              >
                {renderData.length > 1 && (
                  <span
                    className="absolute right-[4px] top-[-7px] notification-count bg-yellow-400 rounded-full text-white text-center h-[23px] w-[23px]"
                  >
                    {renderData.length}
                  </span>
                )}

                <div
                  className="line-clamp-1 bg-background-primary-main text-white p-[5px] rounded-sm"
                  title={renderData[0]?.title}
                >
                  {renderData[0]?.title}{" "}
                </div>
                <div className="meeting-details px-2 pt-2 pb-3">
                  <div className="mb-2 meeting-scheduler">
                    Instructor : {renderData[0]?.created_by}
                  </div>
                  <div
                    className="text-[10px] meeting-time"
                    style={{ color: "rgba(40, 41, 59, 1)" }}
                  >
                    Time:{" "}
                    {moment(renderData[0]?.start, "HH:mm").format("hh:mm A")} -
                    {moment(renderData[0]?.end, "HH:mm").format("hh:mm A")}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {rowIdx > 0 && (
              <TodayView
                currentDate={new Date(day)}
                key={rowIdx}
                rowIdx={rowIdx}
                colIdx={colIdx}
                isWeek={true}
                actionActionBtn={actionActionBtn}
                savedEvents={eventsForDay}
                fetchEvents={fetchEvents}
                deleteAppointment={deleteAppointment}
                newData={newData}
                renderData={renderData}
              />
            )}
          </>
        )}
      </div>

      {showModal && renderData.length > 1 && (
        <MultiEventModal
          actionActionBtn={actionActionBtn}
          open={showModal}
          closeModal={toggleModal}
          events={renderData}
        />
      )}

      {showModal && renderData.length === 1 && (
        <EventModal
          open={showModal}
          closeModal={toggleModal}
          actionActionBtn={actionActionBtn}
          event={renderData[0]}
        />
      )}
    </>
  );
}
