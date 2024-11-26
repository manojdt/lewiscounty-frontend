import React from 'react';
import MuiModal from '../../shared/Modal';
import DeleteIcon from '../../assets/icons/delete-icon.svg';
import { IconButton } from '@mui/material';

const DeleteModal = ({ open, closeModal }) => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className='border border-red-500 rounded-md p-4'>
        <div>
          <div className=''>
            <img src={DeleteIcon} alt='' />
          </div>
          <Button
            btnName='Delete'
            btnCls='w-[120px]'
            btnStyle={{
              border: '1px solid rgba(220, 53, 69, 1)', // Danger red border
              color: 'rgba(220, 53, 69, 1)', // Danger red text
            }}
            btnCategory='secondary'
          />
        </div>
      </div>
    </MuiModal>
  );
};

export default DeleteModal;
