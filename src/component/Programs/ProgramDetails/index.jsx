import React, { useState } from 'react';
import UserImage from "../../../assets/images/user.jpg";
import LocationIcon from '../../../assets/images/Location1x.png';
import CalendarIcon from '../../../assets/images/calender_1x.png';
import DoubleArrowIcon from '../../../assets/images/double_arrow 1x.png';
import RatingsIcon from '../../../assets/images/ratings1x.png';
import SponsorIcon from '../../../assets/images/program_logo1x.png';
import CertificateIcon from '../../../assets/images/certficate1x.png';
import QuoteIcon from '../../../assets/images/quotes1x.png';


import './program-details.css'
import Carousel from '../../../shared/Carousel';
import { curatedPrograms } from '../../../utils/mock';
import { useNavigate } from 'react-router-dom';


export default function ProgramDetails() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('about_program')
    const [certificateActiveTab, setCertificateActiveTab] = useState('participated')
    const tabs = [
        {
            name: 'About Program',
            key: 'about_program'
        },
        {
            name: 'Program Outcomes',
            key: 'program_outcomes'
        },
        {
            name: 'Program Testimonials',
            key: 'program_testimonials'
        },
    ]

    const participatedTabs = [
        {
            name: 'Participated',
            key: 'participated'
        },
        {
            name: 'Completed',
            key: 'completed'
        },
        {
            name: 'Lorem Ipsum ',
            key: 'ioremipsum '
        },
    ]

    const handleTab = (key) => {
        setActiveTab(key)
    }

    const handleCerificateTab = (key) => {
        setCertificateActiveTab(key)
    }

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
                                        Planned Program Joining details </a>
                                </div>
                            </li>

                        </ol>
                    </nav>
                    <div className='content px-8'>
                        <div className='grid grid-cols-3 gap-4 py-6'>

                            {/* Left Side Content */}
                            <div className='left-side-content col-span-2'>
                                <div className='flex items-center gap-6 pb-6'>
                                    <h3 className='font-semibold text-[18px]' style={{ color: 'rgba(29, 91, 191, 1)' }}>Teaching Program</h3>
                                    <div className='text-[10px] px-3 py-2' style={{
                                        background: 'rgba(238, 240, 244, 1)',
                                        color: 'rgba(253, 0, 58, 1)',
                                        borderRadius: '5px'
                                    }}>
                                        Category 1
                                    </div>
                                </div>

                                <div className='text-[12px]'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                    when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.
                                </div>

                                <div className='flex gap-6 py-6'>
                                    <div className='flex gap-2 items-center'>
                                        <img src={LocationIcon} alt="LocationIcon" />
                                        <span className='text-[12px]'>
                                            America
                                        </span>
                                    </div>
                                    <div style={{ borderRight: '1px solid rgba(24, 40, 61, 1)' }}></div>

                                    <div className='flex gap-3 items-center'>
                                        <img src={CalendarIcon} alt="CalendarIcon" />
                                        <span className='text-[12px]'>
                                            Begins Jun 5th and 6:00Pm
                                        </span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 text-[12px]' >
                                    <img src={UserImage} style={{ borderRadius: '50%', width: '35px', height: '35px' }} alt="UserImage" />
                                    <span>Instructor :</span>
                                    <span>Johnson</span>
                                </div>

                                <div className='py-9'>
                                    <button className='py-3 px-16 text-white text-[14px] flex items-center' style={{
                                        background: "linear-gradient(94.18deg, #00AEBD -38.75%, #1D5BBF 195.51%)",
                                        borderRadius: '5px'
                                    }}
                                        onClick={() => navigate('/program-task/1')}
                                    >Join Program
                                        <span className='pl-8 pt-1'><img style={{ width: '15px', height: '13px' }} src={DoubleArrowIcon} alt="DoubleArrowIcon" /></span>
                                    </button>
                                </div>

                            </div>





                            {/* Right Side Content */}
                            <div className='right-side-content'>
                                <div style={{ border: '1px solid rgba(223, 237, 255, 1)', borderRadius: '10px' }}
                                    className='px-6 pt-6 pb-3'>
                                    <ul className='flex flex-col gap-3'>
                                        <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px' }}>
                                            <span>Ratings</span>
                                            <span className='flex gap-2 items-center'>
                                                <img src={RatingsIcon} style={{ width: '12px', height: '12px' }} alt="RatingsIcon" />
                                                4.8 (36,763 reviews)</span>
                                        </li>
                                        <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}>
                                            <span>Course Level</span>
                                            <span>Beginner level</span>
                                        </li>
                                        <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Date</span>
                                            <span>06/5/2024</span>
                                        </li>
                                        <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Duration</span>
                                            <span>Beginner level</span>
                                        </li>
                                        <li className='flex justify-between text-[12px]' style={{ borderBottom: '1px solid rgba(217, 217, 217, 1)', paddingBottom: '10px', paddingTop: '14px' }}> <span>Schedule</span>
                                            <span>Flexible schedule</span>
                                        </li>
                                        <li className='flex justify-between text-[12px]' style={{ paddingTop: '14px' }}> <span>Mentees</span>
                                            <span>50</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        {/* Detail Section */}
                        <div className='details-section px-6 py-11 mb-10' style={{ background: 'rgba(249, 249, 249, 1)', borderRadius: '10px' }}>
                            <div className='tabs flex gap-4'>
                                {
                                    tabs.map((tab) =>
                                        <button key={tab.key}
                                            className={`px-12 py-3 text-[12px] ${activeTab === tab.key ? 'tab-active' : 'tab'} `}
                                            onClick={() => handleTab(tab.key)}>
                                            {tab.name}
                                        </button>)
                                }
                            </div>
                            <div className='tab-content px-6 pt-10 text-[12px]'>
                                <div className={`about-programs ${activeTab === 'about_program' ? 'block' : 'hidden'}`}>
                                    <div className='learning'>
                                        <div className='font-semibold pb-3'>What you'll learn</div>
                                        <p className='pb-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.</p>
                                        <ul className='leading-9 list-disc ml-4'>
                                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                        </ul>
                                    </div>
                                    <div className='skills pt-8'>
                                        <div className='font-semibold pb-5'>Skills you'll gain</div>
                                        <ul className='flex gap-3'>
                                            <li className='px-8 py-3' style={{ background: 'rgba(234, 237, 240, 1)', borderRadius: '30px' }}>Lorem Ipsum  </li>
                                            <li className='px-8 py-3' style={{ background: 'rgba(234, 237, 240, 1)', borderRadius: '30px' }}>Lorem Ipsum  </li>
                                            <li className='px-8 py-3' style={{ background: 'rgba(234, 237, 240, 1)', borderRadius: '30px' }}>Lorem Ipsum  </li>
                                            <li className='px-8 py-3' style={{ background: 'rgba(234, 237, 240, 1)', borderRadius: '30px' }}>Lorem Ipsum  </li>
                                        </ul>
                                    </div>

                                    <div className='sponsor pt-8'>
                                        <div className='font-semibold pb-5'>Sponsored by </div>
                                        <ul className='flex gap-5'>
                                            <img src={SponsorIcon} alt="SponsorIcon" />
                                            <img src={SponsorIcon} alt="SponsorIcon" />
                                            <img src={SponsorIcon} alt="SponsorIcon" />
                                        </ul>
                                    </div>

                                </div>

                                <div className={`program-outcomes ${activeTab === 'program_outcomes' ? 'block' : 'hidden'}`}>
                                    <div className='benefits'>
                                        <div className='font-semibold pb-3'>Benefits</div>
                                        <ul className='leading-9 list-disc ml-4'>
                                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </li>
                                        </ul>
                                    </div>
                                    <div className='program-certificate pt-8'>
                                        <div className='font-semibold pb-3'>Program Certificate - 05</div>
                                        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
                                            <ul className="flex flex-wrap -mb-px">
                                                {
                                                    participatedTabs.map(participatedTab =>

                                                        <li className="me-2" key={participatedTab.key}>
                                                            <p className={`inline-block p-4 border-b-2 cursor-pointer border-transparent rounded-t-lg ${certificateActiveTab === participatedTab.key ? 'active  text-blue-600 border-blue-500' : ''} `}
                                                                onClick={() => handleCerificateTab(participatedTab.key)}
                                                            >{participatedTab.name}</p>
                                                        </li>

                                                    )
                                                }

                                            </ul>
                                        </div>

                                        {
                                            participatedTabs.map(participatedTab =>

                                                <div className={`certificate-tab-content flex items-center justify-between relative ${participatedTab.key === certificateActiveTab ? 'block' : 'hidden'}`} key={participatedTab.key}>
                                                    <div className='px-9 py-16 w-4/6 leading-6'>
                                                        {participatedTab.key} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                                        galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting,
                                                        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.
                                                    </div>
                                                    <img className='absolute right-0' src={CertificateIcon} alt="CertificateIcon" />
                                                </div>

                                            )
                                        }



                                    </div>
                                </div>


                                <div className={`program-outcomes ${activeTab === 'program_testimonials' ? 'block' : 'hidden'}`}>
                                    <div className='testimonials bg-white px-5 py-7'>
                                        <div className='flex justify-end'>
                                            <button className='py-2 px-6 mb-10' style={{ color: 'rgba(29, 91, 191, 1)', border: '1px dotted rgba(29, 91, 191, 1)', borderRadius: '3px' }}>Request Testimonials</button>
                                        </div>
                                        <div class="grid grid-cols-3 gap-8">

                                            <div className='pt-16 pb-2 px-7 leading-5 relative' style={{ background: 'rgba(248, 249, 250, 1)', }}>
                                                <img src={QuoteIcon} className='absolute top-[-16px]' alt="QuoteIcon" />
                                                <div className='relative'>
                                                    <p className='pb-7'>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                        ook.standard dummy text ever since the 1500s, ook.
                                                    </p>
                                                    <hr className='absolute' style={{ width: '496px', left: '-15px' }} />
                                                </div>

                                                <div className='flex gap-3 py-5'>
                                                    <img src={UserImage} alt="user" style={{ borderRadius: '50%', width: '38px', height: '35px' }} />
                                                    <div className='flex flex-col'>
                                                        <span style={{ color: 'rgba(0, 174, 189, 1)' }}>Alexander Johnson</span>
                                                        <span>Mentor</span>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className='pt-16 pb-2 px-7 leading-5 relative' style={{ background: 'rgba(248, 249, 250, 1)', }}>
                                                <img src={QuoteIcon} className='absolute top-[-16px]' alt="QuoteIcon" />
                                                <div className='relative'>
                                                    <p className='pb-7'>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                        ook.standard dummy text ever since the 1500s, ook.
                                                    </p>
                                                    <hr className='absolute' style={{ width: '496px', left: '-15px' }} />
                                                </div>

                                                <div className='flex gap-3 py-5'>
                                                    <img src={UserImage} alt="user" style={{ borderRadius: '50%', width: '38px', height: '35px' }} />
                                                    <div className='flex flex-col'>
                                                        <span style={{ color: 'rgba(0, 174, 189, 1)' }}>Alexander Johnson</span>
                                                        <span>Mentor</span>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className='pt-16 pb-2 px-7 leading-5 relative' style={{ background: 'rgba(248, 249, 250, 1)', }}>
                                                <img src={QuoteIcon} className='absolute top-[-16px]' alt="QuoteIcon" />
                                                <div className='relative'>
                                                    <p className='pb-7'>
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                        ook.standard dummy text ever since the 1500s, ook.
                                                    </p>
                                                    <hr className='absolute' style={{ width: '496px', left: '-15px' }} />
                                                </div>

                                                <div className='flex gap-3 py-5'>
                                                    <img src={UserImage} alt="user" style={{ borderRadius: '50%', width: '38px', height: '35px' }} />
                                                    <div className='flex flex-col'>
                                                        <span style={{ color: 'rgba(0, 174, 189, 1)' }}>Alexander Johnson</span>
                                                        <span>Mentor</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="col-span-4">
                                        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                                            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                                <div className="flex gap-4">
                                                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                                    <h4>Related Programs</h4>
                                                </div>
                                                <p className="text-[12px] py-2 px-2 cursor-pointer" style={{
                                                    background: 'rgba(217, 228, 242, 1)', color: 'rgba(29, 91, 191, 1)', borderRadius: '3px'
                                                }}>View All</p>
                                            </div>

                                            <div className="py-3 px-3 ">
                                                <Carousel>
                                                    {
                                                        curatedPrograms.map((curatedProgram, index) =>
                                                            <div key={index} className="curated-programs flex gap-1 items-center py-8 px-5 w-2/5">

                                                                <div className="w-full" style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                                                                    <div className="flex py-6 px-7 border-b-2 relative">
                                                                        <div className="w-6/12 h-full">
                                                                            <img className="object-cover w-full h-[130px]" src={curatedProgram.programImage} alt="Program Logo" />
                                                                        </div>
                                                                        <div className="flex flex-col gap-3">
                                                                            <p className="py-1 px-1 text-[12px] text-center rounded-3xl w-1/3" style={{ border: '1px solid rgba(238, 238, 238, 1)' }}>{curatedProgram.category}</p>
                                                                            <h4 className="text-[16px]">{curatedProgram.name}</h4>
                                                                            <span className="text-[12px]">{curatedProgram.desc}</span>
                                                                            <button className="text-white text-[12px] py-2 w-5/12" style={{ background: 'rgba(29, 91, 191, 1)', borderRadius: '5px' }}>View Details</button>
                                                                        </div>
       
                                                                    </div>


                                                                    
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </Carousel>
                                            </div>
                                        </div>
                                    </div> */}



                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )

}
