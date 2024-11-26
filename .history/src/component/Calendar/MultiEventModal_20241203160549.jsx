import React, { useState } from 'react';
import MuiModal from '../../shared/Modal';
import Tooltip from '../../shared/Tooltip';
import DeleteIcon from '../../assets/icons/DeleteRed.svg';
import CancelIcon from '../../assets/images/cancel-colour1x.png';
import EventModal from './EventModal';

const MultiEventModal = ({ open, closeModal, renderData }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event

  console.log(renderData);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleEventClick = (item) => {
    setSelectedEvent(item); // Store the clicked item in the selectedEvent state
    setShowModal(true); // Open the EventModal
  };

  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className='title flex justify-between py-3 px-4 border-b-2 items-center'>
        <div className='flex gap-4'>
          <h4 style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600 }}>
            Meetings
          </h4>
        </div>
        <div className='flex gap-20 items-center'>
          <Tooltip title='Cancel'>
            <img
              className='cursor-pointer'
              onClick={closeModal}
              src={CancelIcon}
              alt='CancelIcon'
            />
          </Tooltip>
        </div>
      </div>
      <div className='calendar-events'>
        {renderData &&
          renderData.length &&
          renderData.map((item, index) => {
            return (
              <div
                key={index} // Add a key to each element
                className='event-list py-3 px-3 border-b-2 font-semibold'
                style={{ color: 'rgba(24, 40, 61, 1)' }}
                onClick={() => handleEventClick(item)} // Pass item to the handler
              >
                <div className='event-title flex justify-between'>
                  <div className='event-name text-[18px]'>{item.title}</div>
                  <img
                    src={DeleteIcon}
                    className='cursor-pointer'
                    alt='DeleteIcon'
                  />
                </div>
                <div className='scheduler py-1'>Instructor : John Doe</div>
                <div className='event-details flex gap-4 py-2'>
                  <div
                    className='event-date pr-5'
                    style={{ borderRight: '2px solid rgba(214, 214, 214, 1)' }}
                  >
                    Date: {item.start_date}
                  </div>
                  <div className='event-time'>
                    Time : {item.start} - {item.end}
                  </div>
                </div>
              </div>
            );
          })}
        {showModal && selectedEvent && (
          <EventModal
            open={showModal}
            closeModal={toggleModal}
            event={selectedEvent} // Pass the selected event to the EventModal
          />
        )}
      </div>
    </MuiModal>
  );
};

export default MultiEventModal;
