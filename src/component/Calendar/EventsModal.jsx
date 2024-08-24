import React from "react";
import MuiModal from "../../shared/Modal";
import Tooltip from "../../shared/Tooltip";
import DeleteIcon from '../../assets/icons/DeleteRed.svg'
import CancelIcon from '../../assets/images/cancel-colour1x.png'

const EventModal = ({ open, closeModal }) => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
        <div className="flex gap-4">
          <h4 style={{ color: 'rgba(24, 40, 61, 1)', fontWeight: 600 }}>Meetings</h4>
        </div>
        <div className="flex gap-20 items-center">
          <Tooltip title="Cancel">
            <img className='cursor-pointer' onClick={closeModal} src={CancelIcon} alt="CancelIcon" />
          </Tooltip>
        </div>
      </div>
      <div className="calendar-events">

        {
          Array.from({ length: 10 }, (_, i) => i + 1).map(i => {
            return (
              <div className="event-list py-3 px-3 border-b-2 font-semibold" style={{ color: 'rgba(24, 40, 61, 1)' }
              }>
                <div className="event-title flex justify-between">
                  <div className="event-name text-[18px]">Teaching Program</div>
                  <img src={DeleteIcon} className="cursor-pointer" alt="DeleteIcon" />
                </div>
                <div className="scheduler py-1">Instructor : John Doe</div>
                <div className="event-details flex gap-4 py-2">
                  <div className="event-date pr-5" style={{ borderRight: '2px solid rgba(214, 214, 214, 1)' }}>Date: 25th Aug 2024</div>
                  <div className="event-time">Time : 10 AM - 11.30 AM</div>
                </div>
              </div>
            )
          })
        }





      </div>
    </MuiModal >
  );
};

export default EventModal;
