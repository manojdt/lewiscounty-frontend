import React from 'react';
import MuiModal from '../../shared/Modal';
import EditIcon from '../../assets/icons/editIcon.svg';

const EventModal = ({ open, closeModal }) => {
  return (
    <MuiModal
      modalOpen={open}
      modalClose={closeModal}
      rightIcon={EditIcon}
    ></MuiModal>
  );
};

export default EventModal;
