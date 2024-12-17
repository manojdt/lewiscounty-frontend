import { Backdrop } from '@mui/material';
import React from 'react';
import SuccessTik from '../assets/images/blue_tik1x.png';

const SuccessGradientMessage = ({ message }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={createMeetingLoading}
      onClick={() => setCreateMeetingLoading(false)}
    >
      <div className='px-5 py-1 flex justify-center items-center'>
        <div
          className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
          style={{ background: '#fff', borderRadius: '10px' }}
        >
          <img src={SuccessTik} alt='SuccessTik' />
          <p
            className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
            style={{
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </Backdrop>
  );
};

export default SuccessGradientMessage;
