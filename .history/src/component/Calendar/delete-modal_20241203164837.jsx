import React from 'react';
import MuiModal from '../../shared/Modal';
import DeleteIcon from '../../assets/icons/delete-icon.svg';
import { Button } from '../../shared';

const DeleteModal = ({ open, closeModal }) => {
  return (
    <MuiModal modalOpen={open} modalClose={closeModal} noheader>
      <div className='border border-red-500 rounded-md p-4'>
        <div className='flex items-center flex-col gap-6'>
          <div className=''>
            <img src={DeleteIcon} alt='' />
          </div>
          <p>Are you sure want to Reschedule Meeting Delete?</p>
          <div>
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
      </div>
    </MuiModal>
  );
};

export default DeleteModal;
