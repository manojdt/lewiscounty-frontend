import React from 'react';
import MuiModal from '../../shared/Modal';
import { Button } from '../../shared';
import EditIcon from '../../assets/icons/editIcon.svg'; // Assuming this is an SVG file
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EventModal = ({ open, closeModal, actionActionBtn, event }) => {
  console.log('event', event);

  const navigate = useNavigate();

  const [showGoogleMeetModal, setShowGoogleMeetModal] = useState(false);
  // Map of button names for simplicity
  const actionButtonNames = {
    all: 'Join Meeting',
    upcoming: 'Join Meeting',
    reschedule: 'Join Meeting',
    completed: 'Re-Create',
    cancelled: 'Re-Create',
    draft: 'Create Meeting',
  };

  // Determine the button name
  const actionButtonName = actionButtonNames[actionActionBtn] || 'Join Meeting';

  const onSubmit = () => {
    if (['all', 'upcoming', 'reschedule'].includes(actionActionBtn)) {
      setShowGoogleMeetModal(true);
    } else if (['completed', 'cancelled', 'draft'].includes(actionActionBtn)) {
      navigate('/create-meeting');
    }
  };

  return (
    <MuiModal
      modalOpen={open}
      modalClose={closeModal}
      title='View Cancel Teaching Program'
      headerIcon={
        <IconButton>
          <img
            src={EditIcon}
            alt='Edit Icon'
            style={{ width: '24px', height: '24px' }}
          />
        </IconButton>
      }
    >
      <div className='p-6'>
        {/* Event details */}
        <div className='flex flex-col'>
          <div className='flex gap-4'>
            <div className='bg-blue-700 m-1 w-6 h-6 rounded-md' />
            <div>
              <h2 className='text-2xl font-semibold'>
                {event?.title || 'Title Name'}
              </h2>
              <span className='text-slate-400'>
                {event?.date || 'Wednesday, June 19. 1:00 - 2:00'}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className='text-center space-x-4 mt-4'>
          <Button
            btnName='Cancel'
            btnCls='w-[120px]'
            btnStyle={{
              border: '1px solid rgba(29, 91, 191, 1)',
              color: 'rgba(29, 91, 191, 1)',
            }}
            btnCategory='secondary'
          />
          {(actionActionBtn === 'all' ||
            actionActionBtn === 'upcoming' ||
            actionActionBtn === 'reschedule') && (
            <Button
              btnName='Delete'
              btnCls='w-[120px]'
              btnStyle={{
                border: '1px solid rgba(29, 91, 191, 1)',
                color: 'rgba(29, 91, 191, 1)',
              }}
              btnCategory='secondary'
            />
          )}

          <Button
            btnType='submit'
            btnCls='w-[150px]'
            btnName={actionButtonName}
            btnCategory='primary'
          />
        </div>
      </div>
    </MuiModal>
  );
};

export default EventModal;
