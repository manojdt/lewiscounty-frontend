import React, { useState } from 'react';
import SearchIcon from '../../../assets/images/search1x.png';
import { useNavigate } from 'react-router-dom';

const AdminTickets = () => {
  const navigate = useNavigate();
  const [requestTab, setRequestTab] = useState('all');
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const taskMenuList = [
    {
      name: 'All  Tickets',
      key: 'all',
    },
    {
      name: 'New  Tickets',
      key: 'new_tickets',
    },
    {
      name: 'Pending  Tickets',
      key: 'pending_tickets',
    },
    {
      name: 'In-progress Tickets',
      key: 'in_progress_tickets',
    },
    {
      name: 'Closed Tickets',
      key: 'closed_tickets',
    },
    {
      name: 'Reject Tickets',
      key: 'reject_tickets',
    },
    // {
    //     name: 'Draft',
    //     key: 'draft'
    // },
  ];

  const handleTab = (key) => {
    // let typeString = `?type=${key}`;
    // if (key === 'all') {
    //   typeString = '';
    // }
    // navigate(`${pipeUrls.menteetask}${typeString}`);
    setRequestTab(key);
    // setPaginationModel({
    //   page: 0,
    //   pageSize: 10,
    // });
    // handleTaskSearch('');
  };

  return (
    <div className='p-9'>
      <div
        className='px-3 py-5'
        style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}
      >
        <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
          <div className='flex gap-5 items-center text-[20px]'>
            <p>Tickets</p>
          </div>

          <div className='flex gap-8 items-center'>
            <div className='relative'>
              <input
                type='text'
                id='search-navbar'
                className='block w-full p-2 text-sm text-gray-900 border-none'
                placeholder='Search here...'
                style={{
                  border: '1px solid rgba(29, 91, 191, 1)',
                  height: '41px',
                  width: '345px',
                }}
                // value={searchTask}
                // onChange={(e) => handleTaskSearch(e.target.value)}
              />
              <div className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'>
                <img src={SearchIcon} alt='SearchIcon' />
              </div>
            </div>
          </div>
        </div>
        <div className='mx-5'>
          <div className='flex gap-3 mb-6'>
            {taskMenuList.map((actionBtn, index) => (
              <button
                key={index}
                className='px-5 py-4 text-[14px]'
                style={{
                  background:
                    requestTab === actionBtn.key
                      ? 'linear-gradient(97.86deg, #005DC6 -15.07%, #00B1C0 112.47%)'
                      : 'rgba(249, 249, 249, 1)',
                  color: requestTab === actionBtn.key ? '#fff' : '#000',
                  borderRadius: '3px',
                }}
                onClick={() => handleTab(actionBtn.key)}
              >
                {actionBtn.name}
              </button>
            ))}
          </div>

          {/* {!loading && (
            <DataTable
              rows={taskList?.results ?? []}
              columns={mentorColumn}
              hideCheckbox
              rowCount={taskList?.count}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
