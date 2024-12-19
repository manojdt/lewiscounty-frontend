import { Breadcrumbs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserImage from '../../../assets/icons/user-image.svg';
import ImageIcon from '../../../assets/icons/image-icon.svg';
import DocumentIcon from '../../../assets/icons/documents-icon.svg';
import DownloadIcon from '../../../assets/icons/download-icon.svg';
import { Button } from '../../../shared';
import TicketDeleteModal from './ticket-delete-modal';
import moment from 'moment';
import { TicketStatusColor, user } from '../../../utils/constant';
import CustomTicketAccordian from '../../../shared/custom-accordian/CustomTicketAccordian';
import { useSelector } from 'react-redux';

const ViewTicket = ({ ticket, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.userInfo);
  const role = userInfo.data.role;

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

  const handleNavigate = () => {
    if (role === user.super_admin) {
      return navigate(`/tickets/${ticket.id}?type=start`);
    } else {
      return navigate(`/ticket-creation/${ticket.id}?type=edit`);
    }
  };

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
            {ticket?.created_by_detail?.first_name}{' '}
            {ticket?.created_by_detail?.last_name} (
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
                    {ticket?.subject}
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

        {ticket?.attachment && (
          <CustomTicketAccordian title={'Documents'} defaultValue={true}>
            {/* {ticket?.assignee_attachment &&
              ticket?.assignee_attachment.map((file, index) => ( */}
            <Link
              to={ticket?.attachment}
              target='_blank'
              className='border rounded-md p-3 w-[300px] flex items-center justify-between'
              // key={index}
            >
              <img src={ImageIcon} alt='' />
              <p className='truncate p-2'>{ticket?.attachment}</p>
              <img src={DownloadIcon} alt='' />
            </Link>
            {/* ))} */}
          </CustomTicketAccordian>
        )}
      </div>

      {type === 'view' && (
        <div className='flex gap-6 my-12 justify-center align-middle'>
          <Button
            btnName={`${
              role === user.super_admin ? 'Reject' : 'Cancel request'
            }`}
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
            btnName={`${role === user.super_admin ? 'Start' : 'Edit request'}`}
            // onClick={() => navigate(`/tickets/${ticket.id}?type=start`)}
            onClick={() => handleNavigate()}
            btnCategory='primary'
          />
        </div>
      )}
      {isOpen && <TicketDeleteModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default ViewTicket;
