import React from 'react';
import MuiModal from '../../shared/Modal';
import EditIcon from '../../assets/icons/editIcon.svg';

const EventModal = ({ open, closeModal, event }) => {
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
