import React, { useEffect, useState } from 'react'

import CancelIcon from '../../../assets/images/cancel-colour1x.png'
import EditIcon from '../../../assets/images/Edit1x.png'
import FileIcon from '../../../assets/icons/linkIcon.svg'
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import { Button } from '../../../shared'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import MuiModal from '../../../shared/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress } from '@mui/material'
import { getSpecificTask, updateTaskMark } from '../../../services/task'
import { dateFormat, dateTimeFormat } from '../../../utils'
import { TaskApiStatus, TaskStatus } from '../../../utils/constant'
import { useForm } from 'react-hook-form'


const   MentorTaskDetails = () => {
    const navigate = useNavigate()
    const [editTask, setEditTask] = useState(false)
    const params = useParams();
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { task: taskDetails, loading: taskDetailsLoading, status } = useSelector(state => state.tasks)
    
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
        const apiData = { mark: parseInt(data.mark), mentee_id: taskDetails.mentee_id, task_id: taskDetails.id }
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
        if(taskDetails.status === 'waiting_for_approval' && !editTask){
            setEditTask(true)
        }
    },[taskDetails])


    useEffect(() => {
        if (params && params.id && searchParams && searchParams.get("mentee_id")) {
            const menteeId = searchParams.get("mentee_id");
            dispatch(getSpecificTask({ task_id: params.id, mentee_id: menteeId }))
        }
    }, [params, searchParams])


    const referenceView = taskDetails?.reference_link || ''

    const docs = referenceView !== '' ? referenceView?.split(',') || [] : []


    console.log('taskDetails', taskDetails)

    return (
        <div className="px-9 py-9">
            <MuiModal modalOpen={status === TaskApiStatus.updatemark} modalClose={() => undefined} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Score Updated Successfully</p>
                    </div>

                </div>
            </MuiModal>

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
                        {
                            (taskDetails.status === 'waiting_for_approval' && !editTask) &&


                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                onClick={() => setEditTask(true)}
                            >
                                <img src={EditIcon} alt='EditIcon' />
                            </div>
                        }
                    </div>

                    <div className='flex gap-8 items-center'>
                        <div className="relative">
                            <div className="inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                                onClick={() => navigate('/mentor-tasks')}
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
                                        {taskDetails.program_duration} hours
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

                        <p className='text-[14px]'>{taskDetails.task_description}</p>
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
                                (taskDetails.mark !== '' && taskDetails.mark !== null && taskDetails.mark !== '----' ) &&

                                <div className='mark flex'>
                                    <div className='mr-96'>
                                        Score :
                                    </div>
                                    <div style={{ background: 'rgba(235, 255, 243, 1)', padding: '24px 0', width: '240px', textAlign: 'center', fontSize: '40px' }}>
                                        <span style={{ color: 'rgba(22, 182, 129, 1)' }}>{taskDetails.mark}</span>
                                    </div>
                                </div>
                            }

                            {
                                editTask &&
                                <>
                                    <div className='relative py-5'>
                                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                            Enter  Score
                                        </label>
                                        <select
                                            className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg 
                                                            focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                            style={{
                                                color: "#232323",
                                                borderRadius: '3px',
                                                borderRight: '16px solid transparent'
                                            }}
                                            {...register('mark', {
                                                required: "This field is required",
                                            })}
                                        >
                                            <option value="">Select Score</option>
                                            {
                                                marks().map((option, index) => <option value={option.key || option.id} key={index}> {option.value || option.name} </option>)
                                            }
                                        </select>
                                    </div>

                                    {errors['mark'] && (
                                        <p className="error" role="alert">
                                            {errors['mark'].message}
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
