import React from 'react';
import MuiModal from '../../shared/Modal';
import EditIcon from '../../assets/icons/editIcon.svg';

const EventModal = ({ open, closeModal, event, actionActionBtn }) => {
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
      rightIcon={EditIcon}
      title={`${event.title}`}
    >
      <div className='flex gap-6 justify-center align-middle'>
        <Button
          btnName='Cancel'
          btnCls='w-[170px]'
          btnStyle={{
            border: '1px solid rgba(29, 91, 191, 1)',
            color: 'rgba(29, 91, 191, 1)',
          }}
          btnCategory='secondary'
          //   onClick={() => navigate('/calendar')}
        />
        <Button
          btnName='Draft'
          btnCls='w-[170px]'
          btnStyle={{
            background: 'rgba(217, 228, 242, 1)',
            color: 'rgba(29, 91, 191, 1)',
            border: 'none',
          }}
          btnCategory='secondary'
          onClick={() => console.log('draft')}
        />
        <Button
          btnType='submit'
          onClick={onSubmit}
          btnCls='w-[170px]'
          btnName={'Create Meeting'}
          btnCategory='primary'
        />
      </div>
    </MuiModal>
  );
};

export default EventModal;
