import React from 'react';
import MuiModal from '../../shared/Modal';

const EventModal = ({ open, closeModal }) => {
  return <MuiModal modalOpen={open} modalClose={closeModal}></MuiModal>;
};

export default EventModal;
