import React, { useEffect, useState } from 'react'

import UploadIcon from "../../assets/images/image_1x.png"
import DeleteIcon from "../../assets/images/delete_1x.png"
import CancelIcon from '../../assets/images/cancel-colour1x.png'
import EditIcon from '../../assets/images/Edit1x.png'
import FileIcon from '../../assets/icons/linkIcon.svg'
import SuccessTik from '../../assets/images/blue_tik1x.png';
import { Button } from '../../shared'
import { useNavigate, useParams } from 'react-router-dom'
import MuiModal from '../../shared/Modal';
import { useDispatch } from 'react-redux'
import { getProgramTaskDetails } from '../../services/userprograms'


export const TaskDetails = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [startTask, setStartTask] = useState(true)
    const params = useParams();

    const handleSubmitTask = () => {
        if (!startTask) {
            setStartTask(false)
        } else {
            setLoading(true)
        }
    }

    useEffect(() => {
        if(params.id === '5'){
            setStartTask(true)
        }
    },[params])

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false)
                if(params.id === '5') navigate('/dashboard')
                else navigate('/mentee-tasks')
            }, 3000)
        }
    }, [loading])

    useEffect(() => {
        dispatch(getProgramTaskDetails(params.id))
    },[])

    console.log('paaa', params)
    return (
        <div className="px-9 py-9">
            <MuiModal modalOpen={loading} modalClose={() => setLoading(false)} noheader>
                <div className='px-5 py-1 flex justify-center items-center'>
                    <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20'
                        style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                        <img src={SuccessTik} alt="SuccessTik" />
                        <p className='text-white text-[12px]'>Task Submitted Successfully</p>
                    </div>

                </div>
            </MuiModal>

            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[20px]'>
                        <p>{params.id === '3' ? 'Task Details' : 'Task Details'}</p>
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
                                onClick={() => navigate('/programs')}
                            >
                                <img src={CancelIcon} alt='CancelIcon' />
                            </div>
                        </div>
                    </div>
                </div>


                <div className='px-4'>
                    <div className="relative flex gap-6 justify-between">
                        <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody style={{ border: '1px solid rgba(0, 174, 189, 1)' }}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" style={{ border: '1px solid rgba(0, 174, 189, 1)', background:'#fff' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Assigned Date
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        04/23/2024
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background:'#fff' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                        Task Name
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        Task Name
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 ">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background:'#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Program Name
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        Teaching Program
                                    </td>
                                </tr>
                                <tr className="bg-white border-b  dark:bg-gray-800">
                                    <th style={{ border: '1px solid rgba(0, 174, 189, 1)', background:'#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Due  Date
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(0, 174, 189, 1)' }}>
                                        04/23/2024
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                        <table className="w-[50%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody style={{ border: '1px solid rgba(29, 91, 191, 1)' }}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" style={{ border: '1px solid rgba(29, 91, 191, 1)', background:'#fff' }} className="px-6 py-4 font-medium whitespace-nowrap ">
                                        Completed  Date
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        -
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background:'#fff' }} scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                                        Task assigned by
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        Mentor
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 ">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background:'#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
                                        File Type
                                    </th>
                                    <td className="px-6 py-4 text-white" style={{ background: 'rgba(29, 91, 191, 1)' }}>
                                        {true ? '-': 'Video, Jpg, PDF'}
                                    </td>
                                </tr>
                                <tr className="bg-white border-b  dark:bg-gray-800">
                                    <th style={{ border: '1px solid rgba(29, 91, 191, 1)', background:'#fff' }} scope="row" className="px-6 py-4 font-medium whitespace-nowrap ">
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
                        <p className='w-[30%]'>Task Description : </p>
                        <p className='text-[14px]'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                            and scrambled it to make a type specimen book.It has survived not only five centuries, but also the
                            leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                            the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.</p>
                    </div>

                    <div className=' py-6 mb-16'>
                        <div className='reference-link flex justify-between mb-8'>
                            <div className='reference-view'>
                                <p className='py-4'>Reference View</p>
                                <ul className='leading-10'>
                                    <li>1. <span className='underline'>https://picsum.photos/200/300</span></li>
                                    <li>2. <span className='underline'>https://picsum.photos/200/400</span></li>
                                </ul>
                            </div>
                            {/* {
                                !startTask &&

                                <div style={{ background: 'rgba(26, 153, 92, 1)' }}
                                    className='flex justify-center items-center text-white w-[12%] mt-2'>
                                    <span className='text-[50px]'>09</span>
                                </div>
                            } */}

                        </div>

                        {
                            params.id === '1' &&

                            <>
                                <div className='pt-4 pb-2'>
                                    <div className='task-details'>
                                        <p>Task</p>
                                        <div className='task-information px-7 py-8 text-[14px]' style={{ background: 'rgba(217, 228, 242, 1)', borderRadius: '3px' }}>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                                            took a galley of type and scrambled it to make a type specimen book.It has survived not only five
                                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
                                            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
                                            more recently with desktop.
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-between mb-10'>
                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>
                                        <div className='uploaded-images'>
                                            <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                <div className='flex gap-3 items-center'>
                                                    <img src={UploadIcon} alt="altlogo" />
                                                    <span className='text-[12px]'>145816452.jpg</span>
                                                </div>
                                                <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Video</div>

                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                            <div className='flex gap-3 items-center'>
                                                <img src={UploadIcon} alt="altlogo" />
                                                <span className='text-[12px]'>loripusum.video</span>
                                            </div>
                                            <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                        </div>
                                    </div>


                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Files</div>

                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                            <div className='flex gap-3 items-center'>
                                                <img src={UploadIcon} alt="altlogo" />
                                                <span className='text-[12px]'>loripusum.PDF</span>
                                            </div>
                                            <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                        </div>
                                    </div>
                                </div>


                                <div className='flex justify-center items-center'>
                                    <div style={{ background: 'rgba(26, 153, 92, 1)' }}
                                        className='flex justify-center items-center py-9 text-white w-[16%] mt-2'>
                                        <span className='text-[50px]'>09</span>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            startTask &&

                            <>
                                <div className='relative'>
                                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Task Solution
                                    </label>
                                    <textarea id="message" rows="4"
                                        className="block p-2.5 input-bg w-full h-[170px] text-sm text-gray-900  rounded-lg border
                                    focus:visible:outline-none focus:visible:border-none" placeholder=""
                                    ></textarea>
                                </div>

                                <div className='relative mt-12'>

                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2
                                                                                  border-dashed cursor-pointer
                                                                                  bg-gray-50 dark:hover:bg-bray-800 
                                                                                   dark:border-gray-600 "

                                            style={{ background: 'rgba(243, 247, 252, 1)' }} >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <img src={FileIcon} alt="FileIcon" />
                                                <p className="mb-2 mt-3 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">
                                                    Drop your Image ,video,  document or browse</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    supports: JPG,PNG,DOC
                                                </p>
                                            </div>
                                            <input id="dropzone-file" type="file"

                                                onChange={(e) => {

                                                    console.log(e)

                                                }}
                                                className="hidden" />
                                        </label>

                                    </div>

                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Image</div>
                                        <div className='uploaded-images'>
                                            <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                <div className='flex gap-3 items-center'>
                                                    <img src={UploadIcon} alt="altlogo" />
                                                    <span className='text-[12px]'>145816452.jpg</span>
                                                </div>
                                                <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                            </div>
                                        </div>

                                        <div className='uploaded-images'>
                                            <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                                style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                                <div className='flex gap-3 items-center'>
                                                    <img src={UploadIcon} alt="altlogo" />
                                                    <span className='text-[12px]'>145816452.jpg</span>
                                                </div>
                                                <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Video</div>

                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                            <div className='flex gap-3 items-center'>
                                                <img src={UploadIcon} alt="altlogo" />
                                                <span className='text-[12px]'>loripusum.video</span>
                                            </div>
                                            <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                        </div>
                                    </div>


                                    <div>
                                        <div className='text-[14px] pt-5' style={{ color: 'rgba(0, 0, 0, 1)' }}>Uploaded Files</div>

                                        <div className='flex gap-3 w-[400px] justify-between items-center mt-5 px-4 py-4'
                                            style={{ border: '1px solid rgba(29, 91, 191, 0.5)', borderRadius: '3px' }}>
                                            <div className='flex gap-3 items-center'>
                                                <img src={UploadIcon} alt="altlogo" />
                                                <span className='text-[12px]'>loripusum.PDF</span>
                                            </div>
                                            <img className='w-[30px] cursor-pointer' onClick={() => console.log('delete')} src={DeleteIcon} alt="DeleteIcon" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                    </div>



                    <div className='close-btn flex justify-center gap-7 pb-5'>
                        {
                            params.id !== '' || params.id === '5' ?

                                <>
                                    <Button btnName='Cancel' btnCls="w-[12%]" btnCategory="secondary" onClick={() => navigate('/mentee-tasks')} />
                                    {
                                        startTask ?
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
                                            :
                                            <Button btnType="button" btnCls={`${startTask ? 'w-[14%]' : 'w-[12%]'}`} onClick={() => setStartTask(true)} btnName='Start Task' btnCategory="primary" />
                                    }

                                </>
                                :

                            params.id === '3'? 
                            <Button btnType="button" btnCls="w-[10%]" 
                            onClick={() => { navigate('/mentee-tasks') }} btnName='Cancel' 
                            style={{border: '1px solid rgba(255, 10, 10, 1)', color:'rgba(255, 10, 10, 1)' }} />
                            :

                                <Button btnType="button" btnCls="w-[10%]" 
                                    onClick={() => { navigate('/mentee-tasks') }} btnName='Close' btnCategory="primary" />
                        }

                    </div>
                </div>


            </div>
        </div>
    )
}

