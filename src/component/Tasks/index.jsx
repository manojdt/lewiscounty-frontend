import React, { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import DataTable from '../../shared/DataGrid';

import MoreIcon from '../../assets/icons/moreIcon.svg';
import CloseIcon from '../../assets/icons/closeIcon.svg';
import ViewIcon from '../../assets/images/view1x.png';
import SearchIcon from '../../assets/images/search1x.png';
import RequestIcon from '../../assets/images/Requesttask1x.png';
import CancelIcon from '../../assets/images/cancel-colour1x.png';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { taskColumns } from '../../mock';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MuiModal from '../../shared/Modal';
import { Button } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../../services/task';
import StartIcon from '../../assets/icons/startIcon.svg';
import EditIcon from '../../assets/icons/editIcon.svg';
import { Backdrop, CircularProgress } from '@mui/material';
import {
  pipeUrls,
  TaskAllStatus,
  taskStatusColor,
  taskStatusText,
  taskStatusTextMentee,
} from '../../utils/constant';
import { fileNameFromUrl, fileNameString, formatTableNullValues } from '../../utils';
import { updateUserProgramInfo } from '../../services/userprograms';
import api from '../../services/api';
import StatusIndicator from '../../shared/StatusIndicator/StatusIndicator';

export const Tasks = () => {
  const [requestTab, setRequestTab] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTask, setSearchTask] = useState('');
  const open = Boolean(anchorEl);
  const [searchParams] = useSearchParams();
  const [requestTask, setRequestTask] = useState(false);
  const [taskFilesPopup, setTaskFilesPopup] = useState({
    modal: false,
    files: [],
  });
  const [seletedItem, setSelectedItem] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { taskList, loading } = useSelector((state) => state.tasks);
  const [formattedTaskList, setFormattedTaskList] = React.useState([])
  React.useMemo(()=>{
    if(taskList?.results){
      const formattedRowData = formatTableNullValues(taskList?.results)
      setFormattedTaskList(formattedRowData)
    }
  },[taskList])
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [successModal, setSuccessModal] = useState({
    loading: false,
    success: false,
  });
  const handleFileLink = (files) => {
    setTaskFilesPopup({ modal: true, files: files });
  };
  const handleTaskAction = async () => {
    handleClose()
    setSuccessModal({ loading: true, success: false });
    const startTask = await api.patch('program_task_assign/task_start', {
      task_id: seletedItem.id,
    });
    if (startTask.status === 200 && startTask.data) {
      setSuccessModal({ loading: false, success: true });
      setTimeout(() => {
        dispatch(updateUserProgramInfo({ status: '' }));
        setSuccessModal({ loading: false, success: false });
        // dispatch(getSpecificTask({ task_id: params.id }));
        navigate(`/mentee-tasks-details/${seletedItem.id}?breadcrumbsType=${requestTab}`)
      }, [2000]);
    }
  };

  const taskMenuList = [
    {
      name: 'All ',
      key: 'all',
    },
    {
      name: 'New ',
      key: 'newtask',
    },
    {
      name: 'Pending ',
      key: 'pending',
    },
    {
      name: 'Waiting ',
      key: 'waiting_for_approval',
    },
    {
      name: 'Re-Assigned ',
      key: 'reassigned',
    },
    {
      name: 'Completed ',
      key: 'completed',
    },
    {
      name: 'Cancelled ',
      key: 'rejected',
    },
    {
        name: 'Drafts',
        key: 'draft'
    },
  ];

  const list = [...taskColumns].map((column) => {
    if (column.field === 'status') {
      return {
        ...column,
        // renderCell: (params) => {
        //   return (
        //     <>
        //       <div className='cursor-pointer flex items-center h-full relative'>
        //         <span
        //           className='w-[150px] flex justify-center h-[30px] px-3'
        //           style={{
        //             background: taskStatusColor[params.row.status]?.bg || '',
        //             lineHeight: '30px',
        //             borderRadius: '3px',
        //             width: params.row.status==="waiting_for_approval"?'150px':'110px',
        //             height: '34px',
        //             color: taskStatusColor[params.row.status]?.color || '',
        //             fontSize: '12px',
        //           }}
        //         >
        //           {' '}
        //           {taskStatusTextMentee[params.row.status]}
        //         </span>
        //       </div>
        //     </>
        //   );
        // },
        renderCell: (params) => {
          return (
            <div className="flex items-center  h-full w-full">
              <StatusIndicator status={params.row.status}>    
              </StatusIndicator>
            </div>
          );
        },
        
      };
    }
    return column;
  });

  const mentorColumn = [
    ...list,
    {
      field: 'file_by',
      headerName: 'Link',
      flex: 1,
      id: 2,
      renderCell: (params) => {
        if (params.row.files && params.row.files.length) {
          const files = fileNameString(params.row.files);
          return (
            <>
              {
                <div className='flex  items-center'>
                  <a
                    className='underline pr-3'
                    href={params.row.files[0].files}
                    target='_blank'
                    style={{ color: 'rgba(24, 40, 61, 1)' }}
                    title={files.fullName}
                  >
                    {files.filename}
                  </a>
                  {files.remainingCount > 0 && (
                    <span
                      style={{
                        background: 'rgb(217, 228, 242)',
                        color: 'rgb(29, 91, 191)',
                        borderRadius: '50%',
                        fontWeight: 'bold',
                        width: '35px',
                        height: '35px',
                        marginTop: '4px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      className='cursor-pointer'
                      onClick={() => handleFileLink(params.row.files)}
                    >
                      + {files.remainingCount}
                    </span>
                  )}
                </div>
              }
            </>
          );
        }
        return <>...</>;
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      id: 4,
      renderCell: (params) => {
        return (
          <>
            <div
              className='cursor-pointer flex items-center h-full'
              onClick={(e) => handleClick(e, params.row)}
            >
              <img src={MoreIcon} alt='MoreIcon' />
            </div>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                onClick={() =>
                  navigate(`/mentee-tasks-details/${seletedItem.id}?breadcrumbsType=${requestTab}`)
                }
                className='!text-[12px]'
              >
                <img src={ViewIcon} alt='ViewIcon' className='pr-3 w-[30px]' />
                View
              </MenuItem>
              {(seletedItem.status===TaskAllStatus.newtask ||seletedItem.status===TaskAllStatus.pending )&&
              <>
              <MenuItem
                onClick={() =>

                  handleTaskAction()
                }
                className='!text-[12px]'
              >
                <img src={StartIcon} alt='StartIcon' className='pr-3 w-[30px]' />
                Start Interaction Point/Task
              </MenuItem>
              </>}
              {/* {seletedItem.status===TaskAllStatus.waiting_for_approval &&
              <>
              <MenuItem
                onClick={() =>

                  navigate(`/mentee-tasks-details/${seletedItem.id}?breadcrumbsType=${requestTab}`)
                }
                className='!text-[12px]'
              >
                <img src={EditIcon} alt='StartIcon' className='pr-3 w-[30px]' />
               Edit Interaction Point/Task
              </MenuItem>
              </>} */}
              {/* <MenuItem onClick={() => { setAnchorEl(null); setRequestTask(true) }} className='!text-[12px]'>
                            <img src={RequestIcon} alt="RequestIcon" className='pr-3 w-[27px]' />
                            Request Task
                        </MenuItem> */}
                        
            </Menu>
          </>
        );
      },
    },
  ];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, data) => {
    setSelectedItem(data);
    setAnchorEl(event.currentTarget);
  };

  const handleTab = (key) => {
    let typeString = `?type=${key}`;
    if (key === 'all') {
      typeString = '';
    }
    navigate(`${pipeUrls.menteetask}${typeString}`);
    setRequestTab(key);
    setPaginationModel({
      page: 0,
      pageSize: 10,
    });
    handleTaskSearch('');
  };

  const handleTaskSearch = (value) => {
    setSearchTask(value);
  };

  useEffect(() => {
    dispatch(
      getAllTasks({
        search: searchTask,
        page: paginationModel?.page + 1,
        limit: paginationModel?.pageSize,
      })
    );
  }, [searchTask]);
  useEffect(() => {
    const filterType = searchParams.get('type');
    if(filterType){
      handleTab(filterType)
    }
  }, [searchParams.get('type')]);

  useEffect(() => {
    const filterType = searchParams.get('type');

    let query = {};
    if (filterType && filterType !== '') {
      query = { status: filterType };
    }
    dispatch(
      getAllTasks({
        ...query,
        page: paginationModel?.page + 1,
        limit: paginationModel?.pageSize,
      })
    );
  }, [searchParams, paginationModel]);

  return (
    <div className='p-4 sm:p-4 md:p-6 lg:p-9 xl:p-9'>
      <MuiModal
        modalSize='lg'
        modalOpen={requestTask}
        modalClose={() => {
          setRequestTask(false);
        }}
        noheader
      >
        <div className='px-5 py-5'>
          <div
            className='flex justify-center flex-col gap-5  mt-4 mb-4'
            style={{
              border: '1px solid rgba(29, 91, 191, 1)',
              borderRadius: '10px',
            }}
          >
            <div
              className='flex justify-between px-3 py-4 items-center'
              style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}
            >
              <p className='text-[18px]' style={{ color: 'rgba(0, 0, 0, 1)' }}>
                Request Task{' '}
              </p>
              <img
                className='cursor-pointer'
                onClick={() => setRequestTask(false)}
                src={CancelIcon}
                alt='CancelIcon'
              />
            </div>

            <div className='px-5'>
              <div className='relative pb-8'>
                <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2'>
                  Request Title
                </label>

                <div className='relative'>
                  <input
                    type='text'
                    className='w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none 
                                                            focus-visible:outline-none text-[14px] h-[60px]'
                    placeholder={''}
                    style={{
                      color: '#232323',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>

              <div className='relative pb-8'>
                <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2'>
                  Comments
                </label>

                <div className='relative'>
                  <textarea
                    id='message'
                    rows='4'
                    className={`block p-2.5 input-bg w-full text-sm text-gray-900  border
                                                                   focus-visible:outline-none focus-visible:border-none`}
                    placeholder={''}
                  ></textarea>
                </div>
              </div>

              <div className='flex justify-center gap-5 items-center pt-5 pb-10'>
                <Button
                  btnName='Cancel'
                  btnCls='w-[18%]'
                  btnCategory='secondary'
                  onClick={() => setRequestTask(false)}
                />
                <button
                  onClick={() => setRequestTask(false)}
                  className='text-white py-3 px-7 w-[18%]'
                  style={{
                    background:
                      'linear-gradient(93.13deg, #00AEBD -3.05%, #1D5BBF 93.49%)',
                    borderRadius: '3px',
                  }}
                >
                  Submit to Mentor
                </button>
              </div>
            </div>
          </div>
        </div>
      </MuiModal>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={taskFilesPopup.modal}
      >
        <div className='py-3 px-4 bg-white' style={{ borderRadius: '3px' }}>
          <div
            style={{
              border: '1px solid rgba(29, 91, 191, 1)',
              borderRadius: '3px',
            }}
            className='py-2'
          >
            <div
              className='flex justify-between px-3 py-1'
              style={{ borderBottom: '1px solid rgba(29, 91, 191, 1)' }}
            >
              <p style={{ color: 'rgba(29, 91, 191, 1)' }}>
                Reference Link View
              </p>
              <img
                src={CloseIcon}
                alt='CloseIcon'
                className='cursor-pointer'
                onClick={() => setTaskFilesPopup({ modal: false, files: [] })}
              />
            </div>
            <ul className='text-black py-2 px-5 leading-10'>
              {taskFilesPopup.files.map((file, index) => {
                return (
                  <li key={index}>
                    <a
                      href={file.files}
                      style={{
                        color: 'rgba(24, 40, 61, 1)',
                        textDecoration: 'underline',
                      }}
                      target='_blank'
                    >
                      {fileNameFromUrl(file.files)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || successModal.loading || successModal.success}
      >
        {successModal.success ? (
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
                Successfully Interaction Point/Task is started
              </p>
            </div>
          </div>
        ) : (
          <CircularProgress color='inherit' />
        )}
      </Backdrop>
      <div
        className='px-3 py-5'
        style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}
      >
        <div className='flex justify-between px-1 sm:px-1 md:px-2 lg:px-5 xl:px-5  pb-4 mb-8 items-center border-b-2'>
          <div className='flex gap-5 items-center text-[20px]'>
            <p>Interaction Points/Tasks</p>
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
                  // width: '345px',
                }}
                value={searchTask}
                onChange={(e) => handleTaskSearch(e.target.value)}
              />
              <div className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'>
                <img src={SearchIcon} alt='SearchIcon' />
              </div>
            </div>
          </div>
        </div>
        <div className='mx-1 sm:mx-1 md:mx-2 lg:mx-5 xl:mx-5 '>
          <div className='flex gap-3 mb-6 flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row'>
            {taskMenuList.map((actionBtn, index) => (
              <button
                key={index}
                className={`px-5 py-4 text-[14px] !border ${requestTab === actionBtn.key && '!border-[#88B2E8]'}`}
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

          {!loading && (
            <DataTable
              rows={taskList?.results ?? []}
              columns={mentorColumn}
              hideCheckbox
              rowCount={taskList?.count}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          )}
        </div>
      </div>
    </div>
  );
};
