import { Breadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import UserImage from '../../../assets/icons/user-image.svg';
import ImageIcon from '../../../assets/icons/image-icon.svg';
import DocumentIcon from '../../../assets/icons/documents-icon.svg';
import DownloadIcon from '../../../assets/icons/download-icon.svg';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button } from '../../../shared';

const ViewTicket = () => {
  const breadcrumbs = [
    <Link
      variant='body2'
      underline='hover'
      key='1'
      color='inherit'
      to='/tickets'
    >
      Tickets
    </Link>,
    <Typography key='2' variant='body2' color={'primary'}>
      View New Ticket
    </Typography>,
  ];
  return (
    <div className='p-9'>
      <div>
        <Breadcrumbs
          className='pb-4'
          separator={<NavigateNextIcon fontSize='small' />}
          aria-label='breadcrumb'
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className='bg-white p-9 rounded-lg'>
        <div className='border rounded-lg'>
          <div className='p-4 bg-[#D9E4F2] rounded-t-lg'>
            <p>Ticket Details - #001</p>
          </div>
          <div className='p-8 mt-6 grid grid-cols-4 gap-4'>
            <div className='col-span-1 flex items-center justify-center flex-col'>
              <img
                src={UserImage}
                className='ring-8 ring-[#1D5BBF] rounded-full'
                alt=''
              />
              <p className='mt-10 font-semibold'>John Doe (Mentor)</p>
            </div>
            <div className='grid col-span-3 border rounded-lg'>
              <div className='flex-1'>
                <table className='w-full'>
                  <tbody>
                    <tr className='border-b'>
                      <td className='p-4 text-sm border-r'>Subject Name</td>
                      <td className='p-4 text-sm text-gray-600'>
                        I am unable to change the password
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='p-4 text-sm border-r'>Email</td>
                      <td className='p-4 text-sm text-gray-600'>
                        Lorem@gmail.com
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='p-4 text-sm border-r'>Request Date</td>
                      <td className='p-4 text-sm text-gray-600'>2/03/2024</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='p-4 text-sm border-r'>Status</td>
                      <td className='p-4 text-sm'>
                        <span className='text-blue-600'>New</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='mx-9 my-9'>
            <div className='border p-6 rounded-lg flex items-center justify-start gap-4'>
              <h2 className='text-[#1D5BBF] font-semibold'>Description:</h2>
              <p className='text-sm text-gray-600'>
                I am unable to change the password for my account. Please assist
                me with this issue as I need access to my account. Thank you!
              </p>
            </div>

            <div className='border mt-12 rounded-lg'>
              <div className='p-4 bg-[#D9E4F2] rounded-t-lg'>
                <p>Documents</p>
              </div>

              <div className='p-6 flex items-center justify-start gap-4'>
                <div className='border rounded-md p-3 w-[300px] flex items-center justify-between'>
                  <img src={ImageIcon} alt='' />
                  <p>loripusum.jpg</p>
                  <img src={DownloadIcon} alt='' />
                </div>

                <div className='border rounded-md p-3 w-[300px] flex items-center justify-between'>
                  <img src={DownloadIcon} alt='' />
                  <p>loripusum.jpg</p>
                  <img src={DownloadIcon} alt='' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-6 my-12 justify-center align-middle'>
            <Button
              btnName='Reject'
              btnCls='w-[170px]'
              btnStyle={{
                border: '1px solid rgba(220, 53, 69, 1)', // Danger red border
                color: 'rgba(220, 53, 69, 1)', // Danger red text
              }}
              btnCategory='secondary'
              // onClick={() => navigate('/calendar')}
            />

            <Button
              btnType='submit'
              btnCls='w-[170px]'
              btnName={'Start'}
              btnCategory='primary'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
