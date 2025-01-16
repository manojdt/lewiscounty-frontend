import React from 'react';

const LogoSlide = () => {
  return (
    <div
      className='flex items-center w-3/4'
      style={{
        background: 'linear-gradient(to right, #1D5BBF, #00AEBD)',
      }}
    >
      <div className='px-4 py-6 text-white md:mx-6 md:p-12'>
        <h1 className='mb-6 text-2xl'>Welcome</h1>
        <h1 className='mb-6 text-5xl'>Mentoring Management Application</h1>
        <p className='text-sm'>
          Simplify, Scale, Succeed with our Mentoring And Volunteer Management
          Software
        </p>
      </div>
    </div>
  );
};

export default LogoSlide;
