import React, { useEffect, useState } from 'react'

import SearchIcon from '../../../assets/images/search1x.png'
import CancelIcon from '../../../assets/images/cancel-colour1x.png'
import EditIcon from '../../../assets/images/Edit1x.png'
import FileIcon from '../../../assets/icons/linkIcon.svg'
import SuccessTik from '../../../assets/images/blue_tik1x.png';
import { Button } from '../../../shared'
import { useNavigate, useParams } from 'react-router-dom'
import MuiModal from '../../../shared/Modal';


const MentorTaskDetails = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [editTask, setEditTask] = useState(false)
    const params = useParams();

    const marks = () => {
        const markList = []
        for(let a= 1; a<=10;a++){
            markList.push({key: a, value: a})
        }

        return markList
    }

    const handleSubmitTask = () => {
        if (!editTask) {
            setEditTask(false)
        } else {
            setLoading(true)
        }
    }

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false)
                setEditTask(false)
                // navigate('/mentor-tasks?type=menteetask')
            }, 3000)
        }
    }, [loading])

    console.log('paaa', params)
    return (
        <div className="px-9 py-9">
            <MuiModal modalOpen={loading} modalClose={() => setLoading(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Mark Updated Successfully</p>
                    </div>

                </div>
            </MuiModal>

            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[20px]'>
                        <p>Task</p>
                        {
                            !editTask &&
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
                                    <th scope="row" style={{ border: '1px solid rgba(0, 174, 189, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Category
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        Category Name
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                        Program Name
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        Teaching Program
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 ">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Mentor Name
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        John Doe
                                    </td>
                                </tr>
                                <tr className="bg-white border-b  dark:bg-gray-800">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Program Start Date and Time
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        04/23/2024 | 04/23/2024
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Program End Date and Time
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        04/23/2024 | 04/23/2024
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                        Program Duration
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        8 hours
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 ">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Due Date
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        04/23/2024
                                    </td>
                                </tr>
                                <tr className="bg-white border-b  dark:bg-gray-800">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Status
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        Completed
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div className='task-desc flex mt-5 px-5 py-6' style={{ border: '1px solid rgba(29, 91, 191, 0.5)' }}>

                        <p className='text-[14px]'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                            and scrambled it to make a type specimen book.It has survived not only five centuries, but also the
                            leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                            the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.</p>
                    </div>

                    <div className='py-6 mb-16'>
                        <div className='reference-link flex justify-between mb-8'>
                            <div className='reference-view'>
                                <p className='py-4'>Reference Link</p>
                                <ul className='leading-10'>
                                    <li>1. <span className='underline'>https://picsum.photos/200/300</span></li>
                                    <li>2. <span className='underline'>https://picsum.photos/200/400</span></li>
                                </ul>
                            </div>


                        </div>

                        <div className='mark flex'>
                            <div className='mr-96'>
                                Mark :
                            </div>
                            <div style={{ background: 'rgba(235, 255, 243, 1)', padding: '24px 0', width: '240px', textAlign: 'center', fontSize: '40px' }}>
                                <span style={{ color: 'rgba(22, 182, 129, 1)' }}>09</span>
                            </div>
                        </div>
                        {
                            editTask &&
                            <div className='relative py-5'>
                                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    Enter  Mark
                                </label>
                                <select
                                    className="w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg 
                                                            focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]"
                                    style={{
                                        color: "#232323",
                                        borderRadius: '3px',
                                        borderRight: '16px solid transparent'
                                    }}
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                    }}
                                >
                                    <option value="">Select Mark</option>
                                    {
                                        marks().map((option, index) => <option value={option.key || option.id} key={index}> {option.value || option.name} </option>)
                                    }
                                </select>
                            </div>

                        }

                    </div>

                    <div className='close-btn flex justify-center gap-7 pb-5'>
                        {
                            editTask ?

                                <>
                                    <Button btnName='Close' btnCls="w-[12%]" btnCategory="secondary" onClick={() => navigate('/mentor-tasks')} />
                                    <Button btnType="button" btnCls={`${editTask ? 'w-[14%]' : 'w-[12%]'}`}
                                        onClick={() => handleSubmitTask()} btnName='Submit' btnCategory="primary" />
                                </>
                                :
                                <Button btnType="button" btnCls="w-[10%]" onClick={() => { navigate('/mentor-tasks') }} btnName='Close' btnCategory="primary" />
                        }

                    </div>
                </div>


            </div>
        </div>
    )
}


export default MentorTaskDetails
