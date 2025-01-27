import React, { useState } from 'react';
import SearchIcon from '../../assets/icons/search.svg';
import ViewIcon from '../../assets/images/view1x.png';
import DataTable from '../../shared/DataGrid';
import { discussionData } from '../../mock';
import { discussionColumns } from '../../utils/tableFields';
import { useNavigate } from 'react-router-dom';
import DiscussionDetails from './DiscussionDetails';

export default function Discussions() {
  const navigate = useNavigate();
  const [actionTab, setActiveTab] = useState('new');
  const programRequestTab = [
    {
      name: 'New',
      key: 'new',
    },
    {
      name: 'Active',
      key: 'active',
    },
    {
      name: 'Completed',
      key: 'completed',
    },
    {
      name: 'Archive',
      key: 'archieve',
    },
  ];

  const handleClick = (event, data) => {
    navigate(`/discussions/${data.id}`);
  };

  const discussionColumn = [
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      id: 0,
      renderCell: (params) => {
        return (
          <>
            <div
              className='cursor-pointer flex items-center h-full'
              onClick={(e) => handleClick(e, params.row)}
            >
              <img src={ViewIcon} alt='MoreIcon' />
            </div>
          </>
        );
      },
    },
    ...discussionColumns,
    {
      field: 'chat',
      headerName: 'Chat',
      flex: 1,
      id: 8,
      renderCell: (params) => {
        return (
          <>
            <div
              className='cursor-pointer flex items-center h-full'
              onClick={(e) => handleClick(e, params.row)}
            >
              <button
                style={{
                  background: 'rgba(29, 91, 191, 1)',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '35px',
                  width: '70px',
                  borderRadius: '5px',
                }}
              >
                Chat
              </button>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className='px-2 mt-6 sm:px-2 md:px-6 lg:px-8 xl:px-8 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-10'>
      <div className='mb-5'>Discussions</div>
      <div className='program-request '>
        <div className='col-span-4'>
          <div
            style={{
              boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
            }}
          >
            <div className='px-4 py-7 program-info sm:px-4 md:px-4 lg:px-6 xl:px-6'>
              <div className='flex justify-between px-0 sm:px-0 md:px-0 lg:px-5 xl:px-5 mb-2 sm:mb-2 md:mb-2 lg:mb-5 xl:mb-5 items-start border-b-2 sm:items-start md:items-start lg:items-center xl:items-center'>
                <ul className='tab-list'>
                  {programRequestTab.map((discussion, index) => (
                    <li
                      className={`${
                        actionTab === discussion.key ? 'active' : ''
                      } relative`}
                      key={index}
                      onClick={() => setActiveTab(discussion.key)}
                    >
                      <div> {`${discussion.name}(5)`}</div>
                      {actionTab === discussion.key && <span></span>}
                    </li>
                  ))}
                </ul>
                {/* <div>
                  <div className='relative'>
                    <input
                      type='text'
                      id='search-navbar'
                      className='block p-2 text-sm text-gray-900 border-none'
                      placeholder='Search here...'
                      style={{
                        border: '1px solid rgba(29, 91, 191, 1)',
                        height: '41px',
                        // width: '345px',
                      }}
                    />
                    <div className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'>
                      <img src={SearchIcon} alt='SearchIcon' />
                    </div>
                  </div>
                </div> */}
              </div>
              <DataTable
                rows={discussionData}
                columns={discussionColumn}
                hideCheckbox
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
