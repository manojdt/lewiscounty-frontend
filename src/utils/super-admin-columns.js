import { dateFormat } from '../utils';

export const TicketsColumns = [
  {
    field: 'ticket_id',
    headerName: 'Ticket Id',
    flex: 1,
    id: 0,
    // renderCell: (params) => {
    //   return <div>{dateFormat(params.row.created_at)}</div>;
    // },
  },
  {
    field: 'ticket_subject',
    headerName: 'Subject Name',
    flex: 1,
    id: 1,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    id: 2,
  },
  {
    field: 'created_by_detail',
    headerName: 'Email',
    flex: 1,
    id: 3,
  },
  {
    field: 'created_at',
    headerName: 'Request date',
    flex: 1,
    id: 4,
    // renderCell: (params) => {
    //   return <div>{dateFormat(params.row.start_date)}</div>;
    // },
  },
  {
    field: 'created_by_detail',
    headerName: 'Request by',
    flex: 1,
    id: 5,
    // renderCell: (params) => {
    //   return <div>{dateFormat(params.row.submited_date)}</div>;
    // },
  },
  {
    field: 'mentor_name',
    headerName: 'Position',
    flex: 1,
    id: 6,
  },
  {
    field: '',
    headerName: 'File size',
    flex: 1,
    id: 7,
  },
  {
    field: '',
    headerName: 'Due date',
    flex: 1,
    id: 8,
  },
  {
    field: '',
    headerName: 'Last update date',
    flex: 1,
    id: 8,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    id: 8,
  },
  {
    field: '',
    headerName: 'Action',
    flex: 1,
    id: 8,
  },
];
