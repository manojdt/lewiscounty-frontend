import React, { useEffect, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardCard from '../../../shared/Card/DashboardCard';
import { pipeUrls, programActionStatus } from '../../../utils/constant';
import { Button } from '../../../shared';
import DataTable from '../../../shared/DataGrid';
import { mentorTaskColumns } from '../../../mock';
import ViewIcon from '../../../assets/images/view1x.png'
import MoreIcon from "../../../assets/icons/moreIcon.svg";
import { useDispatch, useSelector } from 'react-redux';
import { getMenteeTaskfromMentor } from '../../../services/task';
import { Backdrop, CircularProgress, Menu, MenuItem } from '@mui/material';


const MentorTask = () => {
    const [activeTaskMenu, setActiveTaskMenu] = useState('my-task')
    const [activeCategoryMenu, setActiveCategoryMenu] = useState('')
    const [activeTab, setActiveTab] = useState('all_programs')
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [seletedItem, setSelectedItem] = useState({})
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams()
    const { menteeTask, loading: menteeTaskLoading, status } = useSelector(state => state.tasks)
    const navigate = useNavigate();

    const taskList = [
        {
            name: 'My Task',
            key: 'my-task'
        },
        {
            name: 'Mentee Task',
            key: 'mentee-task'
        },
    ]

    const Category = [
        {
            name: 'Teaching',
            key: 'teaching',
            count: '02'
        },
        {
            name: 'Social',
            key: 'social',
            count: '10'
        },
        {
            name: 'Category 1',
            key: 'category1',
            count: '04'
        },
        {
            name: 'Category 2',
            key: 'category2',
            count: '20'
        },
    ]

    const tabs = [
        {
            name: 'All Programs',
            key: 'all_programs'
        },
        {
            name: 'Ongoing  Programs',
            key: 'ongoing_programs'
        },
        {
            name: 'Completed Programs',
            key: 'completed_programs'
        },
        {
            name: 'Abort Programs',
            key: 'abort_programs'
        }
    ]

    const handleTab = (key) => {
        setActiveTab(key)
    }

    const handleNavigateDetails = (program) => {
        let baseUrl = pipeUrls.programdetails
        if (Object.keys(program).length) {
            if (program.status === programActionStatus.yettostart) baseUrl = pipeUrls.assigntask
            if (program.status === programActionStatus.assigned) baseUrl = pipeUrls.startprogram
            if (program.status === programActionStatus.inprogress) baseUrl = pipeUrls.startprogram
            navigate(`${baseUrl}/${program.id}`)
        }
    }

    const handleBookmark = (program) => {
        // dispatch(updateProgram({ id: program.id, is_bookmark: !program.is_bookmark }))
    }

    const handleClick = (event, data) => {
        setSelectedItem(data)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const programs = [
        {
            "id": 2,
            "program_name": "React Bootcamp Demo",
            "session_count": "10",
            "description": "Description about program",
            "course_level": "beginner",
            "start_date": "2024-07-07T09:33:03Z",
            "end_date": "2024-07-12T09:33:03Z",
            "max_mentee_count": 10,
            "group_chat_requirement": false,
            "individual_chat_requirement": false,
            "venue": "USA",
            "about_program": "About program",
            "image": "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/lap_J6Ea08I.jpg",
            "image_url": "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/lap_J6Ea08I.jpg",
            "benefits": "Benefits",
            "testimonial_types": "blog",
            "mentor_id": null,
            "duration": 6,
            "mentor_manager_id": null,
            "status": "completed",
            "created_at": "2024-07-06T09:34:32.419883Z",
            "created_by": 4,
            "approved_by": null,
            "is_approve": false,
            "is_bookmark": false,
            "skills": [
                {
                    "id": 1,
                    "name": "Western",
                    "desc": "Music sample text",
                    "category": 5
                }
            ],
            "categories": [
                {
                    "id": 1,
                    "name": "Music"
                }
            ],
            "certifications": [
                {
                    "id": 1,
                    "name": "Carnatic",
                    "certificate_link": "http://www.sample.com",
                    "certificate_description": "THis is sample certificate for music",
                    "issue_date": "2024-07-05",
                    "category": 3
                }
            ],
            "members": [
                {
                    "id": 4,
                    "first_name": "Subramaniyan",
                    "last_name": "T",
                    "email": "subramaniyan@dataterrain.com"
                }
            ],
            "learning_materials": [
                {
                    "id": 1,
                    "category": 5,
                    "name": "Music Learning Material",
                    "material_type": "video",
                    "material_size": 742478,
                    "material_details": "This is sample learning video for development purpose",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/avi_video.avi",
                    "file_url": "/media/learning_materials/avi_video.avi"
                }
            ],
            "mentor_name": null
        },
        {
            "id": 11,
            "program_name": "ss",
            "session_count": "10",
            "description": "sss",
            "course_level": "beginner",
            "start_date": "2024-07-31T13:16:44.809000Z",
            "end_date": "2024-06-05T13:16:44.809000Z",
            "max_mentee_count": 5,
            "group_chat_requirement": true,
            "individual_chat_requirement": true,
            "venue": "11111",
            "about_program": "ss",
            "image": "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/Screenshot_15.png",
            "image_url": "http://mentor-backend.dataterrain-dev.net/media/sponsor_logo/Screenshot_15.png",
            "benefits": "ssss",
            "testimonial_types": "blog",
            "mentor_id": null,
            "duration": -55,
            "mentor_manager_id": null,
            "status": "inprogress",
            "created_at": "2024-07-08T13:18:26.736326Z",
            "created_by": 8,
            "approved_by": null,
            "is_approve": false,
            "is_bookmark": false,
            "skills": [
                {
                    "id": 3,
                    "name": "Boxing",
                    "desc": "This is sample boxing description",
                    "category": 3
                }
            ],
            "categories": [
                {
                    "id": 1,
                    "name": "Music"
                }
            ],
            "certifications": [
                {
                    "id": 1,
                    "name": "Carnatic",
                    "certificate_link": "http://www.sample.com",
                    "certificate_description": "THis is sample certificate for music",
                    "issue_date": "2024-07-05",
                    "category": 3
                }
            ],
            "members": [
                {
                    "id": 3,
                    "first_name": "Murugesh",
                    "last_name": "Sekar",
                    "email": "murugesh@dataterrain.com"
                },
                {
                    "id": 8,
                    "first_name": "Subash",
                    "last_name": "A",
                    "email": "subash@dataterrain.com"
                },
                {
                    "id": 10,
                    "first_name": "Stephen",
                    "last_name": "Johnson",
                    "email": "stephen@email.com"
                },
                {
                    "id": 12,
                    "first_name": "Karthikeyan",
                    "last_name": "D",
                    "email": "marketing@dataterrain.com"
                },
                {
                    "id": 13,
                    "first_name": "Dillli",
                    "last_name": "Rathnam",
                    "email": "dilli@dataterrain.com"
                },
                {
                    "id": 9,
                    "first_name": "Subramaniyan",
                    "last_name": "T",
                    "email": "tsubramaniyan2@gmail.com"
                },
                {
                    "id": 5,
                    "first_name": "Krishna",
                    "last_name": "M",
                    "email": "menteeuser@gmail.com"
                },
                {
                    "id": 6,
                    "first_name": "Karthik",
                    "last_name": "Subbaraj",
                    "email": "menteeuser1@gmail.com"
                },
                {
                    "id": 11,
                    "first_name": "Test",
                    "last_name": "User",
                    "email": "testuser@gmail.com"
                },
                {
                    "id": 14,
                    "first_name": "Sanjeev",
                    "last_name": "Kumar",
                    "email": "sanjeevkumar@email.com"
                },
                {
                    "id": 2,
                    "first_name": "Madhan",
                    "last_name": "K",
                    "email": "krishshajahan7@gmail.com"
                },
                {
                    "id": 4,
                    "first_name": "Subramaniyan",
                    "last_name": "T",
                    "email": "subramaniyan@dataterrain.com"
                },
                {
                    "id": 7,
                    "first_name": "karthick",
                    "last_name": "A",
                    "email": "karthick@gmail.com"
                },
                {
                    "id": 1,
                    "first_name": "",
                    "last_name": "",
                    "email": "admin@gmail.com"
                }
            ],
            "learning_materials": [
                {
                    "id": 3,
                    "category": 2,
                    "name": "Action Learning Material",
                    "material_type": "document",
                    "material_size": 1139524,
                    "material_details": "This is sample text for Action material",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/AWS_Certified_SysOps_Administrator_-_Associate_certificate.pdf",
                    "file_url": "/media/learning_materials/AWS_Certified_SysOps_Administrator_-_Associate_certificate.pdf"
                },
                {
                    "id": 6,
                    "category": 5,
                    "name": "ER Diagram Screenshot1",
                    "material_type": "document",
                    "material_size": 39246,
                    "material_details": "Details about the Mentor Mentee project",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/Pngtreeinstagram_icon_instagram_logo_3584852.png",
                    "file_url": "/media/learning_materials/Pngtreeinstagram_icon_instagram_logo_3584852.png"
                },
                {
                    "id": 5,
                    "category": 5,
                    "name": "Spiritual Learning MAterial",
                    "material_type": "document",
                    "material_size": 558428,
                    "material_details": "Sample text for Spiritual Learning Material",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/lap.jpg",
                    "file_url": "/media/learning_materials/lap.jpg"
                },
                {
                    "id": 4,
                    "category": 2,
                    "name": "Adventure Learning Material",
                    "material_type": "document",
                    "material_size": 269,
                    "material_details": "This is sample text for adventure",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/lap_QIA9XEi.jpg",
                    "file_url": "/media/learning_materials/lap_QIA9XEi.jpg"
                },
                {
                    "id": 2,
                    "category": 2,
                    "name": "Sports Learning Material",
                    "material_type": "document",
                    "material_size": 558428,
                    "material_details": "This is sample text for sports learning material",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/lap_6ajYWax.jpg",
                    "file_url": "/media/learning_materials/lap_6ajYWax.jpg"
                },
                {
                    "id": 1,
                    "category": 5,
                    "name": "Music Learning Material",
                    "material_type": "video",
                    "material_size": 742478,
                    "material_details": "This is sample learning video for development purpose",
                    "file": "http://mentor-backend.dataterrain-dev.net/media/learning_materials/avi_video.avi",
                    "file_url": "/media/learning_materials/avi_video.avi"
                }
            ],
            "mentor_name": null
        }
    ]

    const mentorTaskColumn = [
        ...mentorTaskColumns,
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            id: 4,
            renderCell: (params) => {
                return <>
                    <div className='cursor-pointer flex items-center h-full' onClick={(e) => handleClick(e, params.row)}>
                        <img src={MoreIcon} alt='ViewIcon' />
                    </div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => navigate(`/mentor-tasks-details/${seletedItem.id}?mentee_id=${seletedItem.mentee_id}`)} className='!text-[12px]'>
                            <img src={ViewIcon} alt="ViewIcon" field={params.id} className='pr-3 w-[30px]' />
                            View
                        </MenuItem>
                    </Menu>

                </>
            }


        },
    ]

    const alltaskList = [
        {
            name: 'All Task',
            key: 'all'
        },
        {
            name: 'New Task',
            key: 'newtask'
        },
        {
            name: 'Pending Task',
            key: 'pending'
        },
        {
            name: 'Waiting Task',
            key: 'waiting_for_approval'
        },
        {
            name: 'Rejected Task',
            key: 'rejected'
        },
        {
            name: 'Completed Task',
            key: 'completed'
        },
    ]

    const handleTaskMenu = (key) => {
        setActiveTaskMenu(key)
        if (key === 'mentee-task') {
            navigate(`${pipeUrls.mentortask}?type=menteetask`)

        }
    }

    const handleMenteeTaskFilterTab = (value) => {
        let queryString = `?status=${value}`
        if (searchParams.get("type") === 'menteetask') {
            queryString += `&type=${searchParams.get("type")}`
        }
        navigate(`${pipeUrls.mentortask}${queryString}`)
    }

    useEffect(() => {

        if (searchParams && searchParams.get("type") && searchParams.get("type") === 'menteetask' && !searchParams.get("status")) {
            dispatch(getMenteeTaskfromMentor());
            setActiveTaskMenu('mentee-task')
        }

        if (searchParams && searchParams.get("type") && searchParams.get("type") === 'menteetask' && searchParams.get("status") && searchParams.get("status") !== '') {
            dispatch(getMenteeTaskfromMentor({ status: searchParams.get("status") }));
            setActiveTaskMenu('mentee-task')
        }
    }, [searchParams])



    return (
        <div className="mentor-task px-9 py-9">
            <div className='px-3 py-5' style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.15)' }}>
                <div className='flex justify-between px-5 pb-4 mb-8 items-center border-b-2'>
                    <div className='flex gap-5 items-center text-[20px]'>
                        <p>Task</p>
                    </div>

                </div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={menteeTaskLoading}
                >
                    <CircularProgress color="inherit" />

                </Backdrop>
                <div className='mx-5'>

                    <div className="main-grid grid grid-cols-5 gap-3">
                        <div className="left-bar row-span-3 flex flex-col gap-8">
                            <div className="pb-3 w-full max-w-sm bg-white rounded-lg" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 1)' }}>
                                <div className="title flex justify-between py-3 px-4 border-b-2">
                                    <h4 className="text-base" style={{ color: 'rgba(29, 91, 191, 1)' }}>Task</h4>
                                </div>
                                <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
                                    {
                                        taskList.map((menu, index) => {
                                            return (
                                                <li className="" key={index}>
                                                    <div className={`flex justify-between py-2 px-6 rounded cursor-pointer menu-content ${activeTaskMenu === menu.key ? 'active' : ''}
                                                        `} aria-current="page"
                                                        onClick={() => handleTaskMenu(menu.key)}>
                                                        <span className="text-sm">{menu.name}</span>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                            </div>

                            <div className="pb-3 w-full max-w-sm bg-white rounded-lg" style={{ boxShadow: '4px 4px 25px 0px rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 1)' }}>
                                <div className="title flex justify-between py-3 px-4 border-b-2">
                                    <h4 className="text-base" style={{ color: 'rgba(29, 91, 191, 1)' }}>Category</h4>
                                </div>
                                <ul className="flex flex-col gap-2 p-4 md:p-0 mt-4 font-medium">
                                    {
                                        Category.map((menu, index) => {
                                            return (
                                                <li className="" key={index}>
                                                    <div className={`flex justify-between py-2 px-6 rounded cursor-pointer menu-content ${activeCategoryMenu === menu.key ? 'active' : ''}
                                                        `} aria-current="page"
                                                        onClick={() => setActiveCategoryMenu(menu.key)}>
                                                        <span className="text-sm">{menu.name}</span>
                                                        {/* <span className="text-sm">{menu.count}</span> */}
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                            </div>
                        </div>

                        <div className='flex relative flex-col col-span-4'>
                            {
                                activeTaskMenu === 'my-task' ?

                                    <>
                                        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-10">
                                            <ul className="flex flex-wrap -mb-px">
                                                {
                                                    tabs.map(participatedTab =>

                                                        <li className="me-2" key={participatedTab.key}>
                                                            <p className={`inline-block p-4 border-b-2 cursor-pointer rounded-t-lg ${activeTab === participatedTab.key ? 'active  text-blue-600 border-blue-500' : ''} `}
                                                                onClick={() => handleTab(participatedTab.key)}
                                                            >{participatedTab.name}</p>
                                                        </li>

                                                    )
                                                }

                                            </ul>
                                        </div>
                                        <DashboardCard
                                            title="All Programs"
                                            viewpage="/programs?type=yettostart"
                                            handleNavigateDetails={handleNavigateDetails}
                                            handleBookmark={handleBookmark}
                                            programs={programs}
                                        />
                                    </>

                                    : <>
                                        <div className='flex justify-between'>
                                            <div>
                                                <select style={{ border: '1px solid rgba(29, 91, 191, 1)', borderRadius: '3px' }}
                                                    className='px-4 py-4 w-[250px] text-[14px]'
                                                    onChange={(e) => handleMenteeTaskFilterTab(e.target.value)}
                                                >
                                                    {
                                                        alltaskList.map(task => <option value={task.key} selected={searchParams.get('status') === task.key}>{task.name}</option>)
                                                    }
                                                </select>
                                            </div>
                                            <Button btnType="button" btnCls="w-[150px]" btnName={'Create Task'} btnCategory="primary" />
                                        </div>

                                        <div className='task-list py-10'>
                                            <DataTable rows={menteeTask} columns={mentorTaskColumn} hideCheckbox />
                                        </div>
                                    </>
                            }

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default MentorTask

