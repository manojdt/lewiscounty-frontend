import React, { useEffect, useState } from 'react'

import CancelIcon from '../../../assets/images/cancel-colour1x.png'
import EditIcon from '../../../assets/images/Edit1x.png'
import FileIcon from '../../../assets/icons/linkIcon.svg'
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import UploadIcon from "../../../assets/images/image_1x.png"
import { Button } from '../../../shared'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { getSpecificTask, updateTaskMark } from '../../../services/task'
import { dateFormat, dateTimeFormat, getFiles } from '../../../utils'
import { TaskApiStatus, TaskStatus } from '../../../utils/constant'
import { useForm } from 'react-hook-form'


const MentorTaskDetails = () => {
    const navigate = useNavigate()
    const [editTask, setEditTask] = useState(true)
    const params = useParams();
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { task: taskDetails, loading: taskDetailsLoading, status } = useSelector(state => state.tasks)
    const state = useLocation()?.state

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const marks = () => {
        const markList = []
        for (let a = 1; a <= 10; a++) {
            markList.push({ key: a, value: a })
        }

        return markList
    }

    const onSubmit = (data) => {
        const apiData = { result: data.result === 'true', mentee_id: taskDetails.mentee_id, task_id: taskDetails.id }
        setEditTask(false)
        dispatch(updateTaskMark(apiData))
    }

    useEffect(() => {
        if (status === TaskApiStatus.updatemark) {
            setTimeout(() => {
                navigate('/mentor-tasks?type=menteetask')
            }, [2000])
        }
    }, [status])

    useEffect(() => {
        console.log('taskDetails', taskDetails)
        if (taskDetails.status === 'waiting_for_approval' && !editTask) {
            setEditTask(true)
        } else {
            setEditTask(false)
        }
    }, [taskDetails])


    useEffect(() => {
        if (params && params.id && searchParams && searchParams.get("mentee_id")) {
            const menteeId = searchParams.get("mentee_id");
            dispatch(getSpecificTask({ task_id: params.id, mentee_id: menteeId }))
        }
    }, [params, searchParams])


    const referenceView = taskDetails?.reference_link || ''

    const docs = referenceView !== '' ? referenceView?.split(',') || [] : []

    const radiobox = register('result', { required: 'This field is required' })

    const allFiles = getFiles(taskDetails?.files || [])


    return (
        <div className="px-9 py-9">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={status === TaskApiStatus.updatemark}
            >
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-[2.25rem] py-[4rem] px-[3rem] mt-20 mb-20'
                        style={{ background: '#fff', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-[16px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#1D5BBF] to-[#00AEBD]'
                            style={{
                                fontWeight: 600
                            }}
                        >Result Updated Successfully</p>
                    </div>

                </div>

            </Backdrop>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={taskDetailsLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[20px]'>
                        <p>Task - {taskDetails.task_name}</p>
                        {/* {
                            (taskDetails.status === 'waiting_for_approval' && !editTask) &&


                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                onClick={() => setEditTask(true)}
                            >
                                <img src={EditIcon} alt='EditIcon' />
                            </div>
                        } */}
                    </div>

                    <div className='flex gap-8 items-center'>
                        <div className="relative">
                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                onClick={() => navigate(state?.from === "program" ? -1 : '/mentor-tasks')}
                            >
                                <img src={CancelIcon} alt='SearchIcon' />
                            </div>
                        </div>
                    </div>
                </div>


                <div className='px-4'>
                    <div className="relative flex gap-6 justify-between">
                        <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody style={{ border: '1px solid rgba(0, 174, 189, 1)' }}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff', color: '#000' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Category
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        {taskDetails.program_category || ''}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff', color: '#000' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                        Program Name
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        {taskDetails.program_name}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 ">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff', color: '#000' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Mentor Name
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        {taskDetails.mentor_name}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b  dark:bg-gray-800">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background: '#fff', color: '#000' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Program Start Date and Time
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        {dateTimeFormat(taskDetails.program_startdate)}
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff', color: '#000' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Program End Date and Time
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        {dateTimeFormat(taskDetails.program_enddate) || ''}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff', color: '#000' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                        Program Duration
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        {taskDetails.program_duration} {taskDetails.program_duration>1?"Days": "Day"}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 ">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff', color: '#000' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Due Date
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        {dateFormat(taskDetails.due_date)}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b  dark:bg-gray-800">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background: '#fff', color: '#000' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Status
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        {TaskStatus[taskDetails?.status] || ''}
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>

                        <p className='text-[14px]'>Task</p>  :
                        <p className='text-[14px] pl-6'>{taskDetails.task_name}</p>
                    </div>

                    <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>

                        <p className='text-[14px]'>Task Description</p>  :
                        <p className='text-[14px] pl-6'>{taskDetails.task_description}</p>
                    </div>

                    <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>

                        <p className='text-[14px]'>Task Solution</p>  :
                        <p className='text-[14px] pl-6'>{taskDetails.task_solution}</p>
                    </div>

                    <div className='flex justify-between task-uploaded-images-container'>
                        {
                            allFiles.files ?

                                <div>
                                    <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>
                                    {
                                        allFiles.image.map((imges, index) =>

                                            <div className='uploaded-images task-image-list' key={index}>
                                                <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                    style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                    <a href={imges.fileurl} target='_blank'>
                                                        <div className='flex gap-3 items-center'>
                                                            <img src={UploadIcon} alt="altlogo" />
                                                            <span className='text-[12px] image-name'>{imges.name}</span>
                                                        </div>
                                                    </a>
                                                </div>
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

                    <form onSubmit={handleSubmit(onSubmit)}>



                        <div className='py-6 mb-16'>
                            <div className='reference-link flex justify-between mb-8'>
                                <div className='reference-view'>
                                    <p className='py-4'>Reference Book</p>
                                    <ul className='leading-10'>
                                        {
                                            docs?.map((doc, index) => <li key={index}>{index + 1}. <span>{doc}</span></li>)
                                        }

                                    </ul>
                                </div>


                            </div>
                            {
                                (taskDetails.result !== '' && taskDetails.result !== null && taskDetails.result !== '----') &&

                                <div className='mark flex'>
                                    <div className='mr-96'>
                                        Result :
                                    </div>
                                    <div style={{ background: taskDetails.result === 'Pass' ? 'rgba(235, 255, 243, 1)' : 'rgba(255, 231, 231, 1)', padding: '24px 0', width: '240px', textAlign: 'center', fontSize: '40px' }}>
                                        <span style={{ color: taskDetails.result === 'Pass' ? 'rgba(22, 182, 129, 1)' : 'rgba(224, 56, 45, 1)' }}>{taskDetails.result}</span>
                                    </div>
                                </div>
                            }

                            {
                                taskDetails.status === 'waiting_for_approval' &&
                                <>
                                    <div className='relative py-5'>
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                            Result
                                        </label>
                                        <div className='relative '>
                                            <div className="flex items-center me-4">
                                                <div className="flex items-center me-4">
                                                    <div className="flex items-center me-4">
                                                        <input type="radio" className="w-4 h-4 text-blue-600 bg-gray-100
                                                                                    border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                                                                                    dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                                                                    dark:border-gray-600"
                                                            {...radiobox}
                                                            onChange={e => {
                                                                radiobox.onChange(e);
                                                            }}
                                                            value={true}
                                                        />
                                                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{"Pass"}</label>
                                                    </div>

                                                    <div className="flex items-center me-4">
                                                        <input type="radio" className="w-4 h-4 text-blue-600 bg-gray-100
                                                                                    border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                                                                                    dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                                                                    dark:border-gray-600"
                                                            {...radiobox}
                                                            onChange={e => {
                                                                radiobox.onChange(e);
                                                            }}
                                                            value={false}
                                                        />
                                                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{'Fail'}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {errors['result'] && (
                                        <p className="error" role="alert">
                                            {errors['result'].message}
                                        </p>
                                    )}
                                </>
                            }
                        </div>

                        <div className='close-btn flex justify-center gap-7 pb-5'>
                            {
                                editTask ?
                                    <>
                                        <Button btnName='Close' btnCls="w-[12%]" btnCategory="secondary" onClick={() => navigate('/mentor-tasks')} />
                                        <Button btnType="submit" btnCls={`${editTask ? 'w-[14%]' : 'w-[12%]'}`}
                                            btnName='Submit' btnCategory="primary" />
                                    </>
                                    :
                                    <Button btnType="button" btnCls="w-[10%]" onClick={() => { navigate('/mentor-tasks?type=menteetask') }} btnName='Close' btnCategory="primary" />
                            }

                        </div>
                    </form>
                </div>


            </div>
        </div>
    )
}


export default MentorTaskDetails
