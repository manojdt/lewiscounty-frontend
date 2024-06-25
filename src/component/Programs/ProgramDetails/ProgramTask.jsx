import React, { useEffect, useState } from 'react'
import DoubleArrowIcon from '../../../assets/images/double_arrow 1x.png';
import ProgramVideo from '../../../assets/images/video.png';
import ProgramDoc from '../../../assets/images/book.png';
import SuccessTik from '../../../assets/images/blue_tik1x.png';

import { useNavigate } from 'react-router-dom';

export default function ProgramTask() {
    const navigate = useNavigate()
    const [taskStage, setTaskStage] = useState('desc')

    const handleTaskStage = (stage) => {
        setTaskStage(stage)
    }

    const handleBack = () => {
        if (taskStage === 'desc') navigate('program-details/1')
        if (taskStage === 'video') setTaskStage('desc')
        if (taskStage === 'docs') setTaskStage('video')
    }

    useEffect(() => {
        if(taskStage === 'submit'){
            setTimeout(() => {
                navigate('/assign-task/1')
            },[2000])
        }
    },[taskStage])

    return (
        <div className="px-9 my-6 grid">
            <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                <div className='breadcrum'>
                    <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">

                                <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                    Program
                                </a>
                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                        Planned Program Joining details

                                        {taskStage === 'video' ? '- Video Introduction' : ''}
                                        {taskStage === 'docs' ? '- Case Study Introduction' : ''}
                                        {taskStage === 'question' ? '- Question and Answer' : ''}
                                        {taskStage === 'submit' ? '- Selected' : ''}

                                    </a>
                                </div>
                            </li>

                        </ol>
                    </nav>
                </div>
                <div className='content px-32 py-6'>
                    {
                        taskStage === 'desc' ?

                            <div className='px-20 py-10' style={{ border: '1px solid rgba(107, 107, 107, 1)', borderRadius: '7px' }}>
                                <div>Setting Goals for this Teaching program</div>
                                <div className='flex gap-4 pt-3'>
                                    <div className='text-[12px] py-3 px-6' style={{ background: 'rgba(217, 228, 242, 1)', borderRadius: '5px', color: 'rgba(29, 91, 191, 1)' }}>Introduction Training and Theory</div>
                                    <div className='text-[12px] py-3 px-6' style={{ background: 'rgba(219, 252, 255, 1)', borderRadius: '5px', color: 'rgba(0, 174, 189, 1)' }}>1 Days left</div>
                                </div>
                                <div className='pt-5 pb-40 text-[12px]'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                </div>
                                <div className='flex justify-center items-center gap-6'>
                                    <button className='py-2 px-9 text-[12px] flex items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '28px' }}
                                        onClick={() => navigate('/program-details/1')}
                                    >Back
                                        {/* <span className='pl-8 pt-1'><img style={{ width: '15px', height: '13px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span> */}
                                    </button>

                                    <button className='py-2 px-9 text-white text-[12px] flex items-center' style={{
                                        background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                        borderRadius: '28px'
                                    }}
                                        onClick={() => handleTaskStage('video')}
                                    >Next
                                        <span className='pl-3 '><img style={{ width: '13px', height: '11px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span>
                                    </button>

                                </div>
                            </div>

                            : taskStage === 'video' ?


                                <div className='px-20 py-10' style={{ border: '1px solid rgba(107, 107, 107, 1)', borderRadius: '7px' }}>

                                    <div className='pb-10 text-[12px]'>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                    </div>
                                    <div className='flex justify-center items-center pb-10'>
                                        <img className='w-[370px]' src={ProgramVideo} alt="ProgramVideo" />
                                    </div>
                                    <div className='flex justify-center items-center gap-6'>
                                        <button className='py-2 px-9 text-[12px] flex items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '28px' }}
                                            onClick={handleBack}
                                        >Back
                                            {/* <span className='pl-8 pt-1'><img style={{ width: '15px', height: '13px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span> */}
                                        </button>

                                        <button className='py-2 px-9 text-white text-[12px] flex items-center' style={{
                                            background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                            borderRadius: '28px'
                                        }}
                                            onClick={() => handleTaskStage('docs')}
                                        >Next
                                            <span className='pl-3 '><img style={{ width: '13px', height: '11px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span>
                                        </button>

                                    </div>
                                </div>
                                :
                                taskStage === 'docs' ?
                                    <div className='px-20 py-10' style={{ border: '1px solid rgba(107, 107, 107, 1)', borderRadius: '7px' }}>

                                        <div className='pb-10 text-[12px]'>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                        </div>
                                        <div className='flex justify-center items-center pb-40 gap-3'>
                                            <img src={ProgramDoc} alt="ProgramDoc" />
                                            <span>WIN -WIN STATERGY  -  This is our NGO case study eBook</span>
                                        </div>
                                        <div className='flex justify-center items-center gap-6'>
                                            <button className='py-2 px-9 text-[12px] flex items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '28px' }}
                                                onClick={handleBack}
                                            >Back
                                                {/* <span className='pl-8 pt-1'><img style={{ width: '15px', height: '13px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span> */}
                                            </button>

                                            <button className='py-2 px-9 text-white text-[12px] flex items-center' style={{
                                                background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                borderRadius: '28px'
                                            }}
                                                onClick={() => handleTaskStage('question')}
                                            >Next
                                                <span className='pl-3 '><img style={{ width: '13px', height: '11px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span>
                                            </button>
                                        </div>
                                    </div>
                                    : taskStage === 'question' ?

                                        <div className='px-96 py-16' style={{ border: '1px solid rgba(107, 107, 107, 1)', borderRadius: '7px' }}>
                                            <div style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '10px' }}>
                                                <div className='questions py-5 px-8'>
                                                    <ul className='text-[12px] list-decimal leading-6'>
                                                        <li className='pb-8'>
                                                            <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries
                                                                for previewing layouts and visual mockups.</p>
                                                            <input className='focus-visible:border-none' name="" style={{ borderBottom: '1px solid rgba(0, 0, 0, 1)', width: '100%' }} />
                                                        </li>

                                                        <li className='pb-8'>
                                                            <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries
                                                                for previewing layouts and visual mockups.</p>
                                                            <input name="" style={{ borderBottom: '1px solid rgba(0, 0, 0, 1)', width: '100%' }} />
                                                        </li>
                                                        <li className='pb-8'>
                                                            <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries
                                                                for previewing layouts and visual mockups.</p>
                                                            <input name="" style={{ borderBottom: '1px solid rgba(0, 0, 0, 1)', width: '100%' }} />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>


                                            <div className='flex justify-center items-center gap-6 pt-16'>
                                                <button className='py-2 px-9 text-[12px] flex items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '28px' }}
                                                    onClick={() => navigate('/program-details/1')}
                                                >Cancel
                                                </button>

                                                <button className='py-2 px-9 text-white text-[12px] flex items-center' style={{
                                                    background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                                    borderRadius: '28px'
                                                }}
                                                    onClick={() => handleTaskStage('submit')}
                                                >Submit
                                                </button>
                                            </div>
                                        </div>
                                        : taskStage === 'submit' ?

                                            <div className='px-96 py-16 flex justify-center items-center' style={{ border: '1px solid rgba(107, 107, 107, 1)', borderRadius: '7px' }}>
                                                <div className='flex justify-center items-center flex-col gap-5 py-10 px-20 mt-20 mb-20' 
                                                    style={{ background: 'linear-gradient(101.69deg, #1D5BBF -94.42%, #00AEBD 107.97%)', borderRadius: '10px' }}>
                                                    <img src={SuccessTik} alt="SuccessTik" />
                                                    <p className='text-white text-[12px]'>You have selected for this program.</p>
                                                </div>

                                            </div>

                                            : null
                    }

                </div>
            </div>
        </div>
    )
}
