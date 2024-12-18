import React from 'react';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useParams } from 'react-router-dom';
import CustomTicketAccordian from '../../../shared/custom-accordian/CustomTicketAccordian';
import TicketUpdate from './ticket-update';
import ViewTicket from './ViewTicket';
import { useGetTicketQuery } from '../../../features/tickets/tickets-slice';

const TicketDetails = () => {
  const { id } = useParams();

  const {
    data: ticket,
    isLoading: isTicketLoading,
    isSuccess,
    isError,
    error,
  } = useGetTicketQuery(id);

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
      <Breadcrumbs
        className='pb-4'
        separator={<NavigateNextIcon fontSize='small' />}
        aria-label='breadcrumb'
      >
        {breadcrumbs}
      </Breadcrumbs>

      <div className='bg-white p-9 rounded-xl space-y-12'>
        {isTicketLoading ? (
          <Skeleton sx={{ height: '1000px' }} />
        ) : (
          <div>
            <CustomTicketAccordian
              title={`Ticket Create by ${ticket?.created_by_detail?.full_name} (
            ${ticket?.created_by_detail?.role}) - ${ticket?.ticket_id}`}
              defaultValue={true}
            >
              <ViewTicket ticket={ticket} />
            </CustomTicketAccordian>
          </div>
        )}

        <div>
          <CustomTicketAccordian title={'Hi there'} defaultValue={true}>
            <TicketUpdate />
          </CustomTicketAccordian>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
