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
    ></MuiModal>
  );
};

export default EventModal;
