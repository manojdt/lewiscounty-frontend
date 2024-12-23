import React, { useEffect } from 'react';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CustomTicketAccordian from '../../../shared/custom-accordian/CustomTicketAccordian';
import TicketUpdate from './ticket-update';
import ViewTicket from './ViewTicket';
import { useGetTicketQuery } from '../../../features/tickets/tickets-slice';
import TicketComments from './ticket-comments';
import { useSelector } from 'react-redux';
import { user } from '../../../utils/constant';

const TicketDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const userInfo = useSelector((state) => state.userInfo);
  const role = userInfo.data.role;

  const type = searchParams.get('type');
  console.log(type);

  const {
    data: ticket,
    isLoading: isTicketLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetTicketQuery(id);

  useEffect(() => {
    if (id) {
      refetch(); //
    }
  }, [id, refetch]);

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
          <div className='flex justify-center items-center'>
            <Skeleton
              variant='rectangular'
              sx={{ width: '100%', height: '500px', borderRadius: '10px' }}
            />
          </div>
        ) : (
          <div>
            <CustomTicketAccordian
              title={`${ticket?.created_by_detail?.first_name} ${ticket?.created_by_detail?.last_name} (
            ${ticket?.created_by_detail?.role}) - ${ticket?.id}`}
              defaultValue={type === 'view' ? true : false}
            >
              <ViewTicket ticket={ticket} type={type} />
            </CustomTicketAccordian>
          </div>
        )}

        <div>
          {ticket &&
            ticket.comments &&
            ticket.comments.length > 0 &&
            ticket.comments.map((comment, index) => (
              <CustomTicketAccordian
                title={`${comment?.created_by?.first_name} ${comment?.created_by?.last_name} (
        ${comment?.created_by?.role})`}
              >
                <TicketComments comment={comment} />
              </CustomTicketAccordian>
            ))}
        </div>

        {role === user.super_admin && (
          <div>
            <CustomTicketAccordian
              title={'Enter your update'}
              defaultValue={true}
            >
              <TicketUpdate ticket={ticket} />
            </CustomTicketAccordian>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
