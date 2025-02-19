import dayjs from 'dayjs';
import React, { useState } from 'react';
import TodayView from './TodayView';
import { formatTime } from '../../utils';
import EventModal from './EventModal';
import MultiEventModal from './MultiEventModal';

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
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  function getCurrentDayClass() {
    return day.format('DD-MM-YY') === dayjs().format('MM-DD-YYYY')
      ? 'bg-[#2F9384] text-white rounded-full w-6 h-6 flex items-center justify-center'
      : '';
  }

  const eventsForDay = savedEvents.filter((event) =>
    new Date(day).toDateString() === new Date(event.start).toDateString()
  );

  const renderData = newData.filter((event) =>
    new Date(day).toDateString() === new Date(event.date).toDateString()
  );

  const isCurrentMonth = (seconds) => {
    const date = new Date(seconds);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  };

  if (!isCurrentMonth(day)) {
    return null;
  }

  return (
    <div className={`
      relative
      md:border-[1px] border-gray-200
      ${rowIdx === 0 ? 'md:h-36' : 'min-h-[80px] md:h-36'}
      ${!isMonth ? 'h-screen' : ''}
      ${rowIdx !== 0 ? 'border-t md:border-t-1' : ''}
    `}>
      <div className="flex items-center p-2">
        <div className={getCurrentDayClass()}>
          {day.format('DD')}
        </div>
      </div>

      {renderData.length > 0 && (
        <div
          className="mx-1 sm:mx-1 md:mx-1 lg:mx-2 xl:mx-2 mb-2 cursor-pointer bg-white rounded relative"
          style={{
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => setShowModal(true)}
        >
          {renderData.length > 1 && (
            <span className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center bg-yellow-400 rounded-full text-white text-xs z-10">
              {renderData.length}
            </span>
          )}

          <div className="bg-blue-600 text-white p-2 text-sm rounded-t">
            {renderData[0]?.title}
          </div>
          
          <div className="p-1 sm:p-1 md:p-1 lg:p-2 xl:p-2">
            <div className="text-xs truncate mb-1">
              Mentor: John Doe
            </div>
            <div className="text-xs text-gray-600">
              Time: {formatTime(renderData[0].start)} - {formatTime(renderData[0].end)}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}