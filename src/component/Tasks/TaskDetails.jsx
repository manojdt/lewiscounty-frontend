import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import UploadIcon from '../../assets/images/image_1x.png';
import DeleteIcon from '../../assets/images/delete_1x.png';
import CancelIcon from '../../assets/images/cancel-colour1x.png';
import EditIcon from '../../assets/images/Edit1x.png';
import FileIcon from '../../assets/icons/linkIcon.svg';
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { Button } from '../../shared';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProgramTaskDetails,
  submitProgramTaskDetails,
  updateTaskSubmission,
  updateUserProgramInfo,
} from '../../services/userprograms';
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  allowedDocTypes,
  allowedImagesTypes,
  allowedVideoTypes,
  programStatus,
  TaskAllStatus,
  TaskFileTypes,
  TaskStatus,
} from '../../utils/constant';
import { useForm } from 'react-hook-form';
import ToastNotification from '../../shared/Toast';
import { getSpecificTask } from '../../services/task';
import { getFiles } from '../../utils';
import api from '../../services/api';
import HtmlReport from '../../shared/htmlReport';
import moment from 'moment';
import { allTask, completedTask, draftTask, newTask, pendingTask, reassignTask, rejectedTask, requestPageBreadcrumbs, waitTask } from '../Breadcrumbs/BreadcrumbsCommonData';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

export const TaskDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [searchParams] = useSearchParams();
  const breadcrumbsType = searchParams.get("breadcrumbsType") || "";
    const [breadcrumbsArray, setBreadcrumbsArray] = useState([]);
  const {
    taskdetails: {
      task,
      program,
      task_status,
      task_assigned_by,
      task_submission = {},
    },
    status,loading:load
  } = useSelector((state) => state.userPrograms);
  const { task: taskData, loading } = useSelector((state) => state.tasks);
  const [startTask, setStartTask] = useState(true);
  const [taskStatus, setTaskStatus] = useState('');
  const params = useParams();

  const [taskImages, setTaskImages] = useState([]);
  const [imageError, setImageError] = useState({
    error: false,
    errorMessage: '',
  });
  const [taskSolutionDocs, setTaskSolutionDocs] = useState({
    img: [],
    video: [],
    doc: [],
  });
  const [successModal, setSuccessModal] = useState({
    loading: false,
    success: false,
  });
  const [isPreview, setIsPreview] = React.useState(false);
  const [formAction, setFormAction] = React.useState('');
  const [taskFile, setTaskFile] = React.useState([]);
  const [deletedFile, setDelectedFile] = React.useState([]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setError,
    setValue,
    watch,
  } = useForm();

  const allFields = watch();

  const referenceView = taskData?.reference_link || '';

  const docs = referenceView !== '' ? referenceView?.split(',') || [] : [];

  useEffect(() => {
    if (["pending", "new", "inprogress"].includes(taskData?.status)) {
      setValue("task_solution", "")
    }
  }, [taskData?.status])

  const handleImageUpload = (field, e) => {
    if (e.target.files && e.target.files[0]) {
      setTaskFile([...taskFile, { ...e.target.files, row_id: uuidv4() }]);
      setValue(field, [...taskFile, { ...e.target.files, row_id: uuidv4() }]);
    }
  };
  const handleReset = () => {
    reset();
    setTaskImages([]);
  };

  const handleDelete = (id) => {
    const taskDocs = taskFile.filter((task) => task.row_id !== id);
    if (!taskDocs.length) {
      setValue('file', '');
    }
    setTaskFile(taskDocs);
    if (id) {
      setDelectedFile([
        ...deletedFile,
        taskFile.filter((task) => task.row_id === id)?.[0]?.id,
      ]);
    }
  };
  const submitTask = (type = "", formData) => {
    if (type === "draft") {
      dispatch(updateTaskSubmission(formData)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setValue("task_solution", "")
        }
      })
    } else if (type === "submit") {
      dispatch(submitProgramTaskDetails(formData)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setValue("task_solution", "")
        }
      })
    }
  }

  const onSubmit = (data, type) => {
    if (!taskFile.length) {
      setImageError({ error: true, errorMessage: 'This field is required' });
      return;
    }

    if (taskFile.length) {
      let bodyFormData = new FormData();

      taskFile.forEach((element, index) => {
        if (!element?.id) {
          bodyFormData.append('file_1', element[0]);
        }
      });

      bodyFormData.append('task_solution', data.task_solution);
      bodyFormData.append('task_id', parseInt(params.id));
      if (deletedFile?.length) {
        bodyFormData.append('deleted', JSON.stringify(deletedFile));
      }
      if (type === 'submit') {
        bodyFormData.append('status', 'completed');
      }

      if (type === 'submit' && (taskData?.status === 'draft' || taskData?.status === 'reassigned')) {
        submitTask("draft", bodyFormData)
      } else if (type === 'draft' && (taskData?.status === 'draft' || taskData?.status === 'reassigned')) {
        submitTask("draft", bodyFormData)
      } else if (type === 'submit' && ['inprogress', 'pending'].includes(taskData?.status)) {
        submitTask("submit", bodyFormData)
      } else if (type === 'draft' && ['inprogress', 'pending'].includes(taskData?.status)) {
        submitTask("submit", bodyFormData)
      }
    }
  };

  const handleTaskAction = async () => {
    setSuccessModal({ loading: true, success: false });
    const startTask = await api.patch('program_task_assign/task_start', {
      task_id: taskData.id,
    });
    if (startTask.status === 200 && startTask.data) {
      setSuccessModal({ loading: false, success: true });
      setTimeout(() => {
        dispatch(updateUserProgramInfo({ status: '' }));
        setSuccessModal({ loading: false, success: false });
        dispatch(getSpecificTask({ task_id: params.id }));
      }, [2000]);
    }
  };

  useEffect(() => {
    if (status === programStatus.tasksubmitted) {
      setTimeout(() => {
        dispatch(updateUserProgramInfo({ status: '' }));
        navigate('/mentee-tasks');
      }, [2000]);
    }
  }, [status]);

  useEffect(() => {
    let allTaskDocuments = { img: [], video: [], doc: [] };
    allTaskDocuments = getFiles(taskFile);
    setTaskSolutionDocs((prevState)=>allTaskDocuments);
  }, [taskFile]);

  useEffect(() => {
    dispatch(getProgramTaskDetails(params.id));
    dispatch(getSpecificTask({ task_id: params.id })).then((res) => {
      if (res?.meta?.requestStatus === 'fulfilled') {
        const files = res?.payload?.files?.map((e) => {
          return {
            ...e,
            row_id: uuidv4()
          }
        });
        setValue("task_solution", res?.payload?.task_solution)
        setValue('file', files ?? [], {
          shouldValidate: taskData?.statue === 'draft' ? false : true,
        });
        console.log("from set ===>", allFields)
        setTaskFile(files ?? []);
      }
    });
  }, []);

  useEffect(() => {
    if (task_submission && Object.keys(task_submission).length) {
      reset({
        task_solution: task_submission?.task_solution || '',
      });
    }
  }, [task_submission]);

  const allFiles = getFiles(taskFile || []);
  const handleBreadcrumbs = (key) => {
    const task = allTask(taskData?.task_name);
    const newTaskPage = newTask(taskData?.task_name);
    const pendingTaskPage = pendingTask(taskData?.task_name);
    const waitingTaskPage = waitTask(taskData?.task_name);
    const reassignedTaskPage = reassignTask(taskData?.task_name);
    const completedTaskPage = completedTask(taskData?.task_name);
    const rejectedTaskPage = rejectedTask(taskData?.task_name);
    const draftTaskPage = draftTask(taskData?.task_name);
   
    
    switch (key) {
      case requestPageBreadcrumbs.taskMenteeAllReport:
        setBreadcrumbsArray(task);
        break;
      case requestPageBreadcrumbs.taskMenteeNewReport:
        setBreadcrumbsArray(newTaskPage);
        break;
      case requestPageBreadcrumbs.taskMenteePendingReport:
        setBreadcrumbsArray(pendingTaskPage);
        break;
      case requestPageBreadcrumbs.taskMenteeWaitReport:
        setBreadcrumbsArray(waitingTaskPage);
        break;
      case requestPageBreadcrumbs.taskMenteeReassignedReport:
        setBreadcrumbsArray(reassignedTaskPage);
        break;
      case requestPageBreadcrumbs.taskMenteeCompletedReport:
        setBreadcrumbsArray(completedTaskPage);
        break;
      case requestPageBreadcrumbs.taskMenteeRejectedReport:
        setBreadcrumbsArray(rejectedTaskPage);
        break;
      case requestPageBreadcrumbs.taskMenteeDraftReport:
        setBreadcrumbsArray(draftTaskPage);
        break;
      case "discussion":
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (breadcrumbsType &&taskData?.task_name) {
      handleBreadcrumbs(breadcrumbsType);
    }
  }, [breadcrumbsType, taskData]);
  return (
    <div className='px-9 py-9'>      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={status === programStatus.tasksubmitted}
      >
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
              {formAction === 'draft'
                ? 'Task Drafted Successfully'
                : 'Task Submitted Successfully'}
            </p>
          </div>
        </div>
      </Backdrop>

      {/* {imageError.error && <ToastNotification openToaster={imageError.error} message={imageError.message} toastType='error' />} */}

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
                Successfully task is started
              </p>
            </div>
          </div>
        ) : (
          <CircularProgress color='inherit' />
        )}
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
      >
       
          <CircularProgress color='inherit' />
      
      </Backdrop>

      <div
        className='px-3 py-5'
        style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}
      >
        <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
          <div className='flex gap-5 items-center text-[20px]'>
           {!breadcrumbsType? <p>Task Details</p>:
            <Breadcrumbs items={breadcrumbsArray} />}
            {params.id === '2' && !startTask && (
              <div
                className='inset-y-0 end-0 flex items-center pe-3 cursor-pointer'
                onClick={() => navigate('/programs')}
              >
                <img src={EditIcon} alt='EditIcon' />
              </div>
            )}
          </div>

          <div className='flex gap-8 items-center'>
            <div className='relative'>
              <div
                className='inset-y-0 end-0 flex items-center pe-3 cursor-pointer'
                onClick={() => navigate('/mentee-tasks')}
              >
                <img src={CancelIcon} alt='CancelIcon' />
              </div>
            </div>
          </div>
        </div>

        {!loading && Object.keys(taskData).length && (
          <div className='px-4'>
            <div className='relative flex gap-6 justify-between'>
              <table className='w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <tbody style={{ border: '1px solid rgba(0, 174, 189, 1)' }}>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <th
                      scope='row'
                      style={{
                        border: '1px solid rgba(0, 174, 189, 1)',
                        background: '#fff',
                      }}
                      className='px-6 py-4 font-medium whitespace-nowrap '
                    >
                      Assigned Date
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(0, 174, 189, 1)' }}
                    >
                      {taskData?.created_at? moment(taskData?.created_at).format("MM-DD-YYYY") : "-"}
                    </td>
                  </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <th
                      style={{
                        border: '1px solid rgba(0, 174, 189, 1)',
                        background: '#fff',
                      }}
                      scope='row'
                      className='px-6 py-4 font-medium  whitespace-nowrap '
                    >
                      Task Name
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(0, 174, 189, 1)' }}
                    >
                      {taskData?.task_name}
                    </td>
                  </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 '>
                    <th
                      style={{
                        border: '1px solid rgba(0, 174, 189, 1)',
                        background: '#fff',
                      }}
                      scope='row'
                      className='px-6 py-4 font-medium whitespace-nowrap '
                    >
                      Program Name
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(0, 174, 189, 1)' }}
                    >
                      {taskData?.program_name}
                    </td>
                  </tr>
                  <tr className='bg-white border-b  dark:bg-gray-800'>
                    <th
                      style={{
                        border: '1px solid rgba(0, 174, 189, 1)',
                        background: '#fff',
                      }}
                      scope='row'
                      className='px-6 py-4 font-medium whitespace-nowrap '
                    >
                      Due Date
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(0, 174, 189, 1)' }}
                    >
                      {/* {taskData['due_date']?.split('T')[0]} */}
                      {taskData?.due_date? moment(taskData?.due_date).format("MM-DD-YYYY") : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className='w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <th
                      scope='row'
                      style={{
                        border: '1px solid rgba(29, 91, 191, 1)',
                        background: '#fff',
                      }}
                      className='px-6 py-4 font-medium whitespace-nowrap '
                    >
                      Completed Date
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(29, 91, 191, 1)' }}
                    >
                      {/* {taskData?.submited_date?.split('T')[0] || '-'} */}
                      {taskData?.submited_date? moment(taskData?.submited_date).format("MM-DD-YYYY") : "-"}
                    </td>
                  </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <th
                      style={{
                        border: '1px solid rgba(29, 91, 191, 1)',
                        background: '#fff',
                      }}
                      scope='row'
                      className='px-6 py-4 font-medium  whitespace-nowrap '
                    >
                      Task assigned by
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(29, 91, 191, 1)' }}
                    >
                      {taskData?.mentor_name}
                    </td>
                  </tr>
                  <tr className='bg-white border-b dark:bg-gray-800 '>
                    <th
                      style={{
                        border: '1px solid rgba(29, 91, 191, 1)',
                        background: '#fff',
                      }}
                      scope='row'
                      className='px-6 py-4 font-medium whitespace-nowrap '
                    >
                      Program Duration
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(29, 91, 191, 1)' }}
                    >
                      {taskData.program_duration} Days
                    </td>
                  </tr>
                  <tr className='bg-white border-b  dark:bg-gray-800'>
                    <th
                      style={{
                        border: '1px solid rgba(29, 91, 191, 1)',
                        background: '#fff',
                      }}
                      scope='row'
                      className='px-6 py-4 font-medium whitespace-nowrap '
                    >
                      Status
                    </th>
                    <td
                      className='px-6 py-4 text-white'
                      style={{ background: 'rgba(29, 91, 191, 1)' }}
                    >
                      {TaskStatus[taskData?.status] || ''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <form onSubmit={handleSubmit((data) => onSubmit(data, formAction))}>
              <div
                className='task-desc flex mt-5 px-5 py-6'
                style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}
              >
                <p className='!text-[16px]' fontWeight={600}>Task Name : </p>
                <p className='text-[14px]'>&nbsp;&nbsp;{taskData?.task_name}</p>
              </div>
              <div
                className='task-desc flex mt-5 px-5 py-6'
                style={{ border: '1px solid rgba(29, 91, 191, 0.5)', marginBottom: "20px" }}
              >
                <p className='!text-[16px]' fontWeight={600}>Task Description : </p>
                <p className='text-[14px]'>&nbsp;&nbsp;{taskData?.task_description}</p>
              </div>

              {(taskData?.reject_task_reason?.length > 0 && taskData?.status === "reassigned") && <div className="action-set action_cancelled mb-4 mt-4">
                <div className="reason-title">{"Re Assign Task Reason"}</div>
                <div className="reason-content">
                  {taskData?.reject_task_reason}
                </div>
              </div>}
                  
              {taskData.status === "rejected"&&!isPreview && (
                    <div className="flex gap-4 pt-10">
                      <button
                        className="py-3 px-16 text-white text-[14px] flex items-center"
                        style={{
                          border: "1px solid #E0382D",
                          borderRadius: "5px",
                          color: "#E0382D",
                          cursor: "not-allowed",
                        }}
                        onClick={() => undefined}
                      >
                        Cancelled
                      </button>
                    </div>
                  )}
              {isPreview && (
                <Box mb={3}>
                  <div style={{ marginTop: '40px' }}>
                    <Typography className='!text-[14px] !text-[#18283D]'>
                      Task Solution
                    </Typography>

                    <Box
                      className='bg-[#1D5BBF] px-[20px] py-[12px] rounded-[3px]'
                      mt={1}
                    >
                      <Typography className='!text-[14px] !text-[#fff]'>
                        {allFields?.task_solution}
                      </Typography>
                    </Box>
                  </div>

                  <div>
                    <div className='flex justify-between task-uploaded-images-container'>
                      {taskSolutionDocs?.image?.length > 0 && (
                        <div>
                          <div
                            className='text-[16px] pt-5'
                            style={{ color: 'rgba(0, 0, 0, 1)', fontWeight: 600 }}
                          >
                            Uploaded Image
                          </div>
                          <Stack>
                            {taskSolutionDocs?.image.map((img, index) => (
                              <a
                                key={index} 
                                href={img.fileurl}  
                                target="_blank"     
                                rel="noopener noreferrer" 
                                onClick={(e) => {
                                  e.preventDefault(); 
                                  window.open(img.fileurl, '_blank'); 
                                }}
                                className="text-[14px] image-name !text-[#18283D] underline"
                              >
                                <span className='text-[14px] image-name !text-[#18283D] underline'>
                                  {img.name}
                                </span>
                              </a>
                            ))}
                          </Stack>
                        </div>
                      )}

                      {taskSolutionDocs?.video?.length > 0 && (
                        <div>
                          <div
                            className='text-[16px] pt-5'
                            style={{ color: 'rgba(0, 0, 0, 1)', fontWeight: 600 }}
                          >
                            Uploaded Video
                          </div>
                          <Stack>
                            {taskSolutionDocs.video.map((img, index) => (
                              <a href={img.fileurl} target='_blank'>
                                <span className='text-[14px] image-name !text-[#18283D] underline'>
                                  {img.name}
                                </span>
                              </a>
                            ))}
                          </Stack>
                        </div>
                      )}
                      {taskSolutionDocs?.doc?.length > 0 && (
                        <div>
                          <div
                            className='text-[16px] pt-5'
                            style={{ color: 'rgba(0, 0, 0, 1)', fontWeight: 600 }}
                          >
                            Uploaded Files
                          </div>
                          <Stack>
                            {taskSolutionDocs.doc.map((img, index) => (
                              <a href={img.fileurl} target='_blank'>
                                <span className='text-[14px] image-name !text-[#18283D] underline'>
                                  {img.name}
                                </span>
                              </a>
                            ))}
                          </Stack>
                        </div>
                      )}
                    </div>
                  </div>
                </Box>
              )}

              {(!isPreview && ["inprogress","waiting_for_approval","completed","pending","draft", "reassigned"].includes(taskData.status)) && (
                <div className='py-6 mb-16'>
                  {taskData.status === TaskAllStatus.inprogress ||
                    taskData.status === TaskAllStatus.pending ||
                    taskData.status === TaskAllStatus.draft ||
                    taskData?.status === "reassigned"
                     ? (
                    <>
                      <div className='relative'>
                        <label className='block tracking-wide text-gray-700 text-xs font-bold mb-2'>
                          Task Solution
                        </label>
                        <textarea
                          id='message'
                          rows='4'
                          className={`block p-2.5 input-bg w-full h-[170px] text-sm text-gray-900  rounded-lg border
                                                        focus-visible:outline-none focus:visible:border-none`}
                          style={{
                            border: errors['task_solution']
                              ? '2px solid red'
                              : 'none',

                            cursor:
                              taskData.status === TaskAllStatus.rejected
                                ? 'not-allowed'
                                : 'inherit',
                          }}
                          placeholder=''
                          {...register('task_solution', {
                            required: 'This field is required',
                          })}
                          value={getValues("task_solution")}
                          onChange={(e) => setValue("task_solution", e.target.value)}
                          disabled={
                            taskData.status === TaskAllStatus.rejected ||
                            taskData.status === TaskAllStatus.completed
                          }
                        ></textarea>
                        {errors['task_solution'] && (
                          <p className='error' role='alert'>
                            {errors['task_solution'].message}
                          </p>
                        )}
                      </div>

                      <div className='relative mt-12'>
                        <div className='flex items-center justify-center w-full'>
                          <label
                            htmlFor='dropzone-file'
                            className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed cursor-pointer
                                                     bg-gray-50 dark:hover:bg-bray-800 dark:border-gray-600'
                            style={{
                              background: 'rgba(243, 247, 252, 1)',
                              border:
                                imageError.error || errors['file']
                                  ? '2px dashed red'
                                  : 'none',

                              cursor:
                                taskData.status === TaskAllStatus.newtask ||
                                  taskData.status === TaskAllStatus.pending ||
                                  taskData.status === TaskAllStatus.inprogress ||
                                  taskData.status === 'draft' ||
                                  taskData.status === "reassigned"
                                  ? 'pointer'
                                  : 'not-allowed',
                            }}
                          >
                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                              <img src={FileIcon} alt='FileIcon' />
                              <p className='mb-2 mt-3 text-sm text-gray-500 dark:text-gray-400'>
                                <span className='font-semibold'>
                                  Drop your Image ,video, document or browse
                                </span>
                              </p>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>
                                supports: JPG,PNG,PDF,DOC
                              </p>
                            </div>
                            <input
                              id='dropzone-file'
                              type='file'
                              name='file'
                              {...register('file')}
                              onChange={(e) => {
                                if (
                                  taskData.status ===
                                  TaskAllStatus.inprogress ||
                                  taskData.status === TaskAllStatus.newtask ||
                                  taskData.status === TaskAllStatus.pending ||
                                  taskData.status === 'draft' ||
                                  taskData.status === "reassigned"
                                ) {
                                  // imageField?.onChange(e);
                                  handleImageUpload('file', e);
                                } else {
                                  return undefined;
                                }
                              }}
                              disabled={
                                taskData.status === TaskAllStatus.rejected ||
                                taskData.status === TaskAllStatus.completed
                              }
                              className='hidden'
                            />
                          </label>
                        </div>
                        {(imageError.error || errors['file']) && (
                          <p className='error' role='alert'>
                            {errors['file']?.message}
                          </p>
                        )}
                      </div>

                      {
                        <div>
                          <div className='flex justify-between task-uploaded-images-container'>
                            {taskSolutionDocs?.image?.length > 0 && (
                              <div>
                                <div
                                  className='text-[14px] pt-5'
                                  style={{ color: 'rgba(0, 0, 0, 1)' }}
                                >
                                  Uploaded Image
                                </div>
                                {taskSolutionDocs.image.map((img, index) => (
                                  <div
                                    className='uploaded-images task-image-list'
                                    key={index}
                                  >
                                    <div
                                      className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                      style={{
                                        border:
                                          '1px solid rgba(29, 91, 191, 0.5)',
                                        borderRadius: '3px',
                                      }}
                                    >
                                      <div className='flex gap-3 items-center'>
                                        <img src={UploadIcon} alt='altlogo' />
                                        <span className='text-[12px] image-name'>
                                          {img?.name}
                                        </span>
                                      </div>
                                      <img
                                        className='w-[30px] cursor-pointer'
                                        onClick={() => handleDelete(img?.row_id)}
                                        src={DeleteIcon}
                                        alt='DeleteIcon'
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {taskSolutionDocs?.video?.length > 0 && (
                              <div>
                                <div
                                  className='text-[14px] pt-5'
                                  style={{ color: 'rgba(0, 0, 0, 1)' }}
                                >
                                  Uploaded Video
                                </div>

                                {taskSolutionDocs.video.map((img, index) => (
                                  <div
                                    className='uploaded-images task-image-list'
                                    key={index}
                                  >
                                    <div
                                      className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                      style={{
                                        border:
                                          '1px solid rgba(29, 91, 191, 0.5)',
                                        borderRadius: '3px',
                                      }}
                                    >
                                      <div className='flex gap-3 items-center'>
                                        <img src={UploadIcon} alt='altlogo' />
                                        <span className='text-[12px] image-name'>
                                          {img?.name}
                                        </span>
                                      </div>
                                      <img
                                        className='w-[30px] cursor-pointer'
                                        onClick={() => handleDelete(img?.row_id)}
                                        src={DeleteIcon}
                                        alt='DeleteIcon'
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {taskSolutionDocs?.doc?.length > 0 && (
                              <div>
                                <div
                                  className='text-[14px] pt-5'
                                  style={{ color: 'rgba(0, 0, 0, 1)' }}
                                >
                                  Uploaded Files
                                </div>

                                {taskSolutionDocs.doc.map((img, index) => (
                                  <div
                                    className='uploaded-images task-image-list'
                                    key={index}
                                  >
                                    <div
                                      className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                      style={{
                                        border:
                                          '1px solid rgba(29, 91, 191, 0.5)',
                                        borderRadius: '3px',
                                      }}
                                    >
                                      <div className='flex gap-3 items-center'>
                                        <img src={UploadIcon} alt='altlogo' />
                                        <span className='text-[12px] image-name'>
                                          {img?.name}
                                        </span>
                                      </div>
                                      <img
                                        className='w-[30px] cursor-pointer'
                                        onClick={() => handleDelete(img?.row_id)}
                                        src={DeleteIcon}
                                        alt='DeleteIcon'
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    </>
                  ) : taskData?.status !== TaskAllStatus.yettostart ||
                    taskData?.status !== TaskAllStatus.newtask ? (
                    <>
                      {taskData?.task_solution && (
                        <div
                          className='task-desc flex mt-5 px-5 py-6'
                          style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}
                        >
                          <p className='w-[30%]'>Task Solution : </p>
                          <p className='text-[14px]'>
                            {taskData?.task_solution}
                          </p>
                        </div>
                      )}

                      <div className='flex justify-between task-uploaded-images-container'>
                        {allFiles?.files ? (
                          <div>
                            <div
                              className='text-[14px] pt-5'
                              style={{ color: 'rgba(0, 0, 0, 1)' }}
                            >
                              Uploaded Image
                            </div>
                            {allFiles.image.map((imges, index) => (
                              <div
                                className='uploaded-images task-image-list'
                                key={index}
                              >
                                <a href={imges.fileurl} target='_blank'>
                                  <div
                                    className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                    style={{
                                      border:
                                        '1px solid rgba(29, 91, 191, 0.5)',
                                      borderRadius: '3px',
                                    }}
                                  >
                                    <div className='flex gap-3 items-center'>
                                      <img src={UploadIcon} alt='altlogo' />
                                      <span className='text-[12px] image-name'>
                                        {imges.name}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {allFiles?.video?.length > 0 ? (
                          <div>
                            <div
                              className='text-[14px] pt-5'
                              style={{ color: 'rgba(0, 0, 0, 1)' }}
                            >
                              Uploaded Video
                            </div>

                            {allFiles.video.map((imges, index) => (
                              <div
                                className='task-image-list flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                style={{
                                  border: '1px solid rgba(29, 91, 191, 0.5)',
                                  borderRadius: '3px',
                                }}
                                key={index}
                              >
                                <a href={imges.fileurl} target='_blank'>
                                  <div className='flex gap-3 items-center'>
                                    <img src={UploadIcon} alt='altlogo' />
                                    <span className='text-[12px] image-name'>
                                      {imges.name}
                                    </span>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {allFiles?.doc?.length > 0 ? (
                          <div>
                            <div
                              className='text-[14px] pt-5'
                              style={{ color: 'rgba(0, 0, 0, 1)' }}
                            >
                              Uploaded Files
                            </div>

                            {allFiles.doc.map((imges, index) => (
                              <div
                                className='task-image-list flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                style={{
                                  border: '1px solid rgba(29, 91, 191, 0.5)',
                                  borderRadius: '3px',
                                }}
                                key={index}
                              >
                                <a href={imges.fileurl} target='_blank'>
                                  <div className='flex gap-3 items-center'>
                                    <img src={UploadIcon} alt='altlogo' />
                                    <span className='text-[12px] image-name'>
                                      {imges.name}
                                    </span>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}                  
                  <div className='reference-link flex justify-between mb-8'>
                    <div className='reference-view'>
                      <p className='py-4'>Reference View</p>
                      <ul className='leading-10'>
                        {docs?.map((doc, index) => (
                          <li key={index}>
                            {index + 1}. <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {taskData.result !== '' &&
                taskData.result !== null &&
                taskData.result !== '----' && (
                  <Stack direction={"row"} alignItems={"center"} spacing={3}>
                    <div className='mr-96'>Result :</div>
                    <div
                      style={{
                        background:
                          taskData.result === 'Pass'
                            ? 'rgba(235, 255, 243, 1)'
                            : 'rgba(255, 231, 231, 1)',
                        padding: '8px 16px',
                        textAlign: 'center',
                        fontSize: '18px',
                      }}
                    >
                      <span
                        style={{
                          color:
                            taskData.result === 'Pass'
                              ? 'rgba(22, 182, 129, 1)'
                              : 'rgba(224, 56, 45, 1)',
                        }}
                      >
                        {taskData.result}
                      </span>
                    </div>
                  </Stack>
                )}
              <div className='close-btn flex justify-center gap-7 pb-5'>
                <Button
                  btnName='Cancel'
                  btnCls='w-[12%]'
                  btnCategory='secondary'
                  onClick={() => navigate('/mentee-tasks')}
                />
                {(taskData.status === TaskAllStatus.draft ||
                  taskData.status === TaskAllStatus.inprogress || taskData?.status === "reassigned") && (
                    <>
                      <Button
                        btnType='submit'
                        btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                        btnName='Draft'
                        style={{
                          background: 'rgba(217, 228, 242, 1)',
                          color: 'rgba(29, 91, 191, 1)',
                        }}
                        onClick={() => setFormAction('draft')}
                      />
                      <Button
                        btnType='button'
                        btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                        onClick={() => setIsPreview(!isPreview)}
                        btnName={isPreview ? 'Edit' : 'Preview'}
                        style={{
                          background: '#A7B5CA',
                          color: '#18283D',
                        }}
                      />
                      <Button
                        btnType='submit'
                        btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                        btnName='Submit to Mentor'
                        btnCategory='primary'
                        onClick={() => setFormAction('submit')}
                      />
                    </>
                  )}
                {(taskData?.status === TaskAllStatus.yettostart ||
                  taskData.status === TaskAllStatus.pending ||
                  taskData?.status === TaskAllStatus.newtask) && (
                    <Button
                      btnType='button'
                      btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                      onClick={handleTaskAction}
                      btnName='Start Task'
                      btnCategory='primary'
                    />
                  )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
