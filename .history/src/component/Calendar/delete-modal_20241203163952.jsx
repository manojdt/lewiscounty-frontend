import React from 'react';
import MuiModal from '../../shared/Modal';
import CloseIcon from '../../assets/icons/closeIcon.svg';
import { IconButton } from '@mui/material';

const DeleteModal = ({ open, closeModal }) => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className='border border-red-500 rounded-md p-4'>
        <div className='flex items-center justify-end'>
          <img src={CloseIcon} alt='' />
        </div>
      </div>
    </MuiModal>
  );
};

export default DeleteModal;
