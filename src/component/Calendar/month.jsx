import React from 'react';
import Day from './day';
import { getMonth } from '../../utils';
import dayjs from 'dayjs';
export default function Month({
  currentDate,
  savedEvents,
  fetchEvents,
  deleteAppointment,
  newData,
  actionActionBtn,
}) {
  const month = getMonth(currentDate);
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <>
      {/* Desktop/Tablet View - Grid Layout with borders */}
      <div className="hidden md:block">
        <div className="flex-1 grid grid-cols-7">
          {month.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((day, idx) => (
                <Day
                  fetchEvents={fetchEvents}
                  day={day}
                  key={idx}
                  rowIdx={i}
                  colIdx={idx}
                  actionActionBtn={actionActionBtn}
                  savedEvents={savedEvents}
                  deleteAppointment={deleteAppointment}
                  isMonth
                  newData={newData}
                  currentMonth={dayjs(currentDate).month()}
                  currentYear={dayjs(currentDate).year()}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile View - Portrait Layout */}
      <div className="block md:hidden">
        <div className="flex flex-col w-full">
          {weekDays.map((weekDay, dayIndex) => (
            <div key={weekDay} className="mb-4">
              <div className="bg-gray-50 py-2 px-3 text-sm font-semibold border-b">
                {weekDay}
              </div>
              <div className="flex flex-col">
                {month.map((week, weekIndex) => (
                  <Day
                    key={`${weekIndex}-${dayIndex}`}
                    fetchEvents={fetchEvents}
                    day={week[dayIndex]}
                    rowIdx={weekIndex}
                    colIdx={dayIndex}
                    actionActionBtn={actionActionBtn}
                    savedEvents={savedEvents}
                    deleteAppointment={deleteAppointment}
                    isMonth
                    newData={newData}
                    currentMonth={dayjs(currentDate).month()}
                    currentYear={dayjs(currentDate).year()}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
