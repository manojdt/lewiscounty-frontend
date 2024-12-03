import React from 'react';
import MuiModal from '../../shared/Modal';
import CloseIcon from '../../assets/icons/closeIcon.svg';
import { IconButton } from '@mui/material';

const DeleteModal = ({ open, closeModal }) => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className='border border-red-500 rounded-md p-12'>
        <div>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </MuiModal>
  );
};

export default DeleteModal;
