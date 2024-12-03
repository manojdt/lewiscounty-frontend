import React from 'react';
import MuiModal from '../../shared/Modal';

const DeleteModal = ({ open, closeModal }) => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className='border border-red-500 rounded-md p-12'></div>
    </MuiModal>
  );
};

export default DeleteModal;
