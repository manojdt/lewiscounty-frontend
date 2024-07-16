import React from 'react';


import DataTable from '../../shared/DataGrid';

import UserImage from "../../assets/images/user.jpg";
import MoreIcon from '../../assets/images/more1x.png';
import MaleIcon from '../../assets/images/male.png';
import PhoneIcon from '../../assets/icons/phone.svg';
import SearchIcon from '../../assets/icons/search.svg';
import MaleProfileIcon from '../../assets/images/male-profile1x.png'
import FemaleProfileIcon from '../../assets/images/female-profile1x.png'

import CalendarIcon from '../../assets/images/Birthdaydate1x.png'
import MobileIcon from '../../assets/images/Mobilenumber1x.png'
import LocationIcon from '../../assets/images/Locationcolour1x.png'
import EmailIcon from '../../assets/icons/EmailColor.svg'

import StarIcon from '../../assets/icons/filledYellowStar.svg'

import Programs from '../Dashboard/Programs';

import { programActivityRows } from '../../mock';
import { recentRequest, programFeeds } from '../../utils/mock'

export default function MentorDetails() {

    const programActivityColumns = [{
        field: 'name',
        headerName: 'Program Name',
        width: 200,
        id: 0,
    },
    {
        field: 'manager',
        headerName: 'Mentor Manger',
        width: 150,
        id: 1,
    },
    {
        field: 'start_date',
        headerName: 'Program Date',
        width: 200,
        id: 2,
    },
    {
        field: 'end_date',
        headerName: 'Program End Date',
        width: 150,
        id: 3,
    },
    {
        field: 'admin',
        headerName: 'Admin Name',
        width: 200,
        id: 2,
    },
    {
        field: 'action',
        headerName: 'Achieve graphic',
        width: 200,
        id: 4,
        renderCell: (params) => {
            console.log('params', params)
            return <div className='flex items-center gap-2'>
                <div className='relative w-[50%]'>
                    <div style={{
                        background: 'rgba(0, 174, 189, 1)', width: '67%', borderRadius: '30px', height: '8px',
                        position: 'absolute', top: '8px'
                    }}></div>
                    <div style={{
                        background: 'rgba(217, 217, 217, 1)', width: '100%', borderRadius: '30px', height: '8px', marginTop: '8px',

                    }}></div>
                </div>
                <span>45%</span>
            </div>
        }


    },
    ];

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }
    return (
        <div className="px-9 my-6 grid">

            <div className='grid mb-10' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)', borderRadius: '5px' }}>
                <div className='breadcrum'>
                    <nav className="flex px-7 pt-6 pb-5 mx-2 border-b-2 justify-between" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <a href="#" className="inline-flex items-center text-sm font-medium" style={{ color: 'rgba(89, 117, 162, 1)' }}>
                                    Top Mentor
                                </a>
                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                        Mentor Profile </a>
                                </div>
                            </li>

                        </ol>
                        <div className='cursor-pointer' onClick={() => console.log('More')}>
                            <img src={MoreIcon} alt='MoreIcon' />
                        </div>
                    </nav>

                    <div className='content px-8'>
                        <div className="grid grid-cols-3 gap-7 mt-10">
                            <div className="col-span-2">
                                <div className='flex flex-col'>
                                    <div className='mentor-details flex py-4 px-4 items-center' style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px' }}>
                                        <div className='w-[165px] px-5 flex justify-center items-center h-[180px]' style={{ borderRight: '1px solid rgba(29, 91, 191, 1)' }}>
                                            <img style={{ borderRadius: '50%', height: '117px', width: '100%' }} src={MaleIcon} alt="MaleIcon" />
                                        </div>
                                        <div className='pl-4'>
                                            <div>Jhon Doe (Software Developer)</div>
                                            <p className='text-[12px] py-3'>
                                                The purpose of lorem ipsum is to create a natural looking block of text
                                                (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy
                                            </p>
                                            <div className="grid grid-cols-2 gap-7">
                                                <div >
                                                    <div className='contact-info flex gap-3 items-center pt-2 pb-4'>
                                                        <img src={MobileIcon} alt="PhoneIcon" />
                                                        <span className='text-[12px]'>+1 43 456890</span>
                                                    </div>
                                                    <div className='contact-info flex gap-3 items-center pt-2'>
                                                        <img src={CalendarIcon} alt="CalendarIcon" />
                                                        <span className='text-[12px]'>19/03/1980</span>
                                                    </div>
                                                </div>

                                                <div className='pb-5'>
                                                    <div className='contact-info flex gap-3 items-center pt-2 pb-4'>
                                                        <img src={EmailIcon} alt="EmailIcon" />
                                                        <span className='text-[12px]'>Johnson@gmail.com</span>
                                                    </div>
                                                    <div className='contact-info flex gap-3 items-center pt-2'>
                                                        <img src={LocationIcon} alt="LocationIcon" />
                                                        <span className='text-[12px]'>101, Elanxa Apartments, 340 N Madison Avenue</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-7 mt-8">
                                        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                                            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                                <div className="flex gap-4">
                                                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                                    <h4>About Mentor</h4>
                                                </div>

                                            </div>
                                            <div className='py-4 px-6'>
                                                <div className='text-[14px] mb-7'>
                                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                                                    et dolore magna aliqua. Ut enim ad minim veniam,"Lorem ipsum dolor sit amet, consectetur
                                                    dolore magna aliqua. Ut enim ad minim veniam,..
                                                </div>
                                                <div className="grid grid-cols-2 gap-7 text-[14px] pb-5">
                                                    <p className='text-bold'>Gender</p>
                                                    <p>Male</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-7 text-[14px] pb-5">
                                                    <p className='text-bold'>Designation</p>
                                                    <p>Student</p>
                                                </div>

                                            </div>
                                        </div>


                                        <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>
                                            <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                                <div className="flex gap-4">
                                                    <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                                    <h4>Mentor Skills</h4>
                                                </div>

                                            </div>
                                            <div className='py-4 px-6'>
                                                <div className='py-3'>
                                                    <p className='flex justify-between text-[14px]'>
                                                        <span>Teaching skill</span>
                                                        <span>67%</span>
                                                    </p>
                                                    <div className='relative'>
                                                        <div style={{
                                                            background: 'rgba(0, 174, 189, 1)', width: '67%', borderRadius: '30px', height: '8px',
                                                            position: 'absolute'
                                                        }}></div>
                                                        <div style={{
                                                            background: 'rgba(217, 217, 217, 1)', width: '100%', borderRadius: '30px', height: '8px', marginTop: '8px',

                                                        }}></div>
                                                    </div>
                                                </div>

                                                <div className='py-3'>
                                                    <p className='flex justify-between text-[14px]'>
                                                        <span>Program skill</span>
                                                        <span>32%</span>
                                                    </p>
                                                    <div className='relative'>
                                                        <div style={{
                                                            background: 'rgba(29, 91, 191, 1)', width: '32%', borderRadius: '30px', height: '8px',
                                                            position: 'absolute'
                                                        }}></div>
                                                        <div style={{
                                                            background: 'rgba(217, 217, 217, 1)', width: '100%', borderRadius: '30px', height: '8px', marginTop: '8px',

                                                        }}></div>
                                                    </div>

                                                </div>

                                                <div className='py-3'>
                                                    <p className='flex justify-between text-[14px]'>
                                                        <span>Speaking skill</span>
                                                        <span>55%</span>
                                                    </p>
                                                    <div className='relative'>
                                                        <div style={{
                                                            background: 'rgba(255, 138, 0, 1)', width: '55%', borderRadius: '30px', height: '8px',
                                                            position: 'absolute'
                                                        }}></div>
                                                        <div style={{
                                                            background: 'rgba(217, 217, 217, 1)', width: '100%', borderRadius: '30px', height: '8px', marginTop: '8px',

                                                        }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }} className='mt-8'>
                                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                            <div className="flex gap-4">
                                                <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                                <h4>{'Program Activity'}</h4>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <img src={SearchIcon} alt="statistics" />
                                                <p className="text-[12px] py-2 px-2" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>View All</p>
                                            </div>
                                        </div>
                                        <div className='py-4 px-10'>
                                            <DataTable rows={programActivityRows} columns={programActivityColumns} hideCheckbox hideFooter />
                                        </div>
                                    </div>


                                    <div style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }} className='mt-8'>
                                        <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                            <div className="flex gap-4">
                                                <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                                <h4>{'Related Mentors'}</h4>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <p className="text-[12px] py-2 px-2" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>View All</p>
                                            </div>
                                        </div>

                                        <div className="content flex gap-4 py-5 px-5 overflow-x-auto">
                                            {
                                                recentRequest.map((recentRequest, index) =>
                                                    <div key={index} className="lg:w-5/12 md:w-1/3 py-3 px-3" style={{ border: '1px solid rgba(219, 224, 229, 1)', borderRadius: '10px' }}>
                                                        <div className="flex gap-2 pb-3">
                                                            <div className="w-1/4"> <img src={index % 2 === 0 ? MaleProfileIcon : FemaleProfileIcon} alt="male-icon" /> </div>
                                                            <div className="flex flex-col gap-2">
                                                                <p className="text-[12px]">{recentRequest.name}<span>(Mentor)</span></p>
                                                                <p className="text-[12px]">Software Developer</p>
                                                                <p className="text-[12px] flex gap-1"><img src={StarIcon} alt="StarIcon" /> 4.5 Ratings</p>

                                                                <button style={{ border: '1px solid rgba(29, 91, 191, 1)', color: 'rgba(29, 91, 191, 1)', fontSize: '12px', borderRadius: '30px', padding: '7px' }}>Connect</button>
                                                            </div>
                                                            <div className="pt-1 cursor-pointer" style={{ marginLeft: 'auto' }}><img src={MoreIcon} alt="MoreIcon" /></div>
                                                        </div>


                                                    </div>

                                                )
                                            }
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div>

                                <div style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }}>

                                    <div className='py-4 px-6'>
                                        <div className='flex justify-around'>
                                            <div className='text-center'>
                                                <p className='text-[12px]'>Followers</p>
                                                <p className='text-[18px]'>85</p>
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-[12px]'>Following</p>
                                                <p className='text-[18px]'>18</p>
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-[12px]'>Posts</p>
                                                <p className='text-[18px]'>10</p>
                                            </div>
                                        </div>

                                        <div className='flex justify-center pt-6 gap-5'>
                                            <button style={{background:'rgba(29, 91, 191, 1)', color:'#fff', borderRadius:'6px'}} className='py-3 px-4 text-[14px] w-[20%]'>Follow</button>
                                            <button style={{background:'rgba(0, 174, 189, 1)', color:'#fff', borderRadius:'6px'}} className='py-3 px-4 text-[14px] w-[20%]'>Chat</button>
                                        </div>


                                    </div>
                                </div>

                                <div style={{ boxShadow: '4px 4px 15px 0px rgba(0, 0, 0, 0.05)', borderRadius: '10px' }} className='mt-8'>
                                    <div className="title flex justify-between py-3 px-4 border-b-2 items-center">
                                        <div className="flex gap-4">
                                            <div className="card-dash" style={{ background: 'linear-gradient(180deg, #00B1C0 0%, #005DC6 100%)' }} ></div>
                                            <h4>
                                                Mentor Feeds
                                            </h4>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <img src={SearchIcon} alt="statistics" />
                                            <p className="text-[12px] py-2 px-2" style={{ background: 'rgba(223, 237, 255, 1)', borderRadius: '5px' }}>View All</p>
                                        </div>

                                    </div>

                                    {
                                        programFeeds.map((programFeeds, index) =>
                                            <div key={index} className="mx-9 my-9">
                                                <div className="flex py-3 px-3 gap-4">
                                                    <img src={UserImage} className={`${getWindowDimensions().width <= 1536 ? 'w-1/5' : 'w-1/6'} rounded-xl h-[100px]`} style={{ height: getWindowDimensions().width <= 1536 ? '90px' : '100px' }} alt="" />
                                                    <div className="flex flex-col gap-4">
                                                        <div className='flex items-center gap-3'>
                                                            <h3 >{programFeeds.title}  </h3>
                                                            <span className="lg:w-2 lg:h-2  rounded-full" style={{ background: 'rgba(0, 174, 189, 1)' }}></span> 10min ago
                                                        </div>

                                                        <h4 className="text-[12px]">{programFeeds.desc}</h4>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div >
    )

}
