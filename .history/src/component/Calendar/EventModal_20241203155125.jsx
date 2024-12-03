import React from 'react';
import MuiModal from '../../shared/Modal';

const EventModal = () => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader></MuiModal>
  );
};

export default EventModal;
