import { Breadcrumbs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserImage from '../../../assets/icons/user-image.svg';
import ImageIcon from '../../../assets/icons/image-icon.svg';
import DocumentIcon from '../../../assets/icons/documents-icon.svg';
import DownloadIcon from '../../../assets/icons/download-icon.svg';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Button } from '../../../shared';
import TicketDeleteModal from './ticket-delete-modal';
import TicketUpdate from './ticket-update';
import { useGetTicketQuery } from '../../../features/tickets/tickets-slice';
import moment from 'moment';
import { TicketStatusColor } from '../../../utils/constant';
import CustomAccordion from '../../../shared/custom-accordian/CustomTicketAccordian';
import CustomTicketAccordian from '../../../shared/custom-accordian/CustomTicketAccordian';

const ViewTicket = ({ ticket }) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('get specific data', ticket);

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
    <div>
      <div className='p-8 mt-6 grid grid-cols-4 gap-4'>
        <div className='col-span-1 flex items-center justify-center flex-col'>
          <img
            src={ticket?.created_by_detail?.profile_image || UserImage}
            className='ring-8 ring-[#1D5BBF] rounded-full'
            alt=''
          />
          <p className='mt-10 font-semibold'>
            {ticket?.created_by_detail?.full_name} (
            {ticket?.created_by_detail?.role})
          </p>
        </div>
        <div className='grid col-span-3 border rounded-lg'>
          <div className='flex-1'>
            <table className='w-full'>
              <tbody>
                <tr className='border-b'>
                  <td className='p-4 text-sm border-r'>Subject Name</td>
                  <td className='p-4 text-sm text-gray-600'>
                    {ticket?.ticket_subject}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-4 text-sm border-r'>Email</td>
                  <td className='p-4 text-sm text-gray-600'>
                    {ticket?.created_by_detail?.email}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-4 text-sm border-r'>Request Date</td>
                  <td className='p-4 text-sm text-gray-600'>
                    {moment(ticket?.created_at).format('DD/MM/YYYY')}
                  </td>
                </tr>
                <tr className='border-b'>
                  <td className='p-4 text-sm border-r'>Status</td>
                  <td className='p-4 text-sm'>
                    <span
                      className={`capitalize underline`}
                      style={{
                        color: TicketStatusColor[ticket?.status]?.color || '',
                      }}
                    >
                      {ticket?.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='mx-9 my-9 space-y-12'>
        {/* Ticket Details */}
        <div className='border p-6 rounded-lg flex items-center justify-start gap-4'>
          <h2 className='text-[#1D5BBF] font-semibold'>Description:</h2>
          <p className='text-sm text-gray-600'>{ticket?.description}</p>
        </div>
        {/* Documents Upload */}
        <div className='border rounded-lg'>
          <div className='p-4 bg-[#D9E4F2] rounded-t-lg'>
            <p>Documents</p>
          </div>

          <div className='p-6 flex items-center justify-start gap-4'>
            {/* {ticket &&
                  ticket.assignee_attachment.map((file, index) => (
                    <div className='border rounded-md p-3 w-[300px] flex items-center justify-between'>
                      <img src={ImageIcon} alt='' />
                      <p>loripusum.jpg</p>
                      <img src={DownloadIcon} alt='' />
                    </div>
                  ))} */}

            <div className='border rounded-md p-3 w-[300px] flex items-center justify-between'>
              <img src={ImageIcon} alt='' />
              <p>loripusum.jpg</p>
              <img src={DownloadIcon} alt='' />
            </div>
            <div className='border rounded-md p-3 w-[300px] flex items-center justify-between'>
              <img src={DocumentIcon} alt='' />
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
          onClick={() => setIsOpen(true)}
        />

        <Button
          btnType='submit'
          btnCls='w-[170px]'
          btnName={'Start'}
          btnCategory='primary'
        />
      </div>
    </div>
  );
};

export default ViewTicket;
