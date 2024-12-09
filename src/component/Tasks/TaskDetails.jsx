import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import UploadIcon from "../../assets/images/image_1x.png"
import DeleteIcon from "../../assets/images/delete_1x.png"
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import EditIcon from '../../assets/images/Edit1x.png'
import FileIcon from '../../assets/icons/linkIcon.svg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { Button } from '../../shared'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProgramTaskDetails, submitProgramTaskDetails, updateUserProgramInfo } from '../../services/userprograms'
import { Backdrop, CircularProgress } from '@mui/material'
import { allowedDocTypes, allowedImagesTypes, allowedVideoTypes, programStatus, TaskAllStatus, TaskFileTypes, TaskStatus } from '../../utils/constant'
import { useForm } from 'react-hook-form'
import ToastNotification from '../../shared/Toast';
import { getSpecificTask } from '../../services/task';
import { getFiles } from '../../utils';
import api from '../../services/api';


export const TaskDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { taskdetails: { task, program, task_status, task_assigned_by, task_submission = {} }, status } = useSelector(state => state.userPrograms)
    const { task: taskData, loading } = useSelector(state => state.tasks)
    const [startTask, setStartTask] = useState(true)
    const [taskStatus, setTaskStatus] = useState('')
    const params = useParams();


    const [taskImages, setTaskImages] = useState([])
    const [imageError, setImageError] = useState({ error: false, errorMessage: '' })
    const [taskSolutionDocs, setTaskSolutionDocs] = useState({ img: [], video: [], doc: [] })
    const [successModal, setSuccessModal] = useState({ loading: false, success: false })


    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setError,
        setValue
    } = useForm();

    const referenceView = taskData?.reference_link || ''

    const docs = referenceView !== '' ? referenceView?.split(',') || [] : []

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {

            const fileName = e.target.files[0].name;
            const fileNameSplit = fileName.split('.')
            const fileExtensionName = fileNameSplit.pop().toLowerCase()
            const fileExtension = TaskFileTypes.includes(fileExtensionName)

            if (fileExtension) {
                setImageError({ error: false, message: '' })
                setTaskImages([...taskImages, { ...e.target.files, id: uuidv4() }]);
            } else {
                // setImageError({ error: true, message: 'Invalid file format. Only JPEG,PNG,PDF,DOC,AVI,MOV,MP4 files are allowed' })
            }

        }
    }

    const handleReset = () => {
        reset()
        setTaskImages([])
    }

    const handleDelete = (id) => {
        const taskDocs = taskImages.filter(task => task.id !== id)
        if (!taskDocs.length) {
            setValue('file', '');
        }
        setTaskImages(taskDocs)
    }

    const onSubmit = (data) => {
        if (!taskImages.length) {
            setImageError({ error: true, errorMessage: 'This field is required' })
            return
        }

        if (taskImages.length) {
            let bodyFormData = new FormData();

            taskImages.forEach((element, index) => {
                bodyFormData.append('file_1', element[0])
            });

            bodyFormData.append('task_solution', data.task_solution)
            bodyFormData.append('task_id', parseInt(params.id))
            bodyFormData.append('status', 'completed')
            dispatch(submitProgramTaskDetails(bodyFormData))
        }
    }

    const handleTaskAction = async () => {
        setSuccessModal({ loading: true, success: false })
        const startTask = await api.patch('program_task_assign/task_start', { task_id: taskData.id });
        if (startTask.status === 200 && startTask.data) {
            setSuccessModal({ loading: false, success: true })
            setTimeout(() => {
                dispatch(updateUserProgramInfo({ status: '' }))
                setSuccessModal({ loading: false, success: false })
                dispatch(getSpecificTask({ task_id: params.id }))
            }, [2000])
        }

    }

    useEffect(() => {
        if (status === programStatus.tasksubmitted) {
            setTimeout(() => {
                dispatch(updateUserProgramInfo({ status: '' }))
                navigate('/mentee-tasks')
            }, [2000])
        }
    }, [status])


    useEffect(() => {
        let allTaskDocuments = { img: [], video: [], doc: [] }
        if (taskImages.length) {
            taskImages.forEach((img) => {
                const fileName = img[0]?.name;
                const fileNameSplit = fileName?.split('.')
                const fileExtensionName = fileNameSplit?.pop().toLowerCase()
                if (allowedImagesTypes.includes(fileExtensionName)) {
                    allTaskDocuments.img = [...allTaskDocuments.img, img]
                }
                if (allowedDocTypes.includes(fileExtensionName)) {
                    allTaskDocuments.doc = [...allTaskDocuments.doc, img]
                }
                if (allowedVideoTypes.includes(fileExtensionName)) {
                    allTaskDocuments.video = [...allTaskDocuments.video, img]
                }
            })
        } else {
            allTaskDocuments = { img: [], video: [], doc: [] }
        }
        setTaskSolutionDocs(allTaskDocuments)
    }, [taskImages])

    useEffect(() => {
        dispatch(getProgramTaskDetails(params.id))
        dispatch(getSpecificTask({ task_id: params.id }))
    }, [])


    useEffect(() => {
        if (task_submission && Object.keys(task_submission).length) {
            reset({
                task_solution: task_submission?.task_solution || '',
            })
        }
    }, [task_submission])


    const imageField = {
        ...register('file', {
            required: "This field is required",
            validate: (value) => {
                const acceptedFormats = [...allowedImagesTypes, ...allowedDocTypes, ...allowedVideoTypes];
                const fileExtension = value[0]?.name.split('.').pop().toLowerCase();

                if (!acceptedFormats.includes(fileExtension)) {
                    return 'Invalid file format. Only JPEG,PNG,PDF,DOC,AVI,MOV,MP4 files are allowed.';
                }
                return true;
            }
        })
    }

    const allFiles = getFiles(taskData?.files || [])

    console.log('allFiles', allFiles, taskData.files)


    return (
        <div className="px-9 py-9">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={status === programStatus.tasksubmitted}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Task Submitted Successfully</p>
                    </div>

                </div>
            </Backdrop>

            {imageError.error && <ToastNotification openToaster={imageError.error} message={imageError.message} toastType='error' />}

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading || successModal.loading || successModal.success}
            >
                {
                    successModal.success ?


                        <div className='px-5 py-1 flex justify-center items-center'>
                            <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                                style={{ background: '#fff', borderRadius: '10px' }}>
                                <img src={SuccessTik} alt="SuccessTik" />
                                <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                                    style={{
                                        fontWeight: 600
                                    }}
                                >Successfully task is started</p>
                            </div>

                        </div>
                        :
                        <CircularProgress color="inherit" />
                }

            </Backdrop>

            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[20px]'>
                        <p>Task Details</p>
                        {
                            params.id === '2' && !startTask &&
                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                onClick={() => navigate('/programs')}
                            >
                                <img src={EditIcon} alt='EditIcon' />
                            </div>
                        }
                    </div>

                    <div className='flex gap-8 items-center'>
                        <div className="relative">
                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                onClick={() => navigate('/mentee-tasks')}
                            >
                                <img src={CancelIcon} alt='CancelIcon' />
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (!loading && Object.keys(taskData).length) &&

                    <div className='px-4'>
                        <div className="relative flex gap-6 justify-between">
                            <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody style={{ border: '1px solid rgba(0, 174, 189, 1)' }}>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Assigned Date
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {taskData?.created_at?.split('T')[0]}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                            Task Name
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {taskData?.task_name}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 ">
                                        <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Program Name
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {taskData?.program_name}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b  dark:bg-gray-800">
                                        <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Due  Date
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                            {taskData['due_date']?.split('T')[0]}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Completed  Date
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {taskData?.submited_date?.split('T')[0] || '-'}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                            Task assigned by
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {taskData?.mentor_name}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 ">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Program Duration
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {taskData.program_duration} hours
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b  dark:bg-gray-800">
                                        <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                            Status
                                        </th>
                                        <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                            {TaskStatus[taskData?.status] || ''}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>
                                <p className='w-[30%]'>Task Name : </p>
                                <p className='text-[14px]'>{taskData?.task_name}</p>
                            </div>
                            <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>
                                <p className='w-[30%]'>Task Description : </p>
                                <p className='text-[14px]'>{taskData?.task_description}</p>
                            </div>



                            <div className='py-6 mb-16'>

                                {
                                    (taskData.status === TaskAllStatus.inprogress || taskData.status === TaskAllStatus.pending ||
                                        taskData.status === TaskAllStatus.draft
                                    ) ?
                                        <>
                                            <div className='relative'>
                                                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Task Solution
                                                </label>
                                                <textarea id="message" rows="4"
                                                    className={`block p-2.5 input-bg w-full h-[170px] text-sm text-gray-900  rounded-lg border
                                                        focus-visible:outline-none focus:visible:border-none`} style={{
                                                        border: errors['task_solution'] ? '2px solid red' : 'none',

                                                        cursor: taskData.status === TaskAllStatus.rejected ? 'not-allowed' : 'inherit'
                                                    }}
                                                    placeholder=""
                                                    {...register('task_solution', {
                                                        required: "This field is required",
                                                    })}
                                                    disabled={taskData.status === TaskAllStatus.rejected || taskData.status === TaskAllStatus.completed}
                                                ></textarea>
                                                {errors['task_solution'] && (
                                                    <p className="error" role="alert">
                                                        {errors['task_solution'].message}
                                                    </p>
                                                )}
                                            </div>


                                            <div className='relative mt-12'>
                                                <div className="flex items-center justify-center w-full">
                                                    <label htmlFor="dropzone-file"
                                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed cursor-pointer
                                                     bg-gray-50 dark:hover:bg-bray-800 dark:border-gray-600"
                                                        style={{
                                                            background: 'rgba(243, 247, 252, 1)', border: imageError.error || errors['file'] ? '2px dashed red' : 'none',

                                                            cursor: (taskData.status === TaskAllStatus.newtask || taskData.status === TaskAllStatus.pending || taskData.status === TaskAllStatus.inprogress) ? 'pointer' : 'not-allowed'
                                                        }} >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <img src={FileIcon} alt="FileIcon" />
                                                            <p className="mb-2 mt-3 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">
                                                                Drop your Image ,video,  document or browse</span>
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                supports: JPG,PNG,PDF,DOC
                                                            </p>
                                                        </div>
                                                        <input id="dropzone-file" type="file"
                                                            name="file"

                                                            {...imageField}

                                                            onChange={(e) => {
                                                                if (taskData.status === TaskAllStatus.inprogress || taskData.status === TaskAllStatus.newtask || taskData.status === TaskAllStatus.pending) {
                                                                    imageField.onChange(e);
                                                                    handleImageUpload(e);
                                                                }
                                                                else {
                                                                    return undefined
                                                                }
                                                            }}

                                                            disabled={taskData.status === TaskAllStatus.rejected || taskData.status === TaskAllStatus.completed}

                                                            className="hidden" />
                                                    </label>

                                                </div>
                                                {(imageError.error || errors['file']) && (
                                                    <p className="error" role="alert">
                                                        {errors['file']?.message}
                                                    </p>
                                                )}
                                            </div>


                                            <div className='flex justify-between task-uploaded-images-container'>
                                                {
                                                    taskSolutionDocs.img.length ?
                                                        <div>
                                                            <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>
                                                            {
                                                                taskSolutionDocs.img.map((imges, index) =>

                                                                    <div className='uploaded-images task-image-list' key={index}>
                                                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                                            <div className='flex gap-3 items-center'>
                                                                                <img src={UploadIcon} alt="altlogo" />
                                                                                <span className='text-[12px] image-name'>{imges[0].name}</span>
                                                                            </div>
                                                                            <img className='w-[30px] cursor-pointer' onClick={() => handleDelete(imges.id)} src={DeleteIcon} alt="DeleteIcon" />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        : null
                                                }

                                                {
                                                    taskSolutionDocs.video.length ?

                                                        <div>
                                                            <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Video</div>

                                                            {
                                                                taskSolutionDocs.video.map((imges, index) =>
                                                                    <div className='task-image-list flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                                        style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }} key={index}>
                                                                        <div className='flex gap-3 items-center'>
                                                                            <img src={UploadIcon} alt="altlogo" />
                                                                            <span className='text-[12px] image-name'>{imges[0].name}</span>
                                                                        </div>
                                                                        <img className='w-[30px] cursor-pointer' onClick={() => handleDelete(imges.id)} src={DeleteIcon} alt="DeleteIcon" />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        :
                                                        null
                                                }
                                                {
                                                    taskSolutionDocs.doc.length ?
                                                        <div>
                                                            <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Files</div>

                                                            {
                                                                taskSolutionDocs.doc.map((imges, index) =>
                                                                    <div className='task-image-list flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                                        style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }} key={index}>
                                                                        <div className='flex gap-3 items-center'>
                                                                            <img src={UploadIcon} alt="altlogo" />
                                                                            <span className='text-[12px] image-name'>{imges[0].name}</span>
                                                                        </div>
                                                                        <img className='w-[30px] cursor-pointer' onClick={() => handleDelete(imges.id)} src={DeleteIcon} alt="DeleteIcon" />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                        </>
                                        :




                                        (taskData?.status !== TaskAllStatus.yettostart || taskData?.status !== TaskAllStatus.newtask) ?

                                            <>
                                                {
                                                    taskData?.task_solution &&
                                                    <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>
                                                        <p className='w-[30%]'>Task Solution : </p>
                                                        <p className='text-[14px]'>{taskData?.task_solution}</p>
                                                    </div>
                                                }


                                                <div className='flex justify-between task-uploaded-images-container'>
                                                    {
                                                        allFiles.files ?

                                                            <div>
                                                                <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>
                                                                {
                                                                    allFiles.image.map((imges, index) =>

                                                                        <div className='uploaded-images task-image-list' key={index}>
                                                                            <a href={imges.fileurl} target='_blank'>
                                                                                <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                                                    style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                                                    <div className='flex gap-3 items-center'>
                                                                                        <img src={UploadIcon} alt="altlogo" />
                                                                                        <span className='text-[12px] image-name'>{imges.name}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </a>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>

                                                            : null
                                                    }


                                                    {
                                                        allFiles.video.length ?

                                                            <div>
                                                                <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Video</div>

                                                                {
                                                                    allFiles.video.map((imges, index) =>
                                                                        <div className='task-image-list flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }} key={index}>
                                                                            <a href={imges.fileurl} target='_blank'>
                                                                                <div className='flex gap-3 items-center'>
                                                                                    <img src={UploadIcon} alt="altlogo" />
                                                                                    <span className='text-[12px] image-name'>{imges.name}</span>
                                                                                </div>
                                                                            </a>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>


                                                            :

                                                            null

                                                    }



                                                    {
                                                        allFiles.doc.length ?

                                                            <div>
                                                                <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Files</div>

                                                                {
                                                                    allFiles.doc.map((imges, index) =>
                                                                        <div className='task-image-list flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }} key={index}>
                                                                            <a href={imges.fileurl} target='_blank'>
                                                                                <div className='flex gap-3 items-center'>
                                                                                    <img src={UploadIcon} alt="altlogo" />
                                                                                    <span className='text-[12px] image-name'>{imges.name}</span>
                                                                                </div>
                                                                            </a>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>

                                                            : null
                                                    }

                                                </div>
                                            </>

                                            : null





                                }
                                <div className='reference-link flex justify-between mb-8'>
                                    <div className='reference-view'>
                                        <p className='py-4'>Reference View</p>
                                        <ul className='leading-10'>
                                            {
                                                docs?.map((doc, index) => <li key={index}>{index + 1}. <span>{doc}</span></li>)
                                            }
                                        </ul>
                                    </div>
                                </div>

                            </div>
                            {
                                (taskData.result !== '' && taskData.result !== null && taskData.result !== '----') &&

                                <div className='mark flex'>
                                    <div className='mr-96'>
                                        Result :
                                    </div>
                                    <div style={{ background: taskData.result === 'Pass' ? 'rgba(235, 255, 243, 1)' : 'rgba(255, 231, 231, 1)', padding: '24px 0', width: '240px', textAlign: 'center', fontSize: '40px' }}>
                                        <span style={{ color: taskData.result === 'Pass' ? 'rgba(22, 182, 129, 1)' : 'rgba(224, 56, 45, 1)' }}>{taskData.result}</span>
                                    </div>
                                </div>
                            }
                            <div className='close-btn flex justify-center gap-7 pb-5'>
                                <Button btnName='Cancel' btnCls="w-[12%]" btnCategory="secondary" onClick={() => navigate('/mentee-tasks')} />
                                {
                                    (taskData.status === TaskAllStatus.pending
                                        || taskData.status === TaskAllStatus.draft ||
                                        taskData.status === TaskAllStatus.inprogress

                                    ) &&
                                    <>
                                        <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                                            onClick={handleReset} btnName='Reset'
                                            style={{
                                                background: 'rgba(217, 228, 242, 1)',
                                                color: 'rgba(29, 91, 191, 1)'
                                            }}
                                        />
                                        {/* <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                                            onClick={() => navigate(`/preview-mentee-tasks-details/${params.id}`)} btnName='Preview'
                                            style={{
                                                background: 'rgba(167, 181, 202, 1)',
                                                color: 'rgba(24, 40, 61, 1)'
                                            }}
                                        /> */}
                                        <Button btnType="submit" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                                            btnName='Submit to Mentor' btnCategory="primary" />
                                    </>
                                }
                                {
                                    (taskData?.status === TaskAllStatus.yettostart || taskData?.status === TaskAllStatus.newtask) &&

                                    <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`} onClick={handleTaskAction} btnName='Start Task' btnCategory="primary" />
                                }


                            </div>

                        </form>



                        {/* <div className='close-btn flex justify-center gap-7 pb-5'>
                        {
                            params.id !== '' || params.id === '5' ?

                                <>
                                    <Button btnName='Cancel' btnCls="w-[12%]" btnCategory="secondary" onClick={() => navigate('/mentee-tasks')} />
                                    {
                                        task_status === TaskAllStatus.start &&
                                        <>
                                            <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                                                onClick={() => console.log('Reset')} btnName='Reset'
                                                style={{
                                                    background: 'rgba(217, 228, 242, 1)',
                                                    color: 'rgba(29, 91, 191, 1)'
                                                }}
                                            />
                                            <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                                                onClick={() => navigate(`/preview-mentee-tasks-details/${params.id}`)} btnName='Preview'
                                                style={{
                                                    background: 'rgba(167, 181, 202, 1)',
                                                    color: 'rgba(24, 40, 61, 1)'
                                                }}
                                            />
                                            <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`}
                                                onClick={handleSubmitTask} btnName='Submit to Mentor' btnCategory="primary" />
                                        </>

                                    }
                                    {
                                        task_status ===
                                            <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`} onClick={() => setStartTask(true)} btnName='Start Task' btnCategory="primary" />
                                    }

                                </>
                                :

                                task_status === TaskAllStatus.submitted ?
                                    <Button btnType="button" btnCls="w-[10%]"
                                        onClick={() => { navigate('/mentee-tasks') }} btnName='Cancel'
                                        style={{ border: '1px solid rgba(255, 10, 10, 1)', color: 'rgba(255, 10, 10, 1)' }} />
                                    :

                                    <Button btnType="button" btnCls="w-[10%]"
                                        onClick={() => { navigate('/mentee-tasks') }} btnName='Close' btnCategory="primary" />
                        }

                    </div> */}
                    </div>
                }

            </div>
        </div>
    )
}

